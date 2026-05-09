<script setup>
import { computed, ref } from 'vue';
import { BOARD_HEIGHT, BOARD_WIDTH, categories, cellShapes, clamp, routePresets } from '../lib/boardConfig';
import { readFileAsDataUrl } from '../lib/boardStorage';

const props = defineProps({
  backgroundImage: { type: String, default: '' },
  boardName: { type: String, required: true },
  isEditing: { type: Boolean, default: false },
  route: { type: Array, required: true },
  selectedCellIndex: { type: Number, default: null },
  selectedPreset: { type: String, required: true }
});

const emit = defineEmits([
  'enable-editing',
  'save',
  'update:backgroundImage',
  'update:boardName',
  'update:route',
  'update:selectedCellIndex',
  'update:selectedPreset'
]);

const selectedCell = computed(() => {
  if (props.selectedCellIndex === null) return null;
  return props.route[props.selectedCellIndex] ?? null;
});
const bulkAddCount = ref(3);
const selectedCellIds = ref(new Set());
const selectedCellCount = computed(() => selectedCellIds.value.size);
const removableSelectedCount = computed(() => {
  const endpointIds = new Set([props.route[0]?.id, props.route[props.route.length - 1]?.id]);
  return props.route.filter((cell) => selectedCellIds.value.has(cell.id) && !endpointIds.has(cell.id)).length;
});

function addCell() {
  const nextRoute = addCellsToRoute(props.route, 1);
  emit('update:route', markEndpoints(nextRoute));
  emit('update:selectedCellIndex', nextRoute.length - 2);
}

function addSeveralCells() {
  const count = clamp(Math.round(bulkAddCount.value), 1, 30);
  const nextRoute = addCellsToRoute(props.route, count);
  emit('update:route', markEndpoints(nextRoute));
  emit('update:selectedCellIndex', nextRoute.length - 2);
}

function addCellsToRoute(route, count) {
  const nextRoute = route.map((cell) => ({ ...cell }));

  for (let index = 0; index < count; index += 1) {
    insertCellBeforeFinish(nextRoute);
  }

  return nextRoute;
}

function insertCellBeforeFinish(nextRoute) {
  const anchor = nextRoute[nextRoute.length - 2] ?? nextRoute[nextRoute.length - 1];
  const previous = nextRoute[nextRoute.length - 3] ?? anchor;
  const dx = clamp(anchor.x - previous.x, -100, 100) || 92;
  const dy = clamp(anchor.y - previous.y, -100, 100);

  nextRoute.splice(nextRoute.length - 1, 0, {
    id: crypto.randomUUID(),
    x: clamp(anchor.x + dx, 70, BOARD_WIDTH - 70),
    y: clamp(anchor.y + dy, 70, BOARD_HEIGHT - 70),
    shape: 'circle',
    category: 'explain'
  });
}

function removeSelectedCell() {
  const index = props.selectedCellIndex;
  if (index === null || props.route.length <= 8 || index === 0 || index === props.route.length - 1) return;

  const nextRoute = props.route.filter((_, cellIndex) => cellIndex !== index);
  emit('update:route', markEndpoints(nextRoute));
  emit('update:selectedCellIndex', null);
}

function toggleCellSelection(cellId) {
  const nextSelection = new Set(selectedCellIds.value);
  if (nextSelection.has(cellId)) {
    nextSelection.delete(cellId);
  } else {
    nextSelection.add(cellId);
  }
  selectedCellIds.value = nextSelection;
}

function selectAllMiddleCells() {
  selectedCellIds.value = new Set(props.route.slice(1, -1).map((cell) => cell.id));
}

function clearCellSelection() {
  selectedCellIds.value = new Set();
}

function removeSelectedCells() {
  if (!removableSelectedCount.value || props.route.length <= 8) return;

  let removeSlots = props.route.length - 8;
  const removableIds = new Set();
  props.route.forEach((cell, index) => {
    const isEndpoint = index === 0 || index === props.route.length - 1;
    if (!isEndpoint && selectedCellIds.value.has(cell.id) && removeSlots > 0) {
      removableIds.add(cell.id);
      removeSlots -= 1;
    }
  });

  if (!removableIds.size) return;

  const nextRoute = props.route.filter((cell) => !removableIds.has(cell.id));
  emit('update:route', markEndpoints(nextRoute));
  emit('update:selectedCellIndex', null);
  selectedCellIds.value = new Set();
}

function updateSelectedCell(field, value) {
  const index = props.selectedCellIndex;
  if (index === null) return;

  const nextRoute = props.route.map((cell) => ({ ...cell }));
  nextRoute[index][field] = field === 'x' || field === 'y' ? Number(value) : value;
  emit('update:route', markEndpoints(nextRoute));
}

async function uploadBackground(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  emit('update:backgroundImage', await readFileAsDataUrl(file));
  event.target.value = '';
}

function markEndpoints(route) {
  return route.map((cell, index) => ({
    ...cell,
    category: index === 0 ? 'start' : index === route.length - 1 ? 'finish' : cell.category
  }));
}
</script>

<template>
  <section class="panel-section">
    <div class="section-title">
      <h2>Редактор поля</h2>
      <button class="icon-button" type="button" title="Добавить клетку" @click="addCell">＋</button>
    </div>

    <button v-if="!isEditing" class="primary-button wide" type="button" @click="emit('enable-editing')">
      Включить редактирование
    </button>

    <label class="field">
      <span>Название борда</span>
      <input :value="boardName" type="text" @input="emit('update:boardName', $event.target.value)" />
    </label>

    <label class="field">
      <span>Шаблон</span>
      <select :value="selectedPreset" @change="emit('update:selectedPreset', $event.target.value)">
        <option v-for="(preset, key) in routePresets" :key="key" :value="key">{{ preset.name }}</option>
      </select>
    </label>

    <label class="file-field">
      <span>Фон поля</span>
      <input type="file" accept="image/*" @change="uploadBackground" />
    </label>

    <div class="button-row">
      <button class="secondary-button" type="button" :disabled="!backgroundImage" @click="emit('update:backgroundImage', '')">
        Убрать фон
      </button>
      <button class="primary-button" type="button" @click="emit('save')">Сохранить борд</button>
    </div>

    <div class="cell-list-tools">
      <label class="field">
        <span>Добавить клеток</span>
        <input v-model.number="bulkAddCount" type="number" min="1" max="30" />
      </label>
      <button class="secondary-button" type="button" @click="addSeveralCells">Добавить</button>
    </div>

    <div class="cell-list-head">
      <strong>Все клетки</strong>
      <span>{{ route.length }}</span>
    </div>

    <div class="button-row compact-actions">
      <button class="ghost-button text-button" type="button" @click="selectAllMiddleCells">Выбрать</button>
      <button class="ghost-button text-button" type="button" :disabled="!selectedCellCount" @click="clearCellSelection">Снять</button>
      <button class="danger-button compact-danger" type="button" :disabled="!removableSelectedCount || route.length <= 8" @click="removeSelectedCells">
        Удалить {{ removableSelectedCount || '' }}
      </button>
    </div>

    <div class="route-cell-list">
      <button
        v-for="(cell, index) in route"
        :key="cell.id"
        class="route-cell-row"
        :class="{ active: selectedCellIndex === index }"
        type="button"
        @click="emit('update:selectedCellIndex', index)"
      >
        <input
          :checked="selectedCellIds.has(cell.id)"
          :disabled="index === 0 || index === route.length - 1"
          type="checkbox"
          @click.stop
          @change="toggleCellSelection(cell.id)"
        />
        <span class="route-cell-number">{{ index + 1 }}</span>
        <i :style="{ background: categories.find((category) => category.id === cell.category)?.color }"></i>
        <strong>{{ categories.find((category) => category.id === cell.category)?.label }}</strong>
      </button>
    </div>

    <div class="cell-inspector">
      <div class="section-title compact-title">
        <h2>Клетка</h2>
        <span v-if="selectedCell">№ {{ selectedCellIndex + 1 }}</span>
      </div>

      <template v-if="selectedCell">
        <label class="field">
          <span>Тип</span>
          <select
            :value="selectedCell.category"
            :disabled="selectedCellIndex === 0 || selectedCellIndex === route.length - 1"
            @change="updateSelectedCell('category', $event.target.value)"
          >
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.label }}
            </option>
          </select>
        </label>

        <label class="field">
          <span>Форма</span>
          <select :value="selectedCell.shape || 'circle'" @change="updateSelectedCell('shape', $event.target.value)">
            <option v-for="shape in cellShapes" :key="shape.id" :value="shape.id">{{ shape.label }}</option>
          </select>
        </label>

        <div class="coordinate-grid">
          <label class="field">
            <span>X</span>
            <input :value="Math.round(selectedCell.x)" type="number" min="44" :max="BOARD_WIDTH - 44" @input="updateSelectedCell('x', $event.target.value)" />
          </label>
          <label class="field">
            <span>Y</span>
            <input :value="Math.round(selectedCell.y)" type="number" min="44" :max="BOARD_HEIGHT - 44" @input="updateSelectedCell('y', $event.target.value)" />
          </label>
        </div>

        <button
          class="danger-button wide"
          type="button"
          :disabled="selectedCellIndex === 0 || selectedCellIndex === route.length - 1 || route.length <= 8"
          @click="removeSelectedCell"
        >
          Удалить клетку
        </button>
      </template>

      <p v-else class="empty-note">Нажмите на клетку на поле, чтобы изменить её.</p>
    </div>
  </section>
</template>

<style scoped src="./BoardEditor.css"></style>

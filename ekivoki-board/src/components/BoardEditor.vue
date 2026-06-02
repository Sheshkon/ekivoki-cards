<script setup>
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  CELL_CLAMP_PADDING,
  MAX_BULK_ADD_CELLS,
  MIN_ROUTE_CELLS,
  categories,
  cellShapes,
  getCategory,
  routePresets
} from '../lib/boardConfig';
import { readFileAsDataUrl } from '../lib/boardStorage';
import { useRouteEditor } from '../composables/useRouteEditor';

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

const {
  bulkAddCount,
  selectedCell,
  selectedCellIds,
  selectedCellCount,
  removableSelectedCount,
  addCell,
  addSeveralCells,
  canRemoveCell,
  clearCellSelection,
  removeSelectedCell,
  removeSelectedCells,
  selectAllMiddleCells,
  toggleCellSelection,
  updateSelectedCell
} = useRouteEditor(props, emit);

async function uploadBackground(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  emit('update:backgroundImage', await readFileAsDataUrl(file));
  event.target.value = '';
}
</script>

<template>
  <section class="panel-section">
    <div class="section-title">
      <h2>Редактор поля</h2>
      <button class="icon-button" type="button" title="Добавить клетку" @click="addCell">+</button>
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
        <input v-model.number="bulkAddCount" type="number" min="1" :max="MAX_BULK_ADD_CELLS" />
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
      <button class="danger-button compact-danger" type="button" :disabled="!removableSelectedCount || route.length <= MIN_ROUTE_CELLS" @click="removeSelectedCells">
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
        <i :style="{ background: getCategory(cell.category).color }"></i>
        <strong>{{ getCategory(cell.category).label }}</strong>
      </button>
    </div>

    <div class="cell-inspector">
      <div class="section-title compact-title">
        <h2>Клетка</h2>
        <span v-if="selectedCell">N {{ selectedCellIndex + 1 }}</span>
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
            <input
              :value="Math.round(selectedCell.x)"
              type="number"
              :min="CELL_CLAMP_PADDING"
              :max="BOARD_WIDTH - CELL_CLAMP_PADDING"
              @input="updateSelectedCell('x', $event.target.value)"
            />
          </label>
          <label class="field">
            <span>Y</span>
            <input
              :value="Math.round(selectedCell.y)"
              type="number"
              :min="CELL_CLAMP_PADDING"
              :max="BOARD_HEIGHT - CELL_CLAMP_PADDING"
              @input="updateSelectedCell('y', $event.target.value)"
            />
          </label>
        </div>

        <button
          class="danger-button wide"
          type="button"
          :disabled="!canRemoveCell(selectedCellIndex)"
          @click="removeSelectedCell"
        >
          Удалить клетку
        </button>
      </template>

      <p v-else class="empty-note">Нажмите на клетку на поле, чтобы изменить ее.</p>
    </div>
  </section>
</template>

<style scoped src="./BoardEditor.css"></style>

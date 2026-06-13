<script setup>
import { ref } from 'vue';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  CELL_CLAMP_PADDING,
  MAX_BULK_ADD_CELLS,
  MIN_ROUTE_CELLS,
  categories,
  cellShapes,
  getCategory,
  resolveCategoryStyle,
  routePresets
} from '../lib/boardConfig';
import { readFileAsDataUrl } from '../lib/boardStorage';
import { useBoardStyleEditor } from '../composables/useBoardStyleEditor';
import { useRouteEditor } from '../composables/useRouteEditor';

const props = defineProps({
  backgroundImage: { type: String, default: '' },
  boardName: { type: String, required: true },
  boardStyle: { type: Object, required: true },
  isEditing: { type: Boolean, default: false },
  route: { type: Array, required: true },
  selectedCellIndex: { type: Number, default: null },
  selectedPreset: { type: String, required: true }
});

const emit = defineEmits([
  'disable-editing',
  'enable-editing',
  'save',
  'update:backgroundImage',
  'update:boardName',
  'update:boardStyle',
  'update:route',
  'update:selectedCellIndex',
  'update:selectedPreset'
]);

const editorSection = ref('cells');

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

const {
  updateBoardStyle,
  updateCategoryStyle,
  updateSelectedCategoryStyle
} = useBoardStyleEditor(props, emit);

const editorSections = [
  { id: 'cells', label: 'Клетки' },
  { id: 'types', label: 'Типы' },
  { id: 'appearance', label: 'Оформление' }
];

function categoryPreview(categoryId) {
  return resolveCategoryStyle(categoryId, props.boardStyle);
}

function selectedCellStyle() {
  if (!selectedCell.value) return null;
  return resolveCategoryStyle(selectedCell.value.category, props.boardStyle);
}

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
      <button
        v-if="isEditing"
        class="icon-button"
        type="button"
        title="Добавить клетку"
        @click="addCell"
      >
        +
      </button>
    </div>

    <button
      v-if="!isEditing"
      class="primary-button wide"
      type="button"
      @click="emit('enable-editing')"
    >
      Включить редактирование
    </button>
    <button
      v-else
      class="secondary-button wide"
      type="button"
      @click="emit('disable-editing')"
    >
      Закрыть редактирование
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

    <template v-if="isEditing">
      <nav class="editor-sections" aria-label="Разделы редактора">
        <button
          v-for="section in editorSections"
          :key="section.id"
          class="section-tab"
          :class="{ active: editorSection === section.id }"
          type="button"
          @click="editorSection = section.id"
        >
          {{ section.label }}
        </button>
      </nav>

      <template v-if="editorSection === 'cells'">
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
            <i :style="{ background: categoryPreview(cell.category).color }"></i>
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

            <p class="field-note">Цвет и форма применяются ко всем клеткам этого типа.</p>

            <label class="field color-field">
              <span>Цвет типа</span>
              <input
                :value="selectedCellStyle()?.color"
                type="color"
                @input="updateSelectedCategoryStyle('color', $event.target.value)"
              />
            </label>

            <label class="field">
              <span>Форма типа</span>
              <select
                :value="selectedCellStyle()?.shape"
                @change="updateSelectedCategoryStyle('shape', $event.target.value)"
              >
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
      </template>

      <template v-else-if="editorSection === 'types'">
        <p class="empty-note section-intro">Настройки типа применяются ко всем клеткам этого типа на поле.</p>

        <div class="type-style-list">
          <article v-for="category in categories" :key="category.id" class="type-style-card">
            <div class="type-style-head">
              <i :style="{ background: categoryPreview(category.id).color }"></i>
              <strong>{{ category.label }}</strong>
            </div>

            <label class="field color-field">
              <span>Цвет</span>
              <input
                :value="categoryPreview(category.id).color"
                type="color"
                @input="updateCategoryStyle(category.id, 'color', $event.target.value)"
              />
            </label>

            <label class="field">
              <span>Форма</span>
              <select
                :value="categoryPreview(category.id).shape"
                @change="updateCategoryStyle(category.id, 'shape', $event.target.value)"
              >
                <option v-for="shape in cellShapes" :key="shape.id" :value="shape.id">{{ shape.label }}</option>
              </select>
            </label>
          </article>
        </div>
      </template>

      <template v-else>
        <p class="empty-note section-intro">Размеры и цвета сохраняются вместе с бордом.</p>

        <label class="field color-field">
          <span>Цвет пути</span>
          <input
            :value="boardStyle.routeColor"
            type="color"
            @input="updateBoardStyle('routeColor', $event.target.value)"
          />
        </label>

        <label class="field">
          <span>Толщина пути</span>
          <input
            :value="boardStyle.routeStrokeWidth"
            type="number"
            min="4"
            max="48"
            @input="updateBoardStyle('routeStrokeWidth', $event.target.value)"
          />
        </label>

        <label class="field">
          <span>Прозрачность пути</span>
          <input
            :value="boardStyle.routeOpacity"
            type="number"
            min="0.05"
            max="1"
            step="0.05"
            @input="updateBoardStyle('routeOpacity', $event.target.value)"
          />
        </label>

        <label class="field">
          <span>Размер клетки</span>
          <input
            :value="boardStyle.cellSize"
            type="number"
            min="32"
            max="120"
            @input="updateBoardStyle('cellSize', $event.target.value)"
          />
        </label>

        <label class="field">
          <span>Ширина овала</span>
          <input
            :value="boardStyle.ovalCellWidth"
            type="number"
            min="40"
            max="160"
            @input="updateBoardStyle('ovalCellWidth', $event.target.value)"
          />
        </label>

        <label class="field">
          <span>Ширина фишки</span>
          <input
            :value="boardStyle.tokenWidth"
            type="number"
            min="24"
            max="100"
            @input="updateBoardStyle('tokenWidth', $event.target.value)"
          />
        </label>

        <label class="field">
          <span>Высота фишки</span>
          <input
            :value="boardStyle.tokenHeight"
            type="number"
            min="30"
            max="120"
            @input="updateBoardStyle('tokenHeight', $event.target.value)"
          />
        </label>
      </template>
    </template>

    <p v-else class="empty-note">Включите редактирование, чтобы двигать и настраивать клетки на поле.</p>
  </section>
</template>

<style scoped src="./BoardEditor.css"></style>

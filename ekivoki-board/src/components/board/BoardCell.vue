<script setup>
import { computed } from 'vue';
import { resolveCategoryStyle } from '../../lib/boardConfig';

const props = defineProps({
  boardStyle: { type: Object, required: true },
  cell: { type: Object, required: true },
  index: { type: Number, required: true },
  isDraggable: { type: Boolean, default: false },
  isEndpoint: { type: Boolean, default: false },
  isSelected: { type: Boolean, default: false },
  styleBuilder: { type: Function, required: true }
});

const category = computed(() => resolveCategoryStyle(props.cell.category, props.boardStyle));
const cellStyle = computed(() => ({
  ...props.styleBuilder(props.cell),
  '--cell-color': category.value.color
}));
</script>

<template>
  <button
    class="cell"
    :class="{ endpoint: isEndpoint, draggable: isDraggable, selected: isSelected }"
    :style="cellStyle"
    :title="`${index + 1}. ${category.label}`"
    type="button"
  >
    <span class="cell-body" :class="`shape-${category.shape || 'circle'}`">
      <span class="cell-label">{{ category.short }}</span>
      <small>{{ index + 1 }}</small>
    </span>
  </button>
</template>

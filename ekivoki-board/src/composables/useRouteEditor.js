import { computed, ref } from 'vue';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  CELL_INSERT_PADDING,
  MAX_BULK_ADD_CELLS,
  MIN_ROUTE_CELLS
} from '../lib/boardConstants';
import { clamp } from '../lib/boardMath';
import { markRouteEndpoints } from '../lib/boardFactories';

export function useRouteEditor(props, emit) {
  const bulkAddCount = ref(3);
  const selectedCellIds = ref(new Set());
  const selectedCell = computed(() => {
    if (props.selectedCellIndex === null) return null;
    return props.route[props.selectedCellIndex] ?? null;
  });
  const selectedCellCount = computed(() => selectedCellIds.value.size);
  const removableSelectedCount = computed(() => getRemovableSelectedIds().size);

  function addCell() {
    addCells(1);
  }

  function addSeveralCells() {
    addCells(clamp(Math.round(bulkAddCount.value), 1, MAX_BULK_ADD_CELLS));
  }

  function removeSelectedCell() {
    const index = props.selectedCellIndex;
    if (!canRemoveCell(index)) return;

    emitRoute(props.route.filter((_, cellIndex) => cellIndex !== index));
    emit('update:selectedCellIndex', null);
  }

  function removeSelectedCells() {
    const removableIds = getRemovableSelectedIds();
    if (!removableIds.size) return;

    emitRoute(props.route.filter((cell) => !removableIds.has(cell.id)));
    emit('update:selectedCellIndex', null);
    selectedCellIds.value = new Set();
  }

  function updateSelectedCell(field, value) {
    const index = props.selectedCellIndex;
    if (index === null) return;

    const nextRoute = props.route.map((cell) => ({ ...cell }));
    nextRoute[index][field] = field === 'x' || field === 'y' ? Number(value) : value;
    emitRoute(nextRoute);
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

  function canRemoveCell(index) {
    return index !== null && props.route.length > MIN_ROUTE_CELLS && index > 0 && index < props.route.length - 1;
  }

  function addCells(count) {
    const nextRoute = props.route.map((cell) => ({ ...cell }));
    for (let index = 0; index < count; index += 1) {
      insertCellBeforeFinish(nextRoute);
    }

    emitRoute(nextRoute);
    emit('update:selectedCellIndex', nextRoute.length - 2);
  }

  function insertCellBeforeFinish(nextRoute) {
    const anchor = nextRoute[nextRoute.length - 2] ?? nextRoute[nextRoute.length - 1];
    const previous = nextRoute[nextRoute.length - 3] ?? anchor;
    const dx = clamp(anchor.x - previous.x, -100, 100) || 92;
    const dy = clamp(anchor.y - previous.y, -100, 100);

    nextRoute.splice(nextRoute.length - 1, 0, {
      id: crypto.randomUUID(),
      x: clamp(anchor.x + dx, CELL_INSERT_PADDING, BOARD_WIDTH - CELL_INSERT_PADDING),
      y: clamp(anchor.y + dy, CELL_INSERT_PADDING, BOARD_HEIGHT - CELL_INSERT_PADDING),
      shape: 'circle',
      category: 'explain'
    });
  }

  function getRemovableSelectedIds() {
    if (props.route.length <= MIN_ROUTE_CELLS) return new Set();

    let removeSlots = props.route.length - MIN_ROUTE_CELLS;
    const removableIds = new Set();
    props.route.forEach((cell, index) => {
      const isEndpoint = index === 0 || index === props.route.length - 1;
      if (!isEndpoint && selectedCellIds.value.has(cell.id) && removeSlots > 0) {
        removableIds.add(cell.id);
        removeSlots -= 1;
      }
    });
    return removableIds;
  }

  function emitRoute(route) {
    emit('update:route', markRouteEndpoints(route));
  }

  return {
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
  };
}

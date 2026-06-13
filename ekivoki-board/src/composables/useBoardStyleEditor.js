import { applyCategoryStyleToRoute } from '../lib/boardStyle';

export function useBoardStyleEditor(props, emit) {
  const numericFields = new Set([
    'cellSize',
    'ovalCellWidth',
    'routeStrokeWidth',
    'routeOpacity',
    'tokenWidth',
    'tokenHeight'
  ]);

  function updateBoardStyle(field, value) {
    emit('update:boardStyle', {
      ...props.boardStyle,
      [field]: numericFields.has(field) ? Number(value) : value
    });
  }

  function updateCategoryStyle(categoryId, field, value) {
    const { route, boardStyle } = applyCategoryStyleToRoute(
      props.route,
      categoryId,
      field,
      value,
      props.boardStyle
    );

    emit('update:boardStyle', boardStyle);
    if (route !== props.route) {
      emit('update:route', route);
    }
  }

  function updateSelectedCategoryStyle(field, value) {
    const cell = props.route[props.selectedCellIndex];
    if (!cell) return;
    updateCategoryStyle(cell.category, field, value);
  }

  return {
    updateBoardStyle,
    updateCategoryStyle,
    updateSelectedCategoryStyle
  };
}

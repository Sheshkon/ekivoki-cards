import { BOARD_DIMENSIONS, categories, cellShapes, tokenColors } from './boardConstants';

export function createDefaultCategoryStyles() {
  return categories.reduce((styles, category) => {
    styles[category.id] = {
      color: category.color,
      shape: category.shape
    };
    return styles;
  }, {});
}

export function createDefaultBoardStyle() {
  return {
    cellSize: BOARD_DIMENSIONS.cellSize,
    ovalCellWidth: BOARD_DIMENSIONS.ovalCellWidth,
    routeColor: '#263142',
    routeStrokeWidth: BOARD_DIMENSIONS.routeStrokeWidth,
    routeOpacity: 0.22,
    tokenWidth: BOARD_DIMENSIONS.tokenWidth,
    tokenHeight: BOARD_DIMENSIONS.tokenHeight,
    tokenColors: createDefaultTokenColors(),
    categoryStyles: createDefaultCategoryStyles()
  };
}

export function mergeBoardStyle(style) {
  const defaults = createDefaultBoardStyle();
  if (!style || typeof style !== 'object') return defaults;

  const mergedCategoryStyles = { ...defaults.categoryStyles };
  if (style.categoryStyles && typeof style.categoryStyles === 'object') {
    for (const [categoryId, categoryStyle] of Object.entries(style.categoryStyles)) {
      if (!mergedCategoryStyles[categoryId]) continue;
      mergedCategoryStyles[categoryId] = {
        ...mergedCategoryStyles[categoryId],
        ...pickCategoryStyle(categoryStyle)
      };
    }
  }

  return {
    ...defaults,
    cellSize: positiveNumber(style.cellSize, defaults.cellSize),
    ovalCellWidth: positiveNumber(style.ovalCellWidth, defaults.ovalCellWidth),
    routeColor: typeof style.routeColor === 'string' ? style.routeColor : defaults.routeColor,
    routeStrokeWidth: positiveNumber(style.routeStrokeWidth, defaults.routeStrokeWidth),
    routeOpacity: clampNumber(style.routeOpacity, 0.05, 1, defaults.routeOpacity),
    tokenWidth: positiveNumber(style.tokenWidth, defaults.tokenWidth),
    tokenHeight: positiveNumber(style.tokenHeight, defaults.tokenHeight),
    tokenColors: mergeTokenColors(style.tokenColors, defaults.tokenColors),
    categoryStyles: mergedCategoryStyles
  };
}

export function resolveCategoryStyle(categoryId, boardStyle) {
  const category = categories.find((item) => item.id === categoryId) ?? categories[1];
  const override = boardStyle?.categoryStyles?.[categoryId] ?? {};
  return {
    id: category.id,
    label: category.label,
    short: category.short,
    color: override.color || category.color,
    shape: shapeExists(override.shape) ? override.shape : category.shape
  };
}

export function applyCategoryStyleToRoute(route, categoryId, styleField, value, boardStyle) {
  const nextCategoryStyles = {
    ...boardStyle.categoryStyles,
    [categoryId]: {
      ...boardStyle.categoryStyles[categoryId],
      [styleField]: value
    }
  };

  const nextRoute = styleField === 'shape'
    ? route.map((cell) => (cell.category === categoryId ? { ...cell, shape: value } : cell))
    : route;

  return {
    route: nextRoute,
    boardStyle: {
      ...boardStyle,
      categoryStyles: nextCategoryStyles
    }
  };
}

export function syncRouteWithCategoryStyles(route, boardStyle) {
  return route.map((cell) => {
    const categoryStyle = resolveCategoryStyle(cell.category, boardStyle);
    return {
      ...cell,
      shape: categoryStyle.shape
    };
  });
}

export function createDefaultTokenColors() {
  return [...tokenColors];
}

function mergeTokenColors(colors, defaults) {
  if (!Array.isArray(colors)) return defaults;
  return defaults.map((color, index) => (
    typeof colors[index] === 'string' ? colors[index] : color
  ));
}

function pickCategoryStyle(style) {
  if (!style || typeof style !== 'object') return {};
  const next = {};
  if (typeof style.color === 'string') next.color = style.color;
  if (shapeExists(style.shape)) next.shape = style.shape;
  return next;
}

function shapeExists(shapeId) {
  return cellShapes.some((shape) => shape.id === shapeId);
}

function positiveNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function clampNumber(value, min, max, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

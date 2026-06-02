import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  CELL_CLAMP_PADDING,
  DEFAULT_BOARD_ROUTE,
  categories,
  cellShapes,
  routePresetSource,
  tokenColors
} from './boardConstants';
import { clamp } from './boardMath';

function scalePresetPoints(points) {
  const scaleX = BOARD_WIDTH / 1150;
  const scaleY = BOARD_HEIGHT / 760;
  return points.map(([x, y]) => [
    Math.round(x * scaleX),
    Math.round(y * scaleY)
  ]);
}

export const routePresets = Object.fromEntries(
  Object.entries(routePresetSource).map(([key, preset]) => ([
    key,
    {
      ...preset,
      points: scalePresetPoints(preset.points)
    }
  ]))
);

export function createDefaultBoardRoute() {
  return DEFAULT_BOARD_ROUTE.map((cell) => ({
    id: crypto.randomUUID(),
    ...cell
  }));
}

export function createRoute(points) {
  const randomPool = categories.filter((category) => category.id !== 'start' && category.id !== 'finish');
  const totalChance = randomPool.reduce((sum, category) => sum + category.chance, 0);

  return points.map(([x, y], index) => {
    const category = getRouteCellCategory(index, points.length, randomPool, totalChance);
    return {
      id: crypto.randomUUID(),
      x,
      y,
      shape: category.shape,
      color: category.color,
      category: category.id
    };
  });
}

export function createPlayers(count, existingPlayers = []) {
  return Array.from({ length: count }, (_, index) => {
    const existing = existingPlayers[index];
    return {
      id: index + 1,
      name: existing?.name || `Игрок/команда ${index + 1}`,
      color: tokenColors[index],
      position: existing?.position || 0,
      moving: false
    };
  });
}

export function getCategory(categoryId) {
  return categories.find((category) => category.id === categoryId) ?? categories[1];
}

export function createDefaultRules() {
  return categories.reduce((rules, category) => {
    rules[category.id] = category.rule;
    return rules;
  }, {});
}

export function normalizeImportedRoute(route) {
  if (!Array.isArray(route) || route.length < 2) {
    return createDefaultBoardRoute();
  }

  return markRouteEndpoints(route.map((cell, index) => ({
    id: crypto.randomUUID(),
    x: clamp(cell.x, CELL_CLAMP_PADDING, BOARD_WIDTH - CELL_CLAMP_PADDING),
    y: clamp(cell.y, CELL_CLAMP_PADDING, BOARD_HEIGHT - CELL_CLAMP_PADDING),
    shape: shapeExists(cell.shape) ? cell.shape : 'circle',
    category: categoryExists(cell.category) ? cell.category : 'default'
  })));
}

export function markRouteEndpoints(route) {
  return route.map((cell, index) => ({
    ...cell,
    category: index === 0 ? 'start' : index === route.length - 1 ? 'finish' : cell.category
  }));
}

function getRouteCellCategory(index, routeLength, randomPool, totalChance) {
  if (index === 0) return getCategory('start');
  if (index === routeLength - 1) return getCategory('finish');

  let roll = Math.random() * totalChance;
  for (const category of randomPool) {
    roll -= category.chance;
    if (roll <= 0) return category;
  }
  return randomPool[randomPool.length - 1];
}

function categoryExists(categoryId) {
  return categories.some((category) => category.id === categoryId);
}

function shapeExists(shapeId) {
  return cellShapes.some((shape) => shape.id === shapeId);
}

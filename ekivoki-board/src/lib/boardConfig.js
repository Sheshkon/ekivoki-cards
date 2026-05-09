export const BOARD_WIDTH = 1200;
export const BOARD_HEIGHT = 760;

export const categories = [
  { id: 'start', label: 'Старт', short: 'S', color: '#24b36b', rule: 'Начальная клетка. Команды ставят фишки сюда.' },
  { id: 'explain', label: 'Объясни', short: 'О', color: '#2f80ed', rule: 'Объяснить слово без однокоренных слов.' },
  { id: 'draw', label: 'Рисуй', short: 'Р', color: '#f2c94c', rule: 'Нарисовать задание без букв и цифр.' },
  { id: 'show', label: 'Покажи', short: 'П', color: '#eb5757', rule: 'Показать слово жестами без звуков.' },
  { id: 'sing', label: 'Пой', short: '♪', color: '#9b51e0', rule: 'Напеть или произнести задание в заданном стиле.' },
  { id: 'back', label: 'Минус ход', short: '-1', color: '#4f4f4f', rule: 'Команда возвращается на одну клетку назад.' },
  { id: 'finish', label: 'Финиш', short: 'F', color: '#111827', rule: 'Финишная клетка. Команда завершает игру.' }
];

export const cellShapes = [
  { id: 'circle', label: 'Круг' },
  { id: 'oval', label: 'Овал' },
  { id: 'square', label: 'Квадрат' },
  { id: 'rectangle', label: 'Прямоугольник' },
  { id: 'diamond', label: 'Ромб' },
  { id: 'hexagon', label: 'Шестиугольник' }
];

export const tokenColors = ['#e63946', '#277da1', '#43aa8b', '#f8961e', '#8338ec', '#ff006e'];

export const routePresets = {
  classic: {
    name: 'Классика',
    points: [
      [92, 648], [190, 648], [288, 648], [386, 648], [484, 648], [582, 648],
      [680, 648], [778, 648], [876, 648], [974, 648], [1072, 648], [1072, 548],
      [974, 548], [876, 548], [778, 548], [680, 548], [582, 548], [484, 548],
      [386, 548], [288, 548], [190, 548], [190, 448], [288, 448], [386, 448],
      [484, 448], [582, 448], [680, 448], [778, 448], [876, 448], [974, 448],
      [974, 348], [876, 348], [778, 348], [680, 348], [582, 348], [484, 348],
      [386, 348], [288, 348], [288, 248], [386, 248], [484, 248], [582, 248],
      [680, 248], [778, 248], [876, 248], [876, 148], [778, 148], [680, 148],
      [582, 148], [484, 148], [386, 148]
    ]
  },
  spiral: {
    name: 'Спираль',
    points: [
      [94, 660], [214, 660], [334, 660], [454, 660], [574, 660], [694, 660],
      [814, 660], [934, 660], [1054, 660], [1054, 548], [1054, 436], [1054, 324],
      [1054, 212], [1054, 100], [934, 100], [814, 100], [694, 100], [574, 100],
      [454, 100], [334, 100], [214, 100], [94, 100], [94, 212], [94, 324],
      [94, 436], [94, 548], [214, 548], [334, 548], [454, 548], [574, 548],
      [694, 548], [814, 548], [934, 548], [934, 436], [934, 324], [934, 212],
      [814, 212], [694, 212], [574, 212], [454, 212], [334, 212], [214, 212],
      [214, 324], [214, 436], [334, 436], [454, 436], [574, 436], [694, 436],
      [814, 436], [814, 324], [694, 324], [574, 324]
    ]
  }
};

export function createRoute(points) {
  return points.map(([x, y], index) => ({
    id: crypto.randomUUID(),
    x,
    y,
    shape: index % 5 === 0 ? 'diamond' : index % 3 === 0 ? 'oval' : 'circle',
    category: index === 0 ? 'start' : index === points.length - 1 ? 'finish' : categories[(index % (categories.length - 2)) + 1].id
  }));
}

export function createPlayers(count, existingPlayers = []) {
  return Array.from({ length: count }, (_, index) => {
    const existing = existingPlayers[index];
    return {
      id: index + 1,
      name: existing?.name || `Команда ${index + 1}`,
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
    return createRoute(routePresets.classic.points);
  }

  return route.map((cell, index) => ({
    id: crypto.randomUUID(),
    x: clamp(cell.x, 44, BOARD_WIDTH - 44),
    y: clamp(cell.y, 44, BOARD_HEIGHT - 44),
    shape: shapeExists(cell.shape) ? cell.shape : 'circle',
    category: index === 0 ? 'start' : index === route.length - 1 ? 'finish' : categoryExists(cell.category) ? cell.category : 'explain'
  }));
}

function categoryExists(categoryId) {
  return categories.some((category) => category.id === categoryId);
}

function shapeExists(shapeId) {
  return cellShapes.some((shape) => shape.id === shapeId);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(Number(value), min), max);
}

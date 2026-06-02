const BASE_BOARD_WIDTH = 1150;
const BASE_BOARD_HEIGHT = 760;
const BOARD_SCALE = BASE_BOARD_WIDTH / 1150;

export const BOARD_DIMENSIONS = {
  width: BASE_BOARD_WIDTH,
  height: BASE_BOARD_HEIGHT,
  viewportMinHeight: 450,
  cellClampPadding: Math.round(44 * BOARD_SCALE),
  cellInsertPadding: Math.round(70 * BOARD_SCALE),
  cellSize: Math.round(64 * BOARD_SCALE),
  ovalCellWidth: Math.round(76 * BOARD_SCALE),
  rectangleCellWidth: Math.round(10 * BOARD_SCALE),
  selectionExtraSize: Math.round(18 * BOARD_SCALE),
  tokenWidth: Math.round(50 * BOARD_SCALE),
  tokenHeight: Math.round(62 * BOARD_SCALE),
  tokenRingSmall: Math.round(18 * BOARD_SCALE),
  tokenRingLarge: Math.round(23 * BOARD_SCALE),
  diceSize: Math.round(56 * BOARD_SCALE),
  diceClampPadding: Math.round(46 * BOARD_SCALE),
  routeStrokeWidth: Math.round(18 * BOARD_SCALE)
};

export const BOARD_WIDTH = BOARD_DIMENSIONS.width;
export const BOARD_HEIGHT = BOARD_DIMENSIONS.height;
export const CELL_CLAMP_PADDING = BOARD_DIMENSIONS.cellClampPadding;
export const CELL_INSERT_PADDING = BOARD_DIMENSIONS.cellInsertPadding;
export const DICE_CLAMP_PADDING = BOARD_DIMENSIONS.diceClampPadding;

export const DEFAULT_PRESET_ID = 'classic';
export const DEFAULT_BOARD_NAME = 'Мой борд';
export const DEFAULT_PLAYER_COUNT = 4;
export const MIN_ROUTE_CELLS = 8;
export const MAX_BULK_ADD_CELLS = 30;
export const MANUAL_STEP_LIMIT = 12;

export const DICE_THROW = {
  initialRotation: { x: -22, y: 32, z: -3, duration: 280 },
  defaultMoveDuration: 280,
  faceChangeMs: 150,
  faceChangeStopProgress: 0.82,
  minDurationMs: 1350,
  maxDurationMs: 2300,
  minBounceCount: 2,
  maxBounceCount: 4,
  minBounceHeight: 24,
  maxBounceHeight: 52,
  landingRouteOffsetMin: 2,
  landingRouteOffsetMax: 10,
  nearCellX: [-120, 120],
  nearCellY: [-140, 80],
  controlPointOneX: [120, 360],
  controlPointOneY: [-180, 120],
  controlPointTwoX: [-360, 180],
  controlPointTwoY: [-180, 160],
  rotationXTurns: [3, 6],
  rotationYTurns: [3, 6],
  rotationZTurns: [1, 3]
};

export const MOVE_TIMING = {
  activePlayerStepMs: 260,
  tokenDragStepMs: 180
};

export const categories = [
  {
    id: 'start',
    label: 'Старт',
    short: '',
    color: '#24b36b',
    shape: 'square',
    rule: 'Начальная клетка. Команды ставят фишки сюда.',
    chance: 0
  },
  {
    id: 'default',
    label: 'Обычная',
    short: '',
    color: '#048e0a',
    shape: 'circle',
    rule: 'Обычная клетка без эффекта.',
    chance: 0.5
  },
  {
    id: 'back',
    label: 'Минус ход',
    short: '',
    color: '#930000',
    shape: 'square',
    rule: 'Команда возвращается на одну клетку назад.',
    chance: 0.05
  },
  {
    id: 'explain',
    label: 'Объясни',
    short: '',
    color: '#2f80ed',
    shape: 'circle',
    rule: 'Объяснить слово без однокоренных слов.',
    chance: 0.1
  },
  {
    id: 'finish',
    label: 'Финиш',
    short: '',
    color: '#bc9900',
    shape: 'square',
    rule: 'Финишная клетка. Команда завершает игру.',
    chance: 0
  }
];

export const cellShapes = [
  { id: 'circle', label: 'Круг' },
  { id: 'oval', label: 'Овал' },
  { id: 'square', label: 'Квадрат' },
  { id: 'diamond', label: 'Ромб' }
];

export const tokenColors = ['#e63946', '#277da1', '#43aa8b', '#f8961e', '#8338ec', '#ff006e'];

export const DEFAULT_BOARD_ROUTE = [
  { x: 94, y: 660, category: 'start', shape: 'square' },
  { x: 200.65104164881632, y: 588.2962962753244, category: 'default', shape: 'circle' },
  { x: 299.4791666488163, y: 586.8889103432497, category: 'back', shape: 'square' },
  { x: 374.9479166488163, y: 639.6666881210275, category: 'default', shape: 'circle' },
  { x: 451.0156432609074, y: 677.6666881210275, category: 'back', shape: 'square' },
  { x: 535.4687682609074, y: 687.5185184975466, category: 'default', shape: 'circle' },
  { x: 623.5156432609074, y: 663.5926355222862, category: 'default', shape: 'circle' },
  { x: 710.9635416488163, y: 601.6666881210275, category: 'explain', shape: 'circle' },
  { x: 794.2187682609074, y: 556.6296296086576, category: 'explain', shape: 'circle' },
  { x: 833.7500182609074, y: 470.77779923213853, category: 'explain', shape: 'circle' },
  { x: 846.9271198729984, y: 389.1481588648425, category: 'explain', shape: 'circle' },
  { x: 814.5833698729984, y: 303.2962962753243, category: 'explain', shape: 'circle' },
  { x: 743.9062682609074, y: 242.0740740531021, category: 'explain', shape: 'circle' },
  { x: 657.0572916488163, y: 215.33333868119453, category: 'explain', shape: 'circle' },
  { x: 557.6302448729984, y: 245.59260330928697, category: 'explain', shape: 'circle' },
  { x: 516.127802428142, y: 315.42484418083643, category: 'explain', shape: 'circle' },
  { x: 524.980752737913, y: 448.5490423464308, category: 'explain', shape: 'circle' },
  { x: 447.4218932609074, y: 542.5555770099163, category: 'explain', shape: 'circle' },
  { x: 372.55209245486185, y: 508.0740740531021, category: 'explain', shape: 'circle' },
  { x: 274.44189018795726, y: 477.3594695446538, category: 'explain', shape: 'circle' },
  { x: 215.12702585092592, y: 415.76472862094056, category: 'explain', shape: 'circle' },
  { x: 227.52116844230105, y: 333.3071971220129, category: 'explain', shape: 'circle' },
  { x: 307.1978428071971, y: 308.4706109738818, category: 'explain', shape: 'circle' },
  { x: 313.25521745486185, y: 225.88889423675008, category: 'explain', shape: 'circle' },
  { x: 366.5625182609074, y: 154.8148255315092, category: 'explain', shape: 'circle' },
  { x: 451.61459245486185, y: 114.7037063671483, category: 'explain', shape: 'circle' },
  { x: 549.8437682609074, y: 88.66667201452786, category: 'explain', shape: 'circle' },
  { x: 646.2760416488163, y: 71.07407405310207, category: 'explain', shape: 'circle' },
  { x: 726.5364948729984, y: 94.2962962753243, category: 'explain', shape: 'circle' },
  { x: 813.9843932609074, y: 131.59259525603719, category: 'explain', shape: 'circle' },
  { x: 879.2708698729984, y: 193.51851849754652, category: 'explain', shape: 'circle' },
  { x: 971.170129181331, y: 186.2745325425092, category: 'explain', shape: 'circle' },
  { x: 1042.8791361097376, y: 102.82355215035233, category: 'finish', shape: 'square' }
];

export const routePresetSource = {
  classic: {
    name: 'Мой борд',
    points: DEFAULT_BOARD_ROUTE.map(({ x, y }) => [x, y])
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
      [814, 436], [814, 324], [694, 324], [574, 324], [454, 324], [334, 324]
    ]
  },
  snake: {
    name: 'Змейка',
    points: [
      [94, 660], [274, 660], [454, 660], [634, 660], [814, 660], [994, 660],
      [994, 548], [814, 548], [634, 548], [454, 548], [274, 548], [94, 548],
      [94, 436], [274, 436], [454, 436], [634, 436], [814, 436], [994, 436],
      [994, 324], [814, 324], [634, 324], [454, 324], [274, 324], [94, 324],
      [94, 212], [274, 212], [454, 212], [634, 212], [814, 212], [994, 212],
      [994, 100], [814, 100], [634, 100], [454, 100], [274, 100], [94, 100]
    ]
  },
  perimeter: {
    name: 'Периметр',
    points: [
      [94, 100], [214, 100], [334, 100], [454, 100], [574, 100],
      [694, 100], [814, 100], [934, 100], [1054, 100],
      [1054, 212], [1054, 324], [1054, 436], [1054, 548],
      [1054, 660], [934, 660], [814, 660], [694, 660], [574, 660],
      [454, 660], [334, 660], [214, 660], [94, 660],
      [94, 548], [94, 436], [94, 324], [94, 212]
    ]
  }
};

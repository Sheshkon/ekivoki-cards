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

export function getBoardCssVars() {
    return {
        '--viewport-min-height': `${BOARD_DIMENSIONS.viewportMinHeight}px`,
        '--cell-size': `${BOARD_DIMENSIONS.cellSize}px`,
        '--cell-oval-width': `${BOARD_DIMENSIONS.ovalCellWidth}px`,
        '--cell-rectangle-width': `${BOARD_DIMENSIONS.rectangleCellWidth}px`,
        '--token-width': `${BOARD_DIMENSIONS.tokenWidth}px`,
        '--token-height': `${BOARD_DIMENSIONS.tokenHeight}px`,
        '--dice-size': `${BOARD_DIMENSIONS.diceSize}px`,
        '--route-stroke-width': `${BOARD_DIMENSIONS.routeStrokeWidth}px`,
        '--board-width': `${BOARD_DIMENSIONS.width}px`,
        '--board-height': `${BOARD_DIMENSIONS.height}px`,
    };
}

export const categories = [
    {
        id: 'start',
        label: 'Старт',
        short: '',
        color: '#24b36b',
        shape: 'square', // Всегда круг
        rule: 'Начальная клетка. Команды ставят фишки сюда.',
        chance: 0
    },
    {
        id: 'default',
        label: 'Обычная',
        short: '',
        color: '#048e0a',
        shape: 'circle', // Всегда ромб
        rule: 'Обычная клетка без эффекта.',
        chance: 0.50
    },
    {
        id: 'back',
        label: 'Минус ход',
        short: '',
        color: '#930000',
        shape: 'square', // Всегда квадрат
        rule: 'Команда возвращается на одну клетку назад.',
        chance: 0.05
    },
    // Когда раскомментируешь — задай уникальные пары цвет+форма:
    // {
    //     id: 'explain',
    //     label: 'Объясни',
    //     short: '',
    //     color: '#2f80ed',
    //     shape: 'circle',
    //     rule: 'Объяснить слово без однокоренных слов.',
    //     chance: 0.10
    // },
    // {
    //     id: 'draw',
    //     label: 'Рисуй',
    //     short: '',
    //     color: '#f2c94c',
    //     shape: 'oval',
    //     rule: 'Нарисовать задание без букв и цифр.',
    //     chance: 0.10
    // },
    // {
    //     id: 'show',
    //     label: 'Покажи',
    //     short: '',
    //     color: '#eb5757',
    //     shape: 'diamond',
    //     rule: 'Показать слово жестами без звуков.',
    //     chance: 0.10
    // },
    // {
    //     id: 'sing',
    //     label: 'Пой',
    //     short: '',
    //     color: '#9b51e0',
    //     shape: 'square',
    //     rule: 'Напеть или произнести задание в заданном стиле.',
    //     chance: 0.05
    // },
    {
        id: 'finish',
        label: 'Финиш',
        short: '',
        color: '#bc9900',
        shape: 'square', // Всегда овал
        rule: 'Финишная клетка. Команда завершает игру.',
        chance: 0
    }
];

export const cellShapes = [
    {id: 'circle', label: 'Круг'},
    {id: 'oval', label: 'Овал'},
    {id: 'square', label: 'Квадрат'},
    {id: 'diamond', label: 'Ромб'},
];

export const tokenColors = ['#e63946', '#277da1', '#43aa8b', '#f8961e', '#8338ec', '#ff006e'];

const routePresetSource = {
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
            [814, 436], [814, 324], [694, 324], [574, 324], [454, 324], [334, 324],
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
    },
};

function scalePresetPoints(points) {
    const scaleX = BOARD_WIDTH / BASE_BOARD_WIDTH;
    const scaleY = BOARD_HEIGHT / BASE_BOARD_HEIGHT;
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

export function createRoute(points) {
    const randomPool = categories.filter(cat => cat.id !== 'start' && cat.id !== 'finish');
    const totalChance = randomPool.reduce((sum, cat) => sum + cat.chance, 0);

    function getRandomCategory() {
        let roll = Math.random() * totalChance;
        for (const cat of randomPool) {
            roll -= cat.chance;
            if (roll <= 0) return cat;
        }
        return randomPool[randomPool.length - 1];
    }

    return points.map(([x, y], index) => {
        const isStart = index === 0;
        const isFinish = index === points.length - 1;

        let category;
        if (isStart) {
            category = categories.find(c => c.id === 'start');
        } else if (isFinish) {
            category = categories.find(c => c.id === 'finish');
        } else {
            category = getRandomCategory();
        }

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
    return Array.from({length: count}, (_, index) => {
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
        x: clamp(cell.x, CELL_CLAMP_PADDING, BOARD_WIDTH - CELL_CLAMP_PADDING),
        y: clamp(cell.y, CELL_CLAMP_PADDING, BOARD_HEIGHT - CELL_CLAMP_PADDING),
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

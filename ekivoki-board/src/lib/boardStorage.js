const STORAGE_KEY = 'ekivoki-board.savedBoards';

export function loadSavedBoards() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function saveBoards(boards) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
}

export function createBoardSnapshot({ name, route, backgroundImage, rules }) {
  return {
    id: crypto.randomUUID(),
    name: name?.trim() || 'Мой борд',
    route: route.map(({ x, y, category, shape }) => ({ x, y, category, shape })),
    backgroundImage,
    rules,
    updatedAt: new Date().toISOString()
  };
}

export function downloadBoard(board) {
  const blob = new Blob([JSON.stringify(board, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${safeFileName(board.name)}.ekivoki-board.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function safeFileName(name) {
  return String(name || 'ekivoki-board')
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

import { ref } from 'vue';
import { DEFAULT_BOARD_NAME, createDefaultRules, normalizeImportedRoute } from '../lib/boardConfig';
import { createBoardSnapshot, loadSavedBoards, saveBoards } from '../lib/boardStorage';

export function useBoardLibrary({
  boardName,
  route,
  backgroundImage,
  rules,
  selectedCellIndex,
  resetGame
}) {
  const savedBoards = ref(loadSavedBoards());

  function saveCurrentBoard() {
    const snapshot = createBoardSnapshot({
      name: boardName.value,
      route: route.value,
      backgroundImage: backgroundImage.value,
      rules: rules.value
    });

    const sameNameIndex = savedBoards.value.findIndex((board) => board.name === snapshot.name);
    if (sameNameIndex >= 0) {
      savedBoards.value.splice(sameNameIndex, 1, snapshot);
    } else {
      savedBoards.value.unshift(snapshot);
    }

    saveBoards(savedBoards.value);
  }

  function removeSavedBoard(boardId) {
    savedBoards.value = savedBoards.value.filter((board) => board.id !== boardId);
    saveBoards(savedBoards.value);
  }

  function loadBoard(board) {
    boardName.value = board.name;
    route.value = normalizeImportedRoute(board.route);
    backgroundImage.value = board.backgroundImage || '';
    rules.value = { ...createDefaultRules(), ...(board.rules || {}) };
    selectedCellIndex.value = null;
    resetGame();
  }

  function importBoard(board) {
    const importedBoard = {
      ...board,
      id: crypto.randomUUID(),
      name: board.name || `Импорт: ${DEFAULT_BOARD_NAME}`,
      route: normalizeImportedRoute(board.route),
      backgroundImage: board.backgroundImage || '',
      rules: { ...createDefaultRules(), ...(board.rules || {}) },
      updatedAt: new Date().toISOString()
    };

    savedBoards.value.unshift(importedBoard);
    saveBoards(savedBoards.value);
    loadBoard(importedBoard);
  }

  return {
    savedBoards,
    saveCurrentBoard,
    removeSavedBoard,
    loadBoard,
    importBoard
  };
}

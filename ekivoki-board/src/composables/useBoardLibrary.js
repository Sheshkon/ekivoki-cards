import { ref } from 'vue';
import { DEFAULT_BOARD_NAME, createDefaultBoardStyle, createDefaultRules, mergeBoardStyle, normalizeImportedRoute, syncRouteWithCategoryStyles } from '../lib/boardConfig';
import { createBoardSnapshot, loadSavedBoards, saveBoards } from '../lib/boardStorage';

export function useBoardLibrary({
  boardName,
  route,
  backgroundImage,
  rules,
  boardStyle,
  selectedCellIndex,
  resetGame
}) {
  const savedBoards = ref(loadSavedBoards());

  function saveCurrentBoard() {
    const snapshot = createBoardSnapshot({
      name: boardName.value,
      route: route.value,
      backgroundImage: backgroundImage.value,
      rules: rules.value,
      style: boardStyle.value
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
    boardStyle.value = mergeBoardStyle(board.style);
    route.value = syncRouteWithCategoryStyles(normalizeImportedRoute(board.route), boardStyle.value);
    backgroundImage.value = board.backgroundImage || '';
    rules.value = { ...createDefaultRules(), ...(board.rules || {}) };
    selectedCellIndex.value = null;
    resetGame(boardStyle.value.tokenColors);
  }

  function importBoard(board) {
    const importedBoard = {
      ...board,
      id: crypto.randomUUID(),
      name: board.name || `Импорт: ${DEFAULT_BOARD_NAME}`,
      style: mergeBoardStyle(board.style),
      route: normalizeImportedRoute(board.route),
      backgroundImage: board.backgroundImage || '',
      rules: { ...createDefaultRules(), ...(board.rules || {}) },
      updatedAt: new Date().toISOString()
    };

    importedBoard.route = syncRouteWithCategoryStyles(importedBoard.route, importedBoard.style);

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

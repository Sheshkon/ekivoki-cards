<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import AppControlPanel from './components/AppControlPanel.vue';
import AppTopBar from './components/AppTopBar.vue';
import BoardCanvas from './components/BoardCanvas.vue';
import { useBoardGame } from './composables/useBoardGame';
import { useBoardLibrary } from './composables/useBoardLibrary';
import { BOARD_HEIGHT, BOARD_WIDTH } from './lib/boardConfig';

const {
  selectedPreset,
  boardName,
  backgroundImage,
  boardStyle,
  route,
  rules,
  playerCount,
  players,
  activePlayerId,
  isAnimating,
  useDice,
  diceValue,
  isDiceRolling,
  dicePosition,
  diceRotation,
  isEditing,
  isPanelHidden,
  selectedCellIndex,
  activeTab,
  stats,
  playerProgress,
  updateRoute,
  updateBoardStyle,
  updatePlayers,
  selectToken,
  selectCell,
  moveToken,
  rollDice,
  resetGame
} = useBoardGame();

const boardCanvasRef = ref(null);
const isBoardFullscreen = ref(false);

const {
  savedBoards,
  saveCurrentBoard,
  removeSavedBoard,
  loadBoard,
  importBoard
} = useBoardLibrary({
  boardName,
  route,
  backgroundImage,
  rules,
  boardStyle,
  selectedCellIndex,
  resetGame
});

function syncFullscreenState() {
  const fullscreenNode = document.fullscreenElement;
  const boardNode = boardCanvasRef.value?.$el;
  isBoardFullscreen.value = Boolean(fullscreenNode && boardNode && fullscreenNode === boardNode);
}

async function toggleBoardFullscreen() {
  if (!boardCanvasRef.value) return;
  try {
    const isFullscreen = await boardCanvasRef.value.toggleFullscreen();
    isBoardFullscreen.value = isFullscreen;
  } catch {
    isBoardFullscreen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', syncFullscreenState);
});

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', syncFullscreenState);
});
</script>

<template>
  <main class="app-shell" :class="{ 'is-editing': isEditing, 'panel-hidden': isPanelHidden }">
    <section class="board-panel">
      <AppTopBar
        :is-board-fullscreen="isBoardFullscreen"
        :is-panel-hidden="isPanelHidden"
        @toggle-fullscreen="toggleBoardFullscreen"
        @toggle-panel="isPanelHidden = !isPanelHidden"
      />

      <BoardCanvas
        ref="boardCanvasRef"
        :active-player-id="activePlayerId"
        :background-image="backgroundImage"
        :board-height="BOARD_HEIGHT"
        :board-style="boardStyle"
        :board-width="BOARD_WIDTH"
        :dice-position="dicePosition"
        :dice-rotation="diceRotation"
        :dice-value="diceValue"
        :is-animating="isAnimating"
        :is-dice-rolling="isDiceRolling"
        :is-editing="isEditing"
        :players="players"
        :route="route"
        :selected-cell-index="selectedCellIndex"
        :show-dice="useDice"
        @cell-click="selectCell"
        @dice-click="rollDice"
        @token-click="selectToken"
        @token-move="moveToken"
        @update:route="updateRoute"
      />
    </section>

    <AppControlPanel
      v-if="!isPanelHidden"
      v-model:active-tab="activeTab"
      v-model:active-player-id="activePlayerId"
      v-model:background-image="backgroundImage"
      v-model:board-name="boardName"
      v-model:board-style="boardStyle"
      v-model:player-count="playerCount"
      v-model:rules="rules"
      v-model:selected-cell-index="selectedCellIndex"
      v-model:selected-preset="selectedPreset"
      v-model:use-dice="useDice"
      :current-board="{ name: boardName, route, backgroundImage, rules, style: boardStyle }"
      :is-animating="isAnimating || isDiceRolling"
      :is-editing="isEditing"
      :players="players"
      :route="route"
      :saved-boards="savedBoards"
      @delete-board="removeSavedBoard"
      @disable-editing="isEditing = false"
      @enable-editing="isEditing = true"
      @import-board="importBoard"
      @load-board="loadBoard"
      @save-board="saveCurrentBoard"
      @update:players="updatePlayers"
      @update:route="updateRoute"
      @update:board-style="updateBoardStyle"
    />
  </main>
</template>

<style scoped src="./App.css"></style>

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
  route,
  rules,
  playerCount,
  players,
  activePlayerId,
  stepInput,
  isAnimating,
  useDice,
  diceValue,
  isDiceRolling,
  dicePosition,
  diceRotation,
  isEditing,
  isPanelHidden,
  showPlayerSettings,
  selectedCellIndex,
  activeTab,
  stats,
  playerProgress,
  updateRoute,
  updatePlayers,
  selectToken,
  selectCell,
  moveToken,
  moveActivePlayer,
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
        :is-editing="isEditing"
        :is-board-fullscreen="isBoardFullscreen"
        :is-panel-hidden="isPanelHidden"
        :player-progress="playerProgress"
        :stats="stats"
        @toggle-editing="isEditing = !isEditing"
        @toggle-fullscreen="toggleBoardFullscreen"
        @toggle-panel="isPanelHidden = !isPanelHidden"
      />

      <BoardCanvas
        ref="boardCanvasRef"
        :active-player-id="activePlayerId"
        :background-image="backgroundImage"
        :board-height="BOARD_HEIGHT"
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
      v-model:player-count="playerCount"
      v-model:rules="rules"
      v-model:selected-cell-index="selectedCellIndex"
      v-model:selected-preset="selectedPreset"
      v-model:show-player-settings="showPlayerSettings"
      v-model:step-input="stepInput"
      v-model:use-dice="useDice"
      :current-board="{ name: boardName, route, backgroundImage, rules }"
      :is-animating="isAnimating || isDiceRolling"
      :is-editing="isEditing"
      :players="players"
      :route="route"
      :saved-boards="savedBoards"
      @delete-board="removeSavedBoard"
      @enable-editing="isEditing = true"
      @import-board="importBoard"
      @load-board="loadBoard"
      @move="moveActivePlayer"
      @reset="resetGame"
      @roll="rollDice"
      @save-board="saveCurrentBoard"
      @update:players="updatePlayers"
      @update:route="updateRoute"
    />
  </main>
</template>

<style scoped src="./App.css"></style>

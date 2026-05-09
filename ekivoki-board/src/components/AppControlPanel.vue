<script setup>
import BoardEditor from './BoardEditor.vue';
import BoardLibrary from './BoardLibrary.vue';
import GameControls from './GameControls.vue';
import RulesEditor from './RulesEditor.vue';

defineProps({
  activeTab: {
    type: String,
    required: true
  },
  activePlayerId: {
    type: Number,
    required: true
  },
  playerCount: {
    type: Number,
    required: true
  },
  showPlayerSettings: {
    type: Boolean,
    required: true
  },
  stepInput: {
    type: Number,
    required: true
  },
  useDice: {
    type: Boolean,
    required: true
  },
  isAnimating: {
    type: Boolean,
    required: true
  },
  players: {
    type: Array,
    required: true
  },
  backgroundImage: {
    type: String,
    required: true
  },
  boardName: {
    type: String,
    required: true
  },
  selectedCellIndex: {
    type: Number,
    default: null
  },
  selectedPreset: {
    type: String,
    required: true
  },
  isEditing: {
    type: Boolean,
    required: true
  },
  route: {
    type: Array,
    required: true
  },
  rules: {
    type: Object,
    required: true
  },
  savedBoards: {
    type: Array,
    required: true
  },
  currentBoard: {
    type: Object,
    required: true
  }
});

const emit = defineEmits([
  'update:active-tab',
  'update:active-player-id',
  'update:player-count',
  'update:show-player-settings',
  'update:step-input',
  'update:use-dice',
  'update:players',
  'update:background-image',
  'update:board-name',
  'update:selected-cell-index',
  'update:selected-preset',
  'update:route',
  'update:rules',
  'move',
  'reset',
  'roll',
  'enable-editing',
  'save-board',
  'delete-board',
  'import-board',
  'load-board'
]);
</script>

<template>
  <aside class="control-panel">
    <nav class="panel-tabs" aria-label="Разделы">
      <button :class="{ active: activeTab === 'game' }" type="button" @click="emit('update:active-tab', 'game')">Игра</button>
      <button :class="{ active: activeTab === 'editor' }" type="button" @click="emit('update:active-tab', 'editor')">Поле</button>
      <button :class="{ active: activeTab === 'rules' }" type="button" @click="emit('update:active-tab', 'rules')">Правила</button>
      <button :class="{ active: activeTab === 'library' }" type="button" @click="emit('update:active-tab', 'library')">Борды</button>
    </nav>

    <GameControls
      v-if="activeTab === 'game'"
      :active-player-id="activePlayerId"
      :player-count="playerCount"
      :show-player-settings="showPlayerSettings"
      :step-input="stepInput"
      :use-dice="useDice"
      :is-animating="isAnimating"
      :players="players"
      @move="emit('move', $event)"
      @reset="emit('reset')"
      @roll="emit('roll')"
      @update:active-player-id="emit('update:active-player-id', $event)"
      @update:player-count="emit('update:player-count', $event)"
      @update:show-player-settings="emit('update:show-player-settings', $event)"
      @update:step-input="emit('update:step-input', $event)"
      @update:use-dice="emit('update:use-dice', $event)"
      @update:players="emit('update:players', $event)"
    />

    <BoardEditor
      v-if="activeTab === 'editor'"
      :background-image="backgroundImage"
      :board-name="boardName"
      :selected-cell-index="selectedCellIndex"
      :selected-preset="selectedPreset"
      :is-editing="isEditing"
      :route="route"
      @enable-editing="emit('enable-editing')"
      @save="emit('save-board')"
      @update:background-image="emit('update:background-image', $event)"
      @update:board-name="emit('update:board-name', $event)"
      @update:selected-cell-index="emit('update:selected-cell-index', $event)"
      @update:selected-preset="emit('update:selected-preset', $event)"
      @update:route="emit('update:route', $event)"
    />

    <RulesEditor
      v-if="activeTab === 'rules'"
      :rules="rules"
      @update:rules="emit('update:rules', $event)"
    />

    <BoardLibrary
      v-if="activeTab === 'library'"
      :boards="savedBoards"
      :current-board="currentBoard"
      @delete="emit('delete-board', $event)"
      @import="emit('import-board', $event)"
      @load="emit('load-board', $event)"
    />
  </aside>
</template>

<style scoped src="./AppControlPanel.css"></style>

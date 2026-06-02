<script setup>
import BoardEditor from './BoardEditor.vue';
import BoardLibrary from './BoardLibrary.vue';
import GameControls from './GameControls.vue';
import RulesEditor from './RulesEditor.vue';

defineProps({
  activeTab: { type: String, required: true },
  activePlayerId: { type: Number, required: true },
  backgroundImage: { type: String, required: true },
  boardName: { type: String, required: true },
  currentBoard: { type: Object, required: true },
  isAnimating: { type: Boolean, required: true },
  isEditing: { type: Boolean, required: true },
  playerCount: { type: Number, required: true },
  players: { type: Array, required: true },
  route: { type: Array, required: true },
  rules: { type: Object, required: true },
  savedBoards: { type: Array, required: true },
  selectedCellIndex: { type: Number, default: null },
  selectedPreset: { type: String, required: true },
  showPlayerSettings: { type: Boolean, required: true },
  stepInput: { type: Number, required: true },
  useDice: { type: Boolean, default: false }
});

const emit = defineEmits([
  'update:active-tab',
  'update:active-player-id',
  'update:background-image',
  'update:board-name',
  'update:player-count',
  'update:players',
  'update:route',
  'update:rules',
  'update:selected-cell-index',
  'update:selected-preset',
  'update:show-player-settings',
  'update:step-input',
  'update:use-dice',
  'delete-board',
  'enable-editing',
  'import-board',
  'load-board',
  'move',
  'reset',
  'roll',
  'save-board'
]);

const tabs = [
  { id: 'game', label: 'Игра' },
  { id: 'editor', label: 'Поле' },
  { id: 'rules', label: 'Правила' },
  { id: 'library', label: 'Борды' }
];
</script>

<template>
  <aside class="control-panel">
    <nav class="panel-tabs" aria-label="Разделы">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="{ active: activeTab === tab.id }"
        type="button"
        @click="emit('update:active-tab', tab.id)"
      >
        {{ tab.label }}
      </button>
    </nav>

    <GameControls
      v-if="activeTab === 'game'"
      :active-player-id="activePlayerId"
      :is-animating="isAnimating"
      :player-count="playerCount"
      :players="players"
      :show-player-settings="showPlayerSettings"
      :step-input="stepInput"
      :use-dice="useDice"
      @move="emit('move', $event)"
      @reset="emit('reset')"
      @roll="emit('roll')"
      @update:active-player-id="emit('update:active-player-id', $event)"
      @update:player-count="emit('update:player-count', $event)"
      @update:players="emit('update:players', $event)"
      @update:show-player-settings="emit('update:show-player-settings', $event)"
      @update:step-input="emit('update:step-input', $event)"
      @update:use-dice="emit('update:use-dice', $event)"
    />

    <BoardEditor
      v-if="activeTab === 'editor'"
      :background-image="backgroundImage"
      :board-name="boardName"
      :is-editing="isEditing"
      :route="route"
      :selected-cell-index="selectedCellIndex"
      :selected-preset="selectedPreset"
      @enable-editing="emit('enable-editing')"
      @save="emit('save-board')"
      @update:background-image="emit('update:background-image', $event)"
      @update:board-name="emit('update:board-name', $event)"
      @update:route="emit('update:route', $event)"
      @update:selected-cell-index="emit('update:selected-cell-index', $event)"
      @update:selected-preset="emit('update:selected-preset', $event)"
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

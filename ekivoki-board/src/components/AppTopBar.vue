<script setup>
defineProps({
  isEditing: {
    type: Boolean,
    required: true
  },
  isPanelHidden: {
    type: Boolean,
    required: true
  },
  isBoardFullscreen: {
    type: Boolean,
    required: true
  },
  stats: {
    type: Object,
    required: true
  },
  playerProgress: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['toggle-panel', 'toggle-editing', 'toggle-fullscreen']);
</script>

<template>
  <div class="topbar">
    <div>
      <p class="eyebrow">Экивоки</p>
      <h1>Игровое поле</h1>
    </div>

    <div class="top-actions">
      <div class="score-strip" aria-label="Статистика поля">
        <span>{{ stats.cells }} клеток</span>
        <span>{{ stats.players }} команд</span>
      </div>
      <div class="progress-strip" aria-label="Прогресс команд">
        <span v-for="player in playerProgress" :key="player.id" class="progress-pill">
          <i :style="{ background: player.color }"></i>
          {{ player.name }} {{ player.progress }}%
        </span>
      </div>
      <div class="top-button-row">
        <button class="secondary-button compact" type="button" @click="emit('toggle-fullscreen')">
          {{ isBoardFullscreen ? 'Свернуть поле' : 'Во весь экран' }}
        </button>
        <button class="secondary-button compact" type="button" @click="emit('toggle-panel')">
          {{ isPanelHidden ? 'Показать панель' : 'Скрыть панель' }}
        </button>
        <button class="primary-button compact" type="button" @click="emit('toggle-editing')">
          {{ isEditing ? 'Закрыть редактор' : 'Редактировать поле' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped src="./AppTopBar.css"></style>

<script setup>
defineProps({
  isBoardFullscreen: { type: Boolean, required: true },
  isPanelHidden: { type: Boolean, required: true }
});

const emit = defineEmits(['toggle-panel', 'toggle-fullscreen']);
</script>

<template>
  <div class="topbar">
    <div class="top-actions">
      <div class="top-button-row">
        <button class="secondary-button compact" type="button" @click="emit('toggle-fullscreen')">
          {{ isBoardFullscreen ? 'Свернуть поле' : 'Во весь экран' }}
        </button>
        <button class="secondary-button compact" type="button" @click="emit('toggle-panel')">
          {{ isPanelHidden ? 'Показать панель' : 'Скрыть панель' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped src="./AppTopBar.css"></style>

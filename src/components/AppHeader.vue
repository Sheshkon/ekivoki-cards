<script setup>
import {ref} from 'vue';
import {useGameStore} from '../stores/useGameStore';
import {useSettingsStore} from '../stores/useSettingsStore';
import {MdBrightnessMedium, MdRestartAlt, MdSettings} from 'vue-icons-plus/md';

const gameStore = useGameStore();
const settingsStore = useSettingsStore();

const loading = ref(false);

const handleSync = async () => {
  loading.value = true;
  try {
    await gameStore.sync();
  } catch (e) {
    console.log("Deck don't updated: ", e);
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <header class="header">
    <h1>{{ $t('header.title') }}</h1>
    <div class="controls">
      <button class="icon-btn" :class="{'light': settingsStore.settings.theme !== 'dark'}"
              @click="settingsStore.toggleTheme">
        <MdBrightnessMedium/>
      </button>
      <button class="icon-btn" @click="handleSync">
        <span :class="{'spinner': loading}"><MdRestartAlt/></span>
      </button>
      <button class="icon-btn" @click="settingsStore.toggleSettingsScreen"
              :class="{ 'active': settingsStore.isSettingsScreenOpened }"
      >
        <MdSettings/>
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-teal);
}

.header .controls {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.active {
  background-color: var(--active-color);
}

.light {
  background-color: var(--light-color);
}

.icon-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.spinner {
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
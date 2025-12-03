<script setup>
import {onMounted} from 'vue';
import {useGameStore} from './stores/useGameStore';
import AppHeader from './components/AppHeader.vue';
import StartScreen from './components/StartScreen.vue';
import GameScreen from './components/GameScreen.vue';
import SettingsScreen from "./components/SettingsScreen.vue";
import {useSettingsStore} from "./stores/useSettingsStore.js";

const gameStore = useGameStore();
const settingsStore = useSettingsStore()

onMounted(() => {
  settingsStore.initSettings()
  gameStore.initialize()
})
</script>

<template>
  <div class="app-container">
    <AppHeader/>
    <main class="main-content">
      <div v-if="gameStore.isLoading" class="loading">Загрузка колоды...</div>
      <SettingsScreen class="settings" v-else-if="settingsStore.isSettingsScreenOpened"/>
      <StartScreen v-else-if="gameStore.phase === 'idle'"/>
      <GameScreen v-else/>
    </main>
  </div>
</template>

<style>
:root {
  --color-teal: #4ECDC4;
  --color-red: #ff0000;
  --color-beige: #F7FFF7;
  --color-orange: #FF6B6B;
  --color-purple: #9B5DE5;
  --color-text: #292f36;
  --shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  --active-color: #24ff24;
  --light-color: #ffff3f;
}

:root[data-theme="dark"] {
  --color-teal: #3fbfb7;
  --color-red: #ff6b6b;
  --color-beige: #1e1e1e;
  --color-orange: #ff8c42;
  --color-purple: #b983ff;
  --color-text: #f0f0f0;
  --color-bg: #121212;
  --shadow: 0 10px 25px rgba(0, 0, 0, 1);
  --active-color: #24ff24;
  --light-color: #ffff3f;
}

body {
  font-size: 0.8rem;
  margin: 0;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text);
  -webkit-tap-highlight-color: transparent;
  overscroll-behavior-y: none;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  padding: 1rem;
  box-sizing: border-box;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.loading {
  flex: 1
}
</style>
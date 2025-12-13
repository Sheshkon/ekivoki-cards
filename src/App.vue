<script setup>
import {computed, onMounted, defineAsyncComponent } from 'vue';
import {useGameStore} from './stores/useGameStore';
import {useSettingsStore} from "./stores/useSettingsStore.js";
import {getBackgroundPatternStyle} from "./stores/config.js";

const AppHeader = defineAsyncComponent(() => import('./components/AppHeader.vue'))
const StartScreen = defineAsyncComponent(() => import('./components/StartScreen.vue'))
const GameScreen = defineAsyncComponent(() => import('./components/GameScreen.vue'))
const SettingsScreen = defineAsyncComponent(() => import('./components/SettingsScreen.vue'))

const gameStore = useGameStore();
const settingsStore = useSettingsStore()

const backgroundStyle = computed(() => {
  const key = settingsStore.settings.backgroundKey;
  const color = settingsStore.settings.themeColor;

  return getBackgroundPatternStyle(key, color);

});

onMounted(() => {
  settingsStore.initSettings()
  gameStore.initialize()
})
</script>

<template>
  <div
      :class="['app-container', 'common-background']"
      :style="backgroundStyle"
  >
    <AppHeader/>
    <main class="main-content">
      <div v-if="gameStore.isLoading" class="loading">{{ $t('app.loading') }}</div>
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
  --color-bg: #fffdd0;
  --app-background: white;
}

:root[data-theme="dark"] {
  --color-teal: #3fbfb7;
  --color-red: #ff6b6b;
  --color-beige: #1e1e1e;
  --color-orange: #ff8c42;
  --color-purple: #b983ff;
  --color-text: #f0f0f0;
  --color-bg: #1b1b1f;
  --shadow: 0 10px 25px rgba(0, 0, 0, 1);
  --active-color: #24ff24;
  --light-color: #ffff3f;
}

html {
  font-size: calc(12px + 0.5vw); /* динамический размер шрифта */
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
  min-height: 100dvh;
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

html, body {
  overscroll-behavior-y: contain;
  overscroll-behavior-x: none;
}

* {
  user-select: none
}

</style>
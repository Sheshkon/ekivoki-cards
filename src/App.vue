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
  --font-min-base: 1rem;
  --font-max-base: 1.25rem;
  --font-vmin-preference: 1vmin;

  --font-size-xs: 1.5dvh;
  --font-size-default: clamp(var(--font-min-base), calc(0.5rem + var(--font-vmin-preference)), var(--font-max-base));
  --font-size-m: 1.75dvh;
  --font-size-l: 2.25dvh;
  --font-size-xl: clamp(2.5rem, calc(1.5rem + 5vmin), 4rem);
  --font-size-xxl: clamp(3rem, calc(2rem + 5vmin), 4.5rem);

  --font-size-vh: 2vh;

  --color-teal: #4ECDC4;
  --color-red: #ff0000;
  --color-beige: #F7FFF7;
  --color-orange: #FF6B6B;
  --color-purple: #9B5DE5;
  --color-text: #292f36;
  --shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  --color-active: #24ff24;
  --color-light: #ffff3f;
  --color-bg: #fffdd0;
  --app-background: white;

  --header-container-height: 4vh;
  --timer-container-height: 8vh;
  --controls-container-height: 3.5rem;

  --border-radius: 3vh;
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
  --color-active: #24ff24;
  --color-light: #ffff3f;
}

html {
  font-size: var(--font-size-default);
  width: 100%;
  overflow-x: clip;
}

body {
  margin: 0;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text);
  -webkit-tap-highlight-color: transparent;
  width: 100%;
  min-height: 100dvh;
  overflow-x: clip;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  width: min(100%, 100%);
  padding: clamp(0.5rem, 2vw, 1rem);
  box-sizing: border-box;
  overflow-x: clip;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: auto;
  overflow-y: visible;
  overflow-x: clip;
}

.loading {
  flex: 1
}

html, body, #app {
  width: 100%;
  height: 100%;
  max-width: 100%;
  overscroll-behavior-y: contain;
  overscroll-behavior-x: none;
}

html::-webkit-scrollbar,
body::-webkit-scrollbar {
  width: 0;
  height: 0;
}

* {
  user-select: none
}

</style>
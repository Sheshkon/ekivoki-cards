<script setup>
import {ref} from 'vue';
import {useGameStore} from '../stores/useGameStore';
import Timer from './Timer.vue';
import CardWrapper from './CardWrapper.vue';
import {useSettingsStore} from "../stores/useSettingsStore.js";

const gameStore = useGameStore();
const settingsStore = useSettingsStore();
const timerRef = ref(null);

const handleTimeUp = () => {
  if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
};

const startTimer = () => {
  timerRef.value?.start();
  gameStore.setTimerStatus(true);
};

const failTurn = () => {
  timerRef.value?.stop();
  gameStore.finishTurn();
};

const finishTurn = () => {
  timerRef.value?.stop();
  gameStore.finishTurn();
};
</script>

<template>
  <div class="game-screen">
    <div class="timer-container">
      <Timer ref="timerRef" @time-up="handleTimeUp" :round-duration="settingsStore.settings.roundSecondsDuration"/>
    </div>

    <div class="card-area">
      <CardWrapper :key="gameStore.currentCard?.id"/>
    </div>

    <div class="controls-container">
      <button v-if="!gameStore.timerActive" class="btn-start" @click="startTimer">
        {{ $t('game.start_timer') }}
      </button>
      <div v-else class="timer-controls-active">
        <button class="btn-fail" @click="failTurn">{{ $t('game.fail_turn') }}</button>
        <button class="btn-next" @click="finishTurn">{{ $t('game.next_turn') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  width: 100%;
  padding: clamp(8px, 1.4vh, 14px) clamp(8px, 1.4vh, 14px) max(10px, env(safe-area-inset-bottom));
  box-sizing: border-box;
  max-width: 52rem;
  margin: 0 auto;
  min-height: 0;
  height: 100%;
  overflow: visible;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.timer-container {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  flex-grow: 0;
  height: var(--timer-container-height);
}

.timer-container > * {
  min-height: inherit;
  width: 100%;
}

.card-area {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 0;
  margin: clamp(0.2rem, 1vh, 0.6rem) 0;
  overflow: visible;
}

.card-area > * {
  flex: 0 1 auto;
  min-height: 0;
}

.controls-container {
  width: 100%;
  flex-shrink: 0;
  margin-top: auto;
  margin-bottom: clamp(0.15rem, 0.6vh, 0.4rem);
}

.game-screen::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.controls-container button {
  font-size: clamp(16px, 4vw, 18px);
  height: var(--controls-container-height);
  transition: opacity 0.2s;
  cursor: pointer;
}

.controls-container button:active {
  transform: scale(0.97);
}

.btn-start {
  width: 100%;
  background-color: var(--color-teal);
  color: var(--color-text);
  border: none;
  border-radius: var(--border-radius);
  font-weight: bold;
  box-shadow: 0 0.25rem 1rem rgba(78, 205, 196, 0.4);
}

.timer-controls-active {
  display: flex;
  gap: clamp(0.5rem, 2vw, 0.95rem);
  width: 100%;
}

.btn-fail, .btn-next {
  flex: 1;
  padding: 1rem;
  border-radius: var(--border-radius);
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.btn-fail {
  border: 2px solid var(--color-red);
  color: var(--color-text);
  background: var(--color-bg);
}

.btn-next {
  background: var(--color-teal);
  border: none;
  color: var(--color-text);
  box-shadow: 0 0.25rem 1rem rgba(78, 205, 196, 0.3);
}
</style>
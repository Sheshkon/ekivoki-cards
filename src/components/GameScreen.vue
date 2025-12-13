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
      <Timer ref="timerRef" @time-up="handleTimeUp" :round-duration="settingsStore.settings.roundSecondsDuration" />
    </div>
    <CardWrapper class="card-wrapper" :key="gameStore.currentCard?.id"/>
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
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  min-height: 80dvh;
  width: 100%;
  gap: 10px;
}

.controls-container {
  width: 100%;
}

.controls-container button {
  font-size: var(--font-size-m)
}

.btn-start {
  width: 100%;
  background-color: var(--color-teal);
  color: var(--color-text);
  padding: 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(78, 205, 196, 0.3);
}

.timer-controls-active {
  display: flex;
  gap: 10px;
}

.btn-fail {
  flex: 1;
  border: 2px solid var(--color-red);
  color: var(--color-text);
  background: var(--color-bg);
  padding: 15px;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
}

.btn-next {
  flex: 1;
  background: var(--color-teal);
  border: none;
  color: var(--color-text);
  padding: 15px;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
}

</style>
<script setup>
import {onMounted, ref} from 'vue';
import {useGameStore} from './stores/useGameStore';
import CardWrapper from './components/CardWrapper.vue';
import Timer from './components/Timer.vue';

import baseCardImage from './assets/base.jpg'
import specialCardImage from './assets/special.png'

const store = useGameStore();
const timerRef = ref(null);
const loading = ref(false)

const handleSync = async () => {
  loading.value = true
  try {
    await store.sync()
  } finally {
    loading.value = false
    alert("Колода обновлена.");
  }
}

onMounted(() => store.initialize());

const handleTimeUp = () => {
  if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
};

const startTimer = () => {
  timerRef.value?.start();
  store.setTimerStatus(true);
};

const failTurn = () => {
  timerRef.value?.stop();
  store.finishTurn();
};

const finishTurn = () => {
  timerRef.value?.stop();
  store.finishTurn();
};
</script>

<template>
  <div class="app-container">
    <header class="header">
      <h1>Экивоки</h1>
      <button class="icon-btn" @click="handleSync" :disabled="loading">
        <span v-if="!loading">↻</span>
        <span v-else class="spinner"></span>
      </button>
    </header>

    <main class="main-content">
      <div v-if="store.isLoading" class="loading">
        Загрузка колоды...
      </div>

      <div v-else-if="store.phase === 'idle'" class="start-screen">
        <div class="dice-logo">🎲</div>
        <p>Выберите, какую карточку сгенерировать:</p>
        <div class="card-preview-group">
          <div class="card-option">
            <img :src=baseCardImage alt="Обычная карточка" class="card-preview" @click="store.generateCard(false)"/>
          </div>
          <div class="card-option">
            <img :src="specialCardImage" alt="Особая карточка" class="card-preview" @click="store.generateCard(true)"/>
          </div>
        </div>

      </div>

      <div v-else class="game-screen">
        <Timer ref="timerRef" @time-up="handleTimeUp"/>

        <CardWrapper :key="store.currentCard?.id"/>

        <div class="controls-container">
          <button v-if="!store.timerActive" class="btn-start" @click="startTimer">
            Старт Таймера
          </button>
          <div v-else class="timer-controls-active">
            <button class="btn-fail" @click="failTurn">
              Не справились
            </button>
            <button class="btn-next" @click="finishTurn">
              Следующий ход
            </button>
          </div>
        </div>
      </div>
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
}

body {
  margin: 0;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--color-beige);
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-teal);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.loading {
  text-align: center;
  color: #888;
}

.start-screen {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  gap: 30px;
}

.dice-logo {
  font-size: 5rem;
}

.game-screen {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 10px;
}

.controls-container {
  padding-top: 5px;
  margin-top: auto;
}

.btn-start {
  width: 100%;
  background-color: var(--color-teal);
  color: white;
  padding: 18px;
  border: none;
  border-radius: 12px;
  font-size: 1.3rem;
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
  background: #fff;
  border: 2px solid var(--color-orange);
  color: var(--color-orange);
  padding: 15px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
}

.btn-next {
  flex: 1;
  background: var(--color-teal);
  border: none;
  color: white;
  padding: 15px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.icon-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #999;
  border-top: 3px solid transparent;
  border-radius: 50%;
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

.card-preview-group {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.card-option {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-preview {
  width: 160px;
  height: auto;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0,0,0,0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.card-preview:hover {
  transform: scale(1.05);
  box-shadow: 0 0 12px rgba(0,0,0,0.3);
}

.card-preview:active {
  transform: scale(0.97);
  box-shadow: 0 0 6px rgba(0,0,0,0.2);
}


</style>
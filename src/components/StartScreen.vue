<script setup>
import {useGameStore} from '../stores/useGameStore';
import baseCardImage from '../assets/base.jpg';
import specialCardImage from '../assets/special.png';
import {ref} from 'vue';

const store = useGameStore();
const diceAnimating = ref(false);

const handleDiceClick = () => {
  if (diceAnimating.value) return;
  diceAnimating.value = true;
  const isSpecial = Math.random() < 0.5;

  setTimeout(() => {
    store.generateCard(isSpecial);
    diceAnimating.value = false;
  }, 1000);
};
</script>

<template>
  <div class="start-screen">
    <div
        class="dice-logo"
        :class="{ animate: diceAnimating }"
        @click="handleDiceClick"
    >
      🎲
    </div>
    <p>Нажмите на кубик или выберите карту для генерации:</p>
    <div class="card-preview-group">
      <div class="card-option">
        <img :src="baseCardImage" alt="Обычная карточка"
             class="card-preview" @click="store.generateCard(false)" />
      </div>
      <div class="card-option">
        <img :src="specialCardImage" alt="Особая карточка"
             class="card-preview" @click="store.generateCard(true)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  cursor: pointer;
  transition: transform 0.3s ease;
}

.dice-logo.animate {
  animation: spin-fast 0.6s linear; /* короткая и быстрая анимация */
}

@keyframes spin-fast {
  0%   { transform: rotate(0deg) scale(1); }
  25%  { transform: rotate(360deg) scale(1.1); }
  50%  { transform: rotate(720deg) scale(1.1); }
  75%  { transform: rotate(1080deg) scale(1.05); }
  100% { transform: rotate(1440deg) scale(1); }
}


.card-preview-group {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.card-preview {
  width: 160px;
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
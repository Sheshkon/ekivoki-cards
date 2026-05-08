<script setup>
import { useGameStore } from '../stores/useGameStore';
import baseCardImage from '../assets/img/base1.png';
import specialCardImage from '../assets/img/special1.png';
import DiceRoller from './DiceRoller.vue';

const store = useGameStore();

const handleDiceResult = (result) => {
  store.lastDiceRoll = result;
  store.startGame(result === 6 ? 'special' : 'normal');
};
</script>

<template>
  <div class="start-screen">
    <DiceRoller
        :size="10"
        class="dice-roller"
        @rolled="handleDiceResult"
    />

    <div class="card-preview-group">
      <img
          :src="baseCardImage"
          :alt="$t('start_screen.base_card_alt')"
          class="card-preview"
          @click="store.resetDice(); store.startGame('normal')"
      />

      <img
          :src="specialCardImage"
          :alt="$t('start_screen.special_card_alt')"
          class="card-preview"
          @click="store.resetDice(); store.startGame('special')"
      />
    </div>
  </div>
</template>

<style scoped>
.start-screen {
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
  padding: clamp(0.5rem, 2.5vw, 1.25rem);
  min-height: 100%;
  width: min(100%, 48rem);
  margin-inline: auto;
  box-sizing: border-box;
  overflow-x: clip;
}

.card-preview-group {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: clamp(0.5rem, 2vw, 1rem);
  margin-top: clamp(0.5rem, 2vh, 1rem);
}

.card-preview {
  height: 30dvh;
  max-width: 45%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: var(--border-radius);
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.30);
  transition: 0.2s;
  cursor: pointer;
  animation: float 3s ease-in-out infinite;
  border: var(--color-bg) solid;
}

.card-preview:hover {
  transform: translateY(-5px);
  animation: float 3s ease-in-out infinite;
}

.card-preview:active {
  transform: scale(0.98);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
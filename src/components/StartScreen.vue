<script setup>
import {useGameStore} from '../stores/useGameStore';
import baseCardImage from '../assets/img/base1.png';
import specialCardImage from '../assets/img/special1.png';
import DiceRoller from "./DiceRoller.vue";

const store = useGameStore();
</script>
<template>
  <div class="start-screen">
    <DiceRoller :size="80" class="dice-roller"/>
    <div class="card-preview-group">
      <img
          :src="baseCardImage"
          :alt="$t('start_screen.base_card_alt')"
          class="card-preview"
          @click="store.startGame('normal')"
      />
      <img
          :src="specialCardImage"
          :alt="$t('start_screen.special_card_alt')"
          class="card-preview"
          @click="store.startGame('special')"
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
  align-items: stretch;
  gap: clamp(0.5rem, 2vw, 1rem);
  width: 100%;
  margin-top: clamp(0.5rem, 2vh, 1rem);
  flex-wrap: wrap;
}

.card-preview {
  flex: 0 1 clamp(7.5rem, 28vw, 10rem);
  width: clamp(7.5rem, 28vw, 10rem);
  max-width: 42vw;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.30);
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

/* Media queries for even smaller screens like iPhone SE */
@media (max-width: 375px) {
  .start-screen {
    gap: 1rem;
    padding-top: 0.75rem;
  }

  .card-preview-group {
    gap: 0.5rem;
  }

  .card-preview {
    flex-basis: min(7rem, 42vw);
    width: min(7rem, 42vw);
  }
}

@media (max-height: 600px) {
  .start-screen {
    padding-top: 0.5rem;
    gap: 0.75rem;
  }
  .card-preview-group {
    margin-top: 0.5rem;
  }
}
</style>
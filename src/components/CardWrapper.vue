<script setup>
import { useGameStore } from '../stores/useGameStore';
import vSwipe from '../directives/vSwipe';
import SpecialCard from './SpecialCard.vue';
import BaseCard from './BaseCard.vue';

const store = useGameStore();

const handleSwipe = async () => {
  if (!store.timerActive) {
    await store.skipCard();
  }
};
</script>

<template>
  <div class="card-wrapper">
    <div
        v-if="store?.currentCard"
        class="game-card"
        :class="{ 'special': store?.currentCard?.isSpecial }"
        v-swipe="handleSwipe"
    >
      <div class="card-title-header">
        {{ store?.currentCard?.topic || $t('card_wrapper.no_title') }}
      </div>

      <div class="task-list single-task">
        <SpecialCard v-if="store.currentCard.isSpecial" :card="store.currentCard" />
        <BaseCard v-else :card="store.currentCard" />
      </div>

      <div class="hint" v-if="!store.timerActive">
        {{ $t('card_wrapper.swipe_hint') }}
      </div>
      <div class="hint hint-disabled" v-else>
        {{ $t('card_wrapper.swipe_disabled_hint') }}
      </div>
    </div>
  </div>
</template>


<style scoped>
.card-wrapper {
  perspective: 1000px;
  width: 100%;
  max-width: 350px;
  min-height: 50vh;
  max-height: fit-content;
  flex-grow: 1;
  display: flex;
}

.game-card {
  border-radius: 20px;
  padding: 24px;
  flex-grow: 1;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-top: 8px solid var(--color-teal);
  transition: transform 0.3s ease;
  animation: slideIn 0.4s ease-out;
}

.card-title-header {
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
}

.task-list.single-task {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0;
  padding: 0;
}

.hint {
  text-align: center;
  font-size: 0.8rem;
  margin-top: 20px;
}
.hint-disabled {
  color: var(--color-orange) !important;
}

@keyframes slideIn {
  from {
    transform: translateX(-150px) rotate(-10deg);
    opacity: 0;
  }
  to {
    transform: translateX(0) rotate(0deg);
    opacity: 1;
  }
}
</style>
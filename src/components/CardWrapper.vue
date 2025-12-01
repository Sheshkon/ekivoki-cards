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
        {{ store?.currentCard?.topic || 'Нет заголовка' }}
      </div>

      <div class="task-list single-task">
        <SpecialCard v-if="store.currentCard.isSpecial" :card="store.currentCard" />
        <BaseCard v-else :card="store.currentCard" />
      </div>

      <div class="hint" v-if="!store.timerActive">
        ← Смахни влево, чтобы пропустить
      </div>
      <div class="hint hint-disabled" v-else>
        Таймер активен: свайп отключен
      </div>
    </div>
  </div>
</template>


<style scoped>
.card-wrapper {
  perspective: 1000px;
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  flex-grow: 1;
  display: flex;
}

.game-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  flex-grow: 1;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
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
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 2px dashed var(--color-teal);
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
  color: #ccc;
  font-size: 0.8rem;
  margin-top: 20px;
}
.hint-disabled {
  color: var(--color-orange) !important;
}

@keyframes slideIn {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
<script setup>

import {getDiceIcon} from "./utils.js";

defineProps({
  card: Object
});
</script>

<template>
  <div class="base-card-task">
    <div
        v-for="(task, diceNumber) in card.dice"
        :key="diceNumber"
        class="active-task-display"
    >
      <div class="task-category-info">
        <component :is="getDiceIcon(diceNumber)" class="dice-icon"/>
      </div>
      <div class="task-text-option">{{ task?.phrase || '' }}</div>
      <div class="task-type" v-if="task?.type">
        {{ $t('card.type') }}{{ task.type }}
      </div>
    </div>
    <div class="author" v-if="card?.author">
      {{ $t('card.author') }}{{ card?.author }}
    </div>
  </div>
</template>

<style scoped>
.base-card-task {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  line-height: 1.2;
}

.active-task-display {
  text-align: center;
  border: 3px solid var(--color-teal);
  border-radius: 15px;
  margin: 0;
  padding: clamp(0.3rem, 1.2vw, 0.6rem);
  overflow-wrap: anywhere;
  word-break: break-word;
}

.task-category-info {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

.dice-icon {
  color: var(--color-teal);
  height: clamp(0.8rem, 2vw, 1rem); /* Responsive icon size */
}

.task-text-option {
  font-weight: 700;
  font-size: clamp(0.72rem, 1.4vw, 0.95rem);
}

.task-type {
  font-size: clamp(0.62rem, 1.1vw, 0.78rem);
}

.author {
  font-size: clamp(0.6rem, 1vw, 0.75rem);
  margin-top: clamp(0.12rem, 0.5vh, 0.3rem);
  overflow-wrap: anywhere;
}

@media (min-width: 769px) and (max-width: 1024px) {
  .task-text-option {
    font-size: clamp(0.68rem, 1.05vw, 0.82rem);
  }
  .task-type {
    font-size: clamp(0.58rem, 0.86vw, 0.7rem);
  }
  .author {
    font-size: clamp(0.56rem, 0.78vw, 0.68rem);
  }
}

@media (min-width: 1025px) and (max-width: 1279px) {
  .task-text-option {
    font-size: clamp(0.64rem, 0.88vw, 0.76rem);
  }
  .task-type {
    font-size: clamp(0.54rem, 0.72vw, 0.64rem);
  }
  .author {
    font-size: clamp(0.52rem, 0.66vw, 0.62rem);
  }
}

@media (min-width: 1280px) {
  .task-text-option {
    font-size: clamp(0.66rem, 0.76vw, 0.8rem);
  }
  .task-type {
    font-size: clamp(0.56rem, 0.62vw, 0.66rem);
  }
  .author {
    font-size: clamp(0.54rem, 0.58vw, 0.64rem);
  }
}
</style>

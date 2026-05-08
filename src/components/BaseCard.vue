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
  justify-content: space-around;
  flex: 1;
  background: none;
  line-height: 1.2;
}

.active-task-display {
  text-align: center;
  border: 1px solid var(--color-teal);
  border-radius: 15px;
  margin: 0;
  padding: 1dvh;
  background: color-mix(in srgb, var(--color-bg) 98%, black);
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
  height: var(--font-size-l)
}

.task-text-option {
  font-weight: 700;
  font-size: var(--font-size-m)
}

.task-type {
  font-weight: 100;
  font-size: var(--font-size-xs);
}

.author {
  font-size: var(--font-size-xs);
}

</style>

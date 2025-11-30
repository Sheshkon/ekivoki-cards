<script setup>
defineProps({
  card: Object
});
</script>

<template>
  <div class="all-dice-tasks">
    <div
        v-for="(task, diceNumber) in card.dice"
        :key="diceNumber"
        class="active-task-display"
    >
      <div class="task-category-info">
        <div class="dice-icon">🎲</div>
      </div>
      <div class="task-text-option">{{ task?.phrase || '' }}</div>
      <div class="task-type" v-if="task?.type">
        Тип: {{ task.type }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.active-task-display {
  text-align: center;
  border: 3px solid var(--color-teal);
  border-radius: 15px;
  background-color: #f8ffff;
  margin: 20px;
}

.task-category-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dice-icon {
  color: var(--color-orange);
}

.task-text-option {
    font-weight: 700;
}
</style>

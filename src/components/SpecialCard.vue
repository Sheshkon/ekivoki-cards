<script setup>
defineProps({
  card: Object
});
</script>

<template>
  <div class="special-task">
    <div class="special-label">
      Экивоки! Особое задание
    </div>
    <div class="special-text">
      {{ card.dice6?.phrase || 'Задание отсутствует' }}
    </div>
    <div class="special-type" v-if="card.dice6?.type">
      Тип задания: {{ card.dice6.type }}
    </div>
    <div class="special-comments" v-if="card.comments">
      {{ card.comments }}
    </div>
    <div class="special-author" v-if="card.author">
      Автор: {{ card.author }}
    </div>
  </div>
</template>

<style scoped>
.special-task {
  text-align: center;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.special-label {
  font-weight: bold;
  font-size: 1.5rem;
  color: var(--color-purple);
  margin-bottom: 15px;
}
.special-text {
  font-weight: 700;
  color: var(--color-text);
}
.special-type {
  font-style: italic;
}
.special-comments {
  font-style: oblique;
}
</style>

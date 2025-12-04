<script setup>
defineProps({
  card: Object
});
</script>

<template>
  <div class="special-task">
    <div class="special-label">
      {{ $t('special_task.label') }}
    </div>
    <div class="special-text">
      {{ card.dice6?.phrase || $t('special_task.no_task') }}
    </div>
    <div class="special-type" v-if="card.dice6?.type">
      {{ $t('special_task.type') }} {{ card.dice6.type }}
    </div>
    <div class="special-comments" v-if="card.comments">
      {{ card.comments }}
    </div>
    <div class="special-author" v-if="card.author">
      {{ $t('special_task.author') }} {{ card.author }}
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
  background-color: var(--color-bg);
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

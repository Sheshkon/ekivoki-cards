<script setup>
import { categories, resolveCategoryStyle } from '../lib/boardConfig';

const props = defineProps({
  boardStyle: { type: Object, required: true },
  rules: { type: Object, required: true }
});

const emit = defineEmits(['update:rules']);

function updateRule(categoryId, text) {
  emit('update:rules', {
    ...props.rules,
    [categoryId]: text
  });
}

function categoryPreview(categoryId) {
  return resolveCategoryStyle(categoryId, props.boardStyle);
}
</script>

<template>
  <section class="panel-section">
    <div class="section-title">
      <h2>Правила клеток</h2>
    </div>

    <div class="rules-list">
      <label v-for="category in categories" :key="category.id" class="rule-card">
        <span class="rule-head">
          <i :style="{ background: categoryPreview(category.id).color }">{{ category.short }}</i>
          <strong>{{ category.label }}</strong>
        </span>
        <textarea
          :value="rules[category.id]"
          rows="3"
          @input="updateRule(category.id, $event.target.value)"
        ></textarea>
      </label>
    </div>
  </section>
</template>

<style scoped src="./RulesEditor.css"></style>

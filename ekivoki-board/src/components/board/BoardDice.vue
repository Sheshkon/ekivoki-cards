<script setup>
import { computed } from 'vue';

const props = defineProps({
  diceValue: { type: Number, default: 1 },
  isRolling: { type: Boolean, default: false },
  cubeStyle: { type: Object, required: true },
  positionStyle: { type: Object, required: true }
});

const diceFaces = computed(() => {
  const top = props.diceValue;
  const bottom = 7 - top;
  const pool = [1, 2, 3, 4, 5, 6].filter((value) => value !== top && value !== bottom);
  return {
    top,
    bottom,
    front: pool[0],
    right: pool[1],
    left: pool[2],
    back: pool[3]
  };
});
</script>

<template>
  <button
    class="board-dice"
    :class="{ rolling: isRolling }"
    :style="positionStyle"
    type="button"
    aria-label="Кубик"
  >
    <div class="dice-cube" :style="cubeStyle">
      <span class="dice-face dice-front" :data-value="diceFaces.front"></span>
      <span class="dice-face dice-back" :data-value="diceFaces.back"></span>
      <span class="dice-face dice-top" :data-value="diceFaces.top"></span>
      <span class="dice-face dice-bottom" :data-value="diceFaces.bottom"></span>
      <span class="dice-face dice-right" :data-value="diceFaces.right"></span>
      <span class="dice-face dice-left" :data-value="diceFaces.left"></span>
    </div>
  </button>
</template>

<script setup>
const props = defineProps({
  isActive: { type: Boolean, default: false },
  isGhost: { type: Boolean, default: false },
  player: { type: Object, required: true },
  styleBuilder: { type: Function, required: true },
  title: { type: String, default: '' }
});
</script>

<template>
  <component
    :is="isGhost ? 'div' : 'button'"
    class="token"
    :class="{ active: isActive, 'dragging-origin': player.dragging && !isGhost, moving: player.moving, 'token-ghost': isGhost }"
    :style="styleBuilder(player)"
    :title="title"
    :type="isGhost ? undefined : 'button'"
    :aria-hidden="isGhost ? 'true' : undefined"
  >
    <span class="token-icon" aria-hidden="true"></span>
  </component>
</template>

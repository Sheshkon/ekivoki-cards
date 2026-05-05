<script setup>
import { ref, computed, onBeforeUnmount, onBeforeUpdate, nextTick } from 'vue';
import { useGameStore } from '../stores/useGameStore';
import SpecialCard from './SpecialCard.vue';
import BaseCard from './BaseCard.vue';

const store = useGameStore();

const wrapperRef = ref(null);
const stackRef = ref(null);
const cardsRef = ref([]);

const startX = ref(0);
const currentX = ref(0);
const dragging = ref(false);

let raf = null;

/* refs sync */
onBeforeUpdate(() => {
  cardsRef.value = [];
});

const setCardRef = (el, index) => {
  if (!el) return;
  cardsRef.value[index] = el;
};

const visibleCards = computed(() => store.visibleCards || []);

/* DRAG START */
const onPointerDown = (e) => {
  if (store.timerActive) return;

  dragging.value = true;
  startX.value = e.clientX;
  currentX.value = e.clientX;

  cardsRef.value.forEach(card => {
    if (card) card.style.transition = 'none';
  });

  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
};

/* MOVE */
const onMove = (e) => {
  if (!dragging.value) return;

  currentX.value = e.clientX;

  if (raf) return;

  raf = requestAnimationFrame(() => {
    raf = null;

    const delta = currentX.value - startX.value;

    const topCard = cardsRef.value[0];
    if (!topCard) return;

    const rot = delta * 0.04;

    topCard.style.transform =
        `translate3d(${delta}px, 0, 0) rotate(${rot}deg)`;
  });
};

/* END */
const onUp = () => {
  if (!dragging.value) return;

  const delta = currentX.value - startX.value;
  const threshold = 120;

  const topCard = cardsRef.value[0];
  if (!topCard) return;

  if (Math.abs(delta) > threshold) {
    const dir = Math.sign(delta);

    topCard.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    topCard.style.transform =
        `translate3d(${dir * 400}px, 0, 0) rotate(${dir * 18}deg)`;
    topCard.style.opacity = '0';

    setTimeout(async () => {
      await store.skipCard();
      await nextTick();

      cardsRef.value.forEach(c => {
        if (!c) return;
        c.style.transition = '';
        c.style.transform = '';
        c.style.opacity = '';
      });
    }, 260);

  } else {
    cardsRef.value.forEach(c => {
      if (!c) return;
      c.style.transition = '0.3s ease';
      c.style.transform = '';
      c.style.opacity = '';
    });
  }

  cleanup();
};

const cleanup = () => {
  dragging.value = false;
  window.removeEventListener('pointermove', onMove);
  window.removeEventListener('pointerup', onUp);
};

onBeforeUnmount(cleanup);
</script>

<template>
  <div class="card-wrapper" ref="wrapperRef">
    <div class="card-stack" ref="stackRef" @pointerdown="onPointerDown">

      <!-- 🔥 ДИНАМИЧЕСКИЕ СЛОИ ГЛУБИНЫ КОЛОДЫ -->
      <div class="stack-depth">
        <div
            v-for="i in 4"
            :key="i"
            class="depth"
            :style="{
              '--depth-index': i,
              '--x-offset': `${i * 3}px`,
              '--y-offset': `${i * 4}px`,
              '--scale': 1 - (i * 0.008),
              'zIndex': 5 - i
            }"
        />
      </div>

      <div class="dynamic-cards">
        <div
            v-for="(card, index) in visibleCards.slice(0, 2)"
            :key="card._uid"
            class="game-card"
            :ref="el => setCardRef(el, index)"
            :style="{
              zIndex: visibleCards.length - index + 2,
              'willChange': 'transform'
            }"

        >
          <div class="card-title-header">
            {{ card.topic }}
          </div>

          <SpecialCard v-if="card.isSpecial" :card="card" />
          <BaseCard v-else :card="card" />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.card-wrapper {
  --deck-vspace: 12rem;
  --deck-width: min(48vw, 20rem);
  width: min(100%, var(--deck-width), calc((100dvh - var(--deck-vspace)) * 0.6667));
  max-height: calc(100dvh - var(--deck-vspace));
  aspect-ratio: 2 / 3;
  margin-inline: auto;
  perspective: 2200px;
  overflow: visible;
}

.card-stack {
  position: relative;
  width: 100%;
  height: 100%;
  transform: rotateX(12deg);
  touch-action: none;
}

/* ===================== */
/* 🔥 ДИНАМИЧЕСКАЯ ГЛУБИНА КОЛОДЫ */
/* ===================== */

.stack-depth {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.depth {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: var(--color-bg);
  box-shadow: 0 10px 25px rgba(0,0,0,0.12);
  border: solid 1px;
  transform: translateX(var(--x-offset)) translateY(var(--y-offset)) scale(var(--scale));
  opacity: 1;
}

/* ===================== */

.dynamic-cards {
  position: absolute;
  inset: 0;
  z-index: 2;
}

.game-card {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  padding: clamp(12px, 3vw, 20px);
  box-sizing: border-box;
  background: var(--color-bg);
  will-change: transform;
  backface-visibility: hidden;
  transition: none;
  border: solid 1px;
}

/* responsive */
@media (max-width: 480px) {
  .card-wrapper {
    --deck-vspace: 9rem;
    --deck-width: min(96vw, 19rem);
  }
}

@media (min-width: 1280px) {
  .card-wrapper {
    --deck-vspace: 13.5rem;
    --deck-width: clamp(18rem, 28vmin, 24rem);
  }
}
</style>
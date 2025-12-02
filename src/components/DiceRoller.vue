<script setup>
import {reactive, nextTick, computed} from 'vue';

const props = defineProps({
  size: {
    type: Number,
    default: 120,
    required: false
  },
});

const halfSize = computed(() => props.size / 2);

const diceState = reactive({
  rotX: -25,
  rotY: 45,
  isRolling: false,
});

const faces = {
  1: {x: 0, y: 0},
  2: {x: 0, y: -90},
  3: {x: 0, y: -180},
  4: {x: 0, y: 90},
  5: {x: -90, y: 0},
  6: {x: 90, y: 0},
};

const rollDice = async () => {
  if (diceState.isRolling) return;
  diceState.isRolling = true;

  await new Promise(resolve => setTimeout(resolve, 50));

  const cubeElement = document.querySelector('.cube');
  if (!cubeElement) {
    diceState.isRolling = false;
    return;
  }

  cubeElement.style.transition = 'none';
  cubeElement.style.transform = `rotateX(${diceState.rotX}deg) rotateY(${diceState.rotY}deg)`;

  await nextTick();

  cubeElement.style.transition = 'transform 1.5s cubic-bezier(0.15, 0.9, 0.34, 1.15)';

  const result = Math.floor(Math.random() * 6) + 1;
  const target = faces[result];

  const baseRotX = Math.round(diceState.rotX / 360) * 360;
  const baseRotY = Math.round(diceState.rotY / 360) * 360;

  const totalSpins = (Math.floor(Math.random() * 5) + 5) * 360;

  diceState.rotX = baseRotX + totalSpins + target.x;
  diceState.rotY = baseRotY + totalSpins + target.y;

  setTimeout(() => {
    diceState.isRolling = false;
    console.log('Выпало:', result);
  }, 1500);
};
</script>

<template>
  <div
      class="dice-roller-container"
      :style="{
      '--cube-size': `${props.size}px`,
      '--half-size': `${halfSize}px`,
      '--border-radius': `${props.size / 10}px`,
      '--dot-size': `${props.size / 5}px`,
      '--dot-size-big': `${props.size / 5}px`,
      '--padding': `${props.size / 12}px`,
    }"
  >

    <div class="scene">
      <div
          class="cube"
          @click="rollDice"
          :style="{ transform: `rotateX(${diceState.rotX}deg) rotateY(${diceState.rotY}deg)` }"
      >
        <div class="cube__face cube__face--1"><span class="dot big"></span></div>
        <div class="cube__face cube__face--2"><span class="dot"></span><span class="dot"></span></div>
        <div class="cube__face cube__face--3"><span class="dot"></span><span class="dot"></span><span
            class="dot"></span></div>
        <div class="cube__face cube__face--4">
          <div class="column"><span class="dot"></span><span class="dot"></span></div>
          <div class="column"><span class="dot"></span><span class="dot"></span></div>
        </div>
        <div class="cube__face cube__face--5">
          <div class="column"><span class="dot"></span><span class="dot"></span></div>
          <div class="column justify-center"><span class="dot"></span></div>
          <div class="column"><span class="dot"></span><span class="dot"></span></div>
        </div>
        <div class="cube__face cube__face--6">
          <div class="column"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
          <div class="column"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
        </div>
      </div>
    </div>

    <p class="instruction">
      {{ diceState.isRolling ? 'Кубик катится...' : 'Нажми, чтобы бросить!' }}
    </p>

  </div>
</template>
<style scoped>
.dice-roller-container {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  perspective: 1000px;
  padding-top: 40px;
}

.scene {
  width: var(--cube-size);
  height: var(--cube-size);
  perspective: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.cube {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 1.5s cubic-bezier(0.15, 0.9, 0.34, 1.15);
  cursor: pointer;
}

.cube:hover {
  scale: 1.05;
  transition: scale 0.3s ease;
}

.cube__face {
  position: absolute;
  width: var(--cube-size);
  height: var(--cube-size);
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border-radius: var(--border-radius);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
  display: flex;
  padding: var(--padding);
  box-sizing: border-box;
  justify-content: space-between;
  outline: 1px solid rgba(255, 255, 255, 0.01);
}

.dot {
  display: block;
  width: var(--dot-size);
  height: var(--dot-size);
  border-radius: 50%;
  background: #333;
  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.5);
}

.dot.big {
  width: var(--dot-size-big);
  height: var(--dot-size-big);
  background: #e63946;
}

.cube__face--1 {
  justify-content: center;
  align-items: center;
  transform: rotateY(0deg) translateZ(var(--half-size));
}

.cube__face--2 {
  transform: rotateY(90deg) translateZ(var(--half-size));
}

.cube__face--2 .dot:nth-child(2) {
  align-self: flex-end;
}

.cube__face--3 {
  transform: rotateY(180deg) translateZ(var(--half-size));
}

.cube__face--3 .dot:nth-child(2) {
  align-self: center;
}

.cube__face--3 .dot:nth-child(3) {
  align-self: flex-end;
}

.cube__face--4 {
  transform: rotateY(-90deg) translateZ(var(--half-size));
}

.cube__face--5 {
  transform: rotateX(90deg) translateZ(var(--half-size));
}

.cube__face--6 {
  transform: rotateX(-90deg) translateZ(var(--half-size));
}

.column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.justify-center {
  justify-content: center;
}

.instruction {
  font-size: 1.1rem;
  color: #666;
  font-weight: 500;
}
</style>
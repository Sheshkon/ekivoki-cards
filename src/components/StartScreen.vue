<script setup>
import {useGameStore} from '../stores/useGameStore';
import baseCardImage from '../assets/base.jpg';
import specialCardImage from '../assets/special.png';
import DiceRoller from "./DiceRoller.vue";

const store = useGameStore();
</script>
<template>
  <div class="start-screen">
    <DiceRoller :size="80" class="dice-roller"/>
    <div class="card-preview-group">
      <img :src="baseCardImage" alt="Обычная карточка" class="card-preview" @click="store.generateCard(false)"/>
      <img :src="specialCardImage" alt="Особая карточка" class="card-preview" @click="store.generateCard(true)"/>
    </div>
  </div>
</template>

<style scoped>
.start-screen {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  perspective: 1000px;
  padding-top: 40px;
}

.card-preview-group {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.card-preview {
  width: 160px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: 0.2s;
  cursor: pointer;
}

.card-preview:hover {
  transform: translateY(-5px);
}

.card-preview:active {
  transform: scale(0.98);
}

</style>
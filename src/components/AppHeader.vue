<script setup>
import {onMounted, ref} from 'vue';
import {useGameStore} from '../stores/useGameStore';

import { MdBrightnessMedium, MdInstallDesktop } from 'vue-icons-plus/md';


const store = useGameStore();
const loading = ref(false);
const theme = ref('light');


const handleSync = async () => {
  loading.value = true;
  try {
    await store.sync();
  } finally {
    loading.value = false;
    alert("Колода обновлена.");
  }
};

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme.value);
  localStorage.setItem('theme', theme.value);
};


onMounted(() => {
  const saved = localStorage.getItem('theme');
  if (saved) {
    theme.value = saved;
    document.documentElement.setAttribute('data-theme', saved);
  }
});

</script>

<template>
  <header class="header">
    <h1>Экивоки</h1>
    <div class="controls">
      <button class="icon-btn" @click="toggleTheme">
        <MdBrightnessMedium />
      </button>
      <button class="icon-btn" @click="handleSync" :disabled="loading">
        <span v-if="!loading"><MdInstallDesktop /></span>
        <span v-else class="spinner"></span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-teal);
}

.header .controls {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.icon-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #999;
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
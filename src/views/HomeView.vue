<script setup>
import {isMobileDevice} from "../utils/device.js";

const mobile = isMobileDevice()
</script>

<template>
  <main class="home-page">
    <h1>Эквивоки</h1>
    <p>Выберите режим игры:</p>

    <nav class="home-nav">
      <RouterLink class="home-link" to="/cards">
        Карточки
      </RouterLink>

      <RouterLink
          v-if="!mobile"
          class="home-link"
          to="/board"
      >
        Доска
      </RouterLink>
    </nav>
  </main>
</template>

<style scoped>
.home-page {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  text-align: center;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.home-nav {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.home-link {
  min-width: 9rem;
  padding: 0.9rem 1.2rem;
  border-radius: 0.75rem;
  text-decoration: none;
  font-weight: 600;
  color: #fff;
  background: #2a7fff;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.home-link:hover {
  transform: translateY(-1px);
  opacity: 0.95;
}
</style>

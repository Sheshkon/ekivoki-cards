<script setup>
import {useSettingsStore} from "../stores/useSettingsStore.js";
import {ref, watch} from "vue";
import {VSwatches} from "vue3-swatches";
import 'vue3-swatches/dist/style.css'

const settingsStore = useSettingsStore()

const selectedColor = ref(settingsStore.settings.themeColor)

watch(selectedColor, (newColor) => {
      document.documentElement.style.setProperty("--color-teal", newColor)
      const metaTheme = document.querySelector("meta[name='theme-color']")
      if (metaTheme) {
        metaTheme.setAttribute("content", newColor)
      }

      settingsStore.settings.themeColor = newColor
    },
    {immediate: true}
)


const localCardsUrl = ref(settingsStore.persistentSettings.cardsGoogleSheetUrl)
const localSpecialUrl = ref(settingsStore.persistentSettings.specialCardsGoogleSheetUrl)

const cardsLinkErrors = ref([])
const specialCardsLinkErrors = ref([])

function updateCardsUrl(isSpecial = false) {
  const url = isSpecial ? localSpecialUrl.value : localCardsUrl.value
  const msgs = settingsStore.updateGoogleSheetCardsUrl(url, isSpecial)

  if (isSpecial) {
    specialCardsLinkErrors.value = msgs
    if (!msgs.length) {
      localSpecialUrl.value = settingsStore.persistentSettings.specialCardsGoogleSheetUrl
    }
  } else {
    cardsLinkErrors.value = msgs
    if (!msgs.length) {
      localCardsUrl.value = settingsStore.persistentSettings.cardsGoogleSheetUrl
    }
  }
}

function resetCardsUrl(isSpecial = false) {
  const msgs = settingsStore.updateGoogleSheetCardsUrl(null, isSpecial)

  if (isSpecial) {
    specialCardsLinkErrors.value = msgs
    localSpecialUrl.value = settingsStore.persistentSettings.specialCardsGoogleSheetUrl
  } else {
    cardsLinkErrors.value = msgs
    localCardsUrl.value = settingsStore.persistentSettings.cardsGoogleSheetUrl
  }
}
</script>

<template>
  <div class="settings">
    <h1>Настройки</h1>
    <div>
      <v-swatches
          v-model="selectedColor"
          :swatches="['#3fbfb7','#ff6b6b','#ffa500','#0078d7','#8a2be2','#00ff00','#ff00ff']"
          inline
          shapes="circles"
          :row-length="5"
          :swatch-size="28"
          :spacing-size="6"
          background-color="none"
      />
    </div>
    <div class="setting-item column">
      <label>Ссылка на карты:</label>
      <input
          v-model="localCardsUrl"
          :class="{ invalid: cardsLinkErrors.length }"
      />
      <ul v-if="cardsLinkErrors.length" class="errors">
        <li v-for="(err, i) in cardsLinkErrors" :key="i">{{ err }}</li>
      </ul>
      <div class="buttons">
        <button class="primary" @click="updateCardsUrl(false)">Обновить</button>
        <button class="secondary" @click="resetCardsUrl(false)">Использовать дефолтную</button>
      </div>

    </div>

    <div class="setting-item column">
      <label>Ссылка на специальные карты:</label>
      <input
          v-model="localSpecialUrl"
          :class="{ invalid: specialCardsLinkErrors.length }"
      />
      <ul v-if="specialCardsLinkErrors.length" class="errors">
        <li v-for="(err, i) in specialCardsLinkErrors" :key="i">{{ err }}</li>
      </ul>
      <div class="buttons">
        <button class='primary' @click="updateCardsUrl(true)">Обновить</button>
        <button class="secondary" @click="resetCardsUrl(true)">Использовать дефолтную</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings {
  flex: 1;
  padding: 2rem;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.8rem 0;
}

.setting-item.column {
  flex-direction: column;
  align-items: flex-start;
}

.setting-item input {
  flex: 1;
  width: 100%;
  padding: 0.4rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  word-break: break-all;
}

.setting-item input.invalid {
  border-color: #d93025;
  background: #ffecec;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.setting-item button {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.setting-item button.primary {
  color: var(--color-text);
  background: var(--color-teal);
}

.setting-item button.secondary {
  color: var(--color-orange);
  background: #fff;
}

.errors {
  margin: 0.5rem 0 0;
  padding: 0;
  list-style: none;
  color: #d93025;
  font-size: 0.85rem;
}
</style>
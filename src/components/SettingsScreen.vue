<script setup>
import {useSettingsStore} from "../stores/useSettingsStore.js";
import {reactive} from "vue";
import {VSwatches} from "vue3-swatches";
import Multiselect from "@vueform/multiselect";
import {langOptions} from "../i18n.js";
import {BACKGROUNDS} from "../stores/config.js";
import PromptGenerator from "./PromptGenerator.vue";

const settingsStore = useSettingsStore();

const localState = reactive({
  urls: {
    cards: settingsStore.persistentSettings.cardsGoogleSheetUrl,
    special: settingsStore.persistentSettings.specialCardsGoogleSheetUrl,
  },
  errors: {
    cards: [],
    special: []
  }
});

function handleCardsUrl(type, action = "update") {
  const isSpecial = type === "special";
  const url = action === "update" ? localState.urls[type] : null;
  const msgs = settingsStore.updateGoogleSheetCardsUrl(url, isSpecial);

  localState.errors[type] = msgs;

  if (!msgs.length) {
    localState.urls[type] = isSpecial
        ? settingsStore.persistentSettings.specialCardsGoogleSheetUrl
        : settingsStore.persistentSettings.cardsGoogleSheetUrl;
  }
}

function resetAllToDefaults() {
  settingsStore.resetToDefaults();
  localState.urls.cards = settingsStore.persistentSettings.cardsGoogleSheetUrl;
  localState.urls.special = settingsStore.persistentSettings.specialCardsGoogleSheetUrl;
  localState.errors.cards = [];
  localState.errors.special = [];
}

</script>

<template>
  <div class="settings">
    <h1>{{ $t('settings.title') }}</h1>
    <v-swatches
        v-model="settingsStore.settings.themeColor"
        @update:modelValue="settingsStore.setThemeColor"
        :swatches="['#3fbfb7','#ff6b6b','#ffa500','#0078d7','#8a2be2','#00ff00','#ff00ff']"
        inline
        shapes="circles"
        :row-length="5"
        :swatch-size="28"
        :spacing-size="6"
        background-color="none"
    />
    <div class="setting-item small-input">
      <label>{{ $t('settings.background') }}:</label>
      <Multiselect
          v-model="settingsStore.settings.backgroundKey"
          :options="BACKGROUNDS.map(bg => ({ label: bg.name, value: bg.key }))"
          :searchable="false"
          :clearable="false"
          @update:modelValue="val => settingsStore.setBackground(val)"
      />
    </div>
    <div class="setting-item small-input">
      <label>{{ $t('settings.language') }}:</label>
      <Multiselect
          v-model="settingsStore.settings.language"
          :options="langOptions"
          :searchable="false"
          :clearable="false"
          @update:modelValue="val => { if (val) settingsStore.setLanguage(val) }"
          label="label"
          track-by="value"
      />
    </div>
    <div class="setting-item column">
      <label>{{ $t('settings.cards_link') }}:</label>
      <input
          v-model="localState.urls.cards"
          :class="{ invalid: localState.errors.cards.length }"
      />
      <ul v-if="localState.errors.cards.length" class="errors">
        <li v-for="(err, i) in localState.errors.cards" :key="i">{{ err }}</li>
      </ul>
      <div class="buttons">
        <button class="primary" @click="handleCardsUrl('cards','update')">
          {{ $t('settings.update') }}
        </button>
        <button class="secondary" @click="handleCardsUrl('cards','reset')">
          {{ $t('settings.use_default') }}
        </button>
      </div>
    </div>
    <div class="setting-item column">
      <label>{{ $t('settings.special_cards_link') }}:</label>
      <input
          v-model="localState.urls.special"
          :class="[{ invalid: localState.errors.special.length}, 'link']"
      />
      <ul v-if="localState.errors.special.length" class="errors">
        <li v-for="(err, i) in localState.errors.special" :key="i">{{ err }}</li>
      </ul>
      <div class="buttons">
        <button class="primary" @click="handleCardsUrl('special','update')">
          {{ $t('settings.update') }}
        </button>
        <button class="secondary" @click="handleCardsUrl('special','reset')">
          {{ $t('settings.use_default') }}
        </button>
      </div>
    </div>
    <div class="reset-all setting-item">
      <button class="danger" @click="resetAllToDefaults()">
        {{ $t('settings.reset_all') }}
      </button>
    </div>
    <PromptGenerator/>
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
  color: var(--color-text);
  font-weight: bold;
}

.setting-item.column {
  flex-direction: column;
  align-items: flex-start;
}

.setting-item.small-input {
  width: 15rem;
}

.setting-item input {
  flex: 1;
  width: 100%;
  padding: 0.8rem 0.6rem;
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
  color: var(--color-red);
  background: #fff;
}

.errors {
  margin: 0.5rem 0 0;
  padding: 0;
  list-style: none;
  color: #d93025;
}

.danger {
  background-color: var(--color-red);
}

.reset-all {
  margin-top: 3rem;
  margin-left: 0;
}

</style>
<script setup>
import { reactive, ref, nextTick } from "vue";
import { useSettingsStore } from "../stores/useSettingsStore.js";
import { buildPrompt } from "../prompts/prompts.js";

const settingsStore = useSettingsStore();
const form = reactive({
  theme: "IT",
  cardCount: 10,
  author: "AI"
});

const promptText = ref("");
const show = ref(false);
const copied = ref(false);

const outputRef = ref(null);

function onGenerate() {
  copied.value = false;
  promptText.value = buildPrompt({
    theme: form.theme,
    author: form.author,
    standardCount: form.cardCount,
    specialCount: form.cardCount,
    lang: settingsStore.settings.language
  });
  show.value = true;

  nextTick(() => {
    if (outputRef.value) {
      outputRef.value.scrollIntoView({ behavior: "smooth" });
    }
  });
}

function onClear() {
  promptText.value = "";
  show.value = false;
  copied.value = false;
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(promptText.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch (e) {
    copied.value = false;
  }
}
</script>

<template>
  <section class="prompt-generator">
    <h2>{{ $t('prompt_generator.title') }}</h2>

    <div class="prompt-row small-input">
      <label>{{ $t('prompt_generator.topic') }}:</label>
      <input v-model="form.theme" />
    </div>

    <div class="prompt-row small-input">
      <label>{{ $t('prompt_generator.cards_count') }}:</label>
      <input type="number" v-model.number="form.cardCount" min="1" />
    </div>

    <div class="prompt-row small-input">
      <label>{{ $t('prompt_generator.author') }}:</label>
      <input v-model="form.author" />
    </div>

    <div class="buttons">
      <button class="primary" @click="onGenerate">
        {{ $t('prompt_generator.generate_button') }}
      </button>
      <button class="secondary" @click="onClear">
        {{ $t('prompt_generator.clear_button') }}
      </button>
    </div>

    <div v-if="show" class="prompt-output" ref="outputRef">
      <label>{{ $t('prompt_generator.generated_prompt') }}:</label>
      <textarea readonly rows="18" v-model="promptText"></textarea>
      <div class="buttons">
        <button class="primary" @click="copyToClipboard">
          {{ copied ? $t('prompt_generator.copied_status') : $t('prompt_generator.copy_button') }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.prompt-generator {
  font-size: 1rem;
  font-weight: bold;
  margin-top: 2rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.prompt-generator h2 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-text);
}

.prompt-row {
  display: flex;
  align-items: center;
}

.prompt-row label {
  min-width: 6rem;
  font-weight: 600;
  color: var(--color-text);
}

.prompt-row input {
  flex: 1;
  padding: 0.5rem 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.prompt-row.small-input input {
  max-width: 10rem;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

button {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
}

button.primary {
  color: var(--color-text);
  background: var(--color-teal);
}

button.secondary {
  color: var(--color-orange);
  background: #fff;
}

.prompt-output {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.prompt-output label {
  font-weight: 600;
  color: var(--color-text);
}

.prompt-output textarea {
  width: 100%;
  padding: 0.8rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-family: monospace;
  font-size: 0.95rem;
  white-space: pre-wrap;
  resize: vertical;
  background: #fafafa;
}
</style>
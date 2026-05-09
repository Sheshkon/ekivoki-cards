<script setup>
import { createBoardSnapshot, downloadBoard, readFileAsText } from '../lib/boardStorage';

const props = defineProps({
  boards: { type: Array, required: true },
  currentBoard: { type: Object, required: true }
});

const emit = defineEmits(['delete', 'import', 'load']);

function exportCurrentBoard() {
  downloadBoard(createBoardSnapshot(props.currentBoard));
}

function exportBoard(board) {
  downloadBoard(board);
}

async function importBoardFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const content = await readFileAsText(file);
    emit('import', JSON.parse(content));
  } finally {
    event.target.value = '';
  }
}
</script>

<template>
  <section class="panel-section library-section">
    <div class="section-title">
      <h2>Мои борды</h2>
      <button class="icon-button" type="button" title="Экспорт текущего борда" @click="exportCurrentBoard">⇩</button>
    </div>

    <label class="file-field compact-file">
      <span>Импорт борда</span>
      <input type="file" accept="application/json,.json,.ekivoki-board.json" @change="importBoardFile" />
    </label>

    <div v-if="boards.length" class="board-list">
      <article v-for="board in boards" :key="board.id" class="saved-board">
        <button class="saved-board-main" type="button" @click="emit('load', board)">
          <strong>{{ board.name }}</strong>
          <span>{{ board.route?.length || 0 }} клеток</span>
        </button>
        <button class="ghost-button" type="button" title="Экспорт" @click="exportBoard(board)">⇩</button>
        <button class="ghost-button" type="button" title="Удалить" @click="emit('delete', board.id)">×</button>
      </article>
    </div>

    <p v-else class="empty-note">Сохранённые борды появятся здесь.</p>
  </section>
</template>

<style scoped src="./BoardLibrary.css"></style>

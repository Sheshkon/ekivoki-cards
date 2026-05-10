<script setup>
const props = defineProps({
  activePlayerId: { type: Number, required: true },
  isAnimating: { type: Boolean, default: false },
  playerCount: { type: Number, required: true },
  players: { type: Array, required: true },
  showPlayerSettings: { type: Boolean, default: false },
  stepInput: { type: Number, required: true },
  useDice: { type: Boolean, default: false }
});

const emit = defineEmits([
  'move',
  'reset',
  'roll',
  'update:activePlayerId',
  'update:playerCount',
  'update:players',
  'update:showPlayerSettings',
  'update:stepInput',
  'update:useDice'
]);

function updatePlayerName(playerId, name) {
  emit('update:players', props.players.map((player) => (
    player.id === playerId ? { ...player, name } : player
  )));
}
</script>

<template>
  <section class="panel-section">
    <div class="section-title">
      <h2>Игра</h2>
      <div class="button-pair">
        <button
          class="icon-button"
          type="button"
          :title="showPlayerSettings ? 'Скрыть команды' : 'Показать команды'"
          @click="emit('update:showPlayerSettings', !showPlayerSettings)"
        >
          ☷
        </button>
        <button class="icon-button" type="button" title="Сбросить позиции" @click="emit('reset')">↺</button>
      </div>
    </div>

    <div v-if="showPlayerSettings" class="collapsible-panel">
      <label class="field">
        <span>Количество команд</span>
        <select :value="playerCount" :disabled="isAnimating" @change="emit('update:playerCount', Number($event.target.value))">
          <option v-for="count in 6" :key="count" :value="count">{{ count }}</option>
        </select>
      </label>

      <div class="player-list editable-players">
        <button
          v-for="player in players"
          :key="player.id"
          class="player-row"
          :class="{ selected: player.id === activePlayerId }"
          type="button"
          @click="emit('update:activePlayerId', player.id)"
        >
          <span class="player-dot" :style="{ background: player.color }"></span>
          <input
            :value="player.name"
            type="text"
            @click.stop
            @input="updatePlayerName(player.id, $event.target.value)"
          />
          <strong>{{ player.position + 1 }}</strong>
        </button>
      </div>
    </div>

    <div v-else class="active-player-line">
      <span>Ходит</span>
      <strong>{{ players.find((player) => player.id === activePlayerId)?.name || `Фишка цвета ${players.find((player) => player.id === activePlayerId)?.color || ''}` }}</strong>
    </div>

    <label class="toggle-line">
      <input
        :checked="useDice"
        type="checkbox"
        @change="emit('update:useDice', $event.target.checked)"
      />
      <span>Использовать кубик</span>
    </label>

    <div class="move-controls">
      <label class="field">
        <span>Ход</span>
        <input
          :value="stepInput"
          type="number"
          min="-12"
          max="12"
          :disabled="isAnimating || useDice"
          @input="emit('update:stepInput', Number($event.target.value))"
        />
      </label>
      <button class="primary-button" type="button" :disabled="isAnimating || useDice" @click="emit('move')">Поехать</button>
      <button class="secondary-button" type="button" :disabled="isAnimating || useDice" @click="emit('roll')">
        Ход без кубика
      </button>
    </div>

    <p class="hint-note">Фишку можно выбрать кликом или перетащить на нужную клетку поля.</p>
  </section>
</template>

<style scoped src="./GameControls.css"></style>

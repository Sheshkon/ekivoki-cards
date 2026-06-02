<script setup>
import { tokenColors } from '../lib/boardConfig';

const props = defineProps({
  activePlayerId: { type: Number, required: true },
  isAnimating: { type: Boolean, default: false },
  playerCount: { type: Number, required: true },
  players: { type: Array, required: true },
  useDice: { type: Boolean, default: false }
});

const emit = defineEmits([
  'update:activePlayerId',
  'update:playerCount',
  'update:players',
  'update:useDice'
]);

const maxPlayerCount = tokenColors.length;

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
    </div>

    <div class="collapsible-panel">
      <label class="field">
        <span>Количество игроков или команд</span>
        <select :value="playerCount" :disabled="isAnimating" @change="emit('update:playerCount', Number($event.target.value))">
          <option v-for="count in maxPlayerCount" :key="count" :value="count">{{ count }}</option>
        </select>
      </label>

      <h3 class="subsection-title">Имена игроков или команд</h3>
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

    <label class="toggle-line">
      <input
        :checked="useDice"
        type="checkbox"
        @change="emit('update:useDice', $event.target.checked)"
      />
      <span>Использовать кубик</span>
    </label>
  </section>
</template>

<style scoped src="./GameControls.css"></style>

<script setup>
import {ref, onUnmounted} from 'vue';
import bellSoundFile from '../assets/audio/bell.mp3'

const props = defineProps({
  initialDuration: {type: Number, default: 0},
  roundSecondsDuration: {type: Number, default: 60}
});
const emit = defineEmits(['time-up']);

const timeLeft = ref(props.initialDuration);
const interval = ref(null);
const bellAudio = new Audio(bellSoundFile);

const formattedTime = () => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${seconds}`;
  }
};

const start = () => {
  if (interval.value) return;
  timeLeft.value = props.initialDuration;
  interval.value = setInterval(() => {
    timeLeft.value++;

    if (timeLeft.value % props.roundSecondsDuration === 0) {
      const audio = timeLeft.value / props.roundSecondsDuration >= 2 ? bellAudio : bellAudio
      audio.play().catch(e => console.log('Audio error:', e));
      navigator.vibrate?.([200, 100, 200]);
      emit('time-up');
    }

  }, 1000);
};

const stop = () => {
  clearInterval(interval.value);
  interval.value = null;
};

defineExpose({start, stop, timeLeft, formattedTime});

onUnmounted(stop);
</script>

<template>
  <div
      v-show="interval"
      class="timer"
      :class="{ 'warning': timeLeft % props.roundSecondsDuration >= props.roundSecondsDuration * 0.83 }"
  >
    {{ formattedTime() }}
  </div>
</template>

<style scoped>
.timer {
  font-size: 3rem;
  font-weight: 800;
  color: var(--color-teal);
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.warning {
  color: var(--color-red);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>

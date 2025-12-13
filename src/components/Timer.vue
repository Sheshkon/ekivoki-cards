<script setup>
import {ref, onUnmounted} from 'vue';
import timeUpSoundFile from '../assets/minute-left.mp3'
import oneMoreTimeUpSoundFile from '../assets/one-more-minute-left.mp3'

const props = defineProps({
  duration: {type: Number, default: 0}
});
const emit = defineEmits(['time-up']);

const initialDuration = props.duration;
const timeLeft = ref(initialDuration);
const interval = ref(null);
const timeUpAudio = new Audio(timeUpSoundFile);
const oneMoreTimeUpAudio = new Audio(oneMoreTimeUpSoundFile);

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
  timeLeft.value = initialDuration;
  interval.value = setInterval(() => {
    timeLeft.value++;

    if (timeLeft.value % 60 === 0) {
      const audio = timeLeft.value / 60 >= 2 ? oneMoreTimeUpAudio : timeUpAudio
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
      :class="{ 'warning': timeLeft % 60 >= 50 }"
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

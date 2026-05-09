<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { clamp, getCategory } from '../lib/boardConfig';

const props = defineProps({
  activePlayerId: { type: Number, required: true },
  backgroundImage: { type: String, default: '' },
  boardHeight: { type: Number, required: true },
  boardWidth: { type: Number, required: true },
  dicePosition: { type: Object, required: true },
  diceRotation: { type: Object, required: true },
  diceValue: { type: Number, default: 1 },
  isAnimating: { type: Boolean, default: false },
  isDiceRolling: { type: Boolean, default: false },
  isEditing: { type: Boolean, default: false },
  players: { type: Array, required: true },
  route: { type: Array, required: true },
  selectedCellIndex: { type: Number, default: null },
  showDice: { type: Boolean, default: true }
});

const emit = defineEmits(['cell-click', 'dice-click', 'token-click', 'token-move', 'update:route']);

const boardScale = ref(1);
const boardFrame = ref(null);
let didDrag = false;
let didTokenDrag = false;
let routeDragFrame = 0;

const routePath = computed(() => props.route.map((cell) => `${cell.x},${cell.y}`).join(' '));
const diceFaces = computed(() => {
  const top = props.diceValue;
  const bottom = 7 - top;
  const pool = [1, 2, 3, 4, 5, 6].filter((value) => value !== top && value !== bottom);
  return {
    top,
    bottom,
    front: pool[0],
    right: pool[1],
    left: pool[2],
    back: pool[3]
  };
});
const backgroundStyle = computed(() => {
  if (!props.backgroundImage) return {};

  return {
    backgroundImage: `linear-gradient(rgba(255, 250, 240, 0.34), rgba(255, 250, 240, 0.34)), url("${props.backgroundImage}")`
  };
});

watch(() => props.isEditing, fitBoard);

function tokenOffset(playerIndex, totalPlayers) {
  const ring = totalPlayers <= 4 ? 18 : 23;
  const angle = (Math.PI * 2 * playerIndex) / totalPlayers - Math.PI / 2;
  return {
    x: Math.cos(angle) * ring,
    y: Math.sin(angle) * ring
  };
}

function tokenStyle(player, index) {
  const cell = props.route[player.position] ?? props.route[0];
  const offset = tokenOffset(index, props.players.length);

  return {
    transform: `translate(${cell.x + offset.x - 20}px, ${cell.y + offset.y - 22}px)`,
    '--token-color': player.color,
    zIndex: 120 + index
  };
}

function tokenDragStyle(player) {
  return {
    transform: `translate(${player.dragX - 20}px, ${player.dragY - 24}px)`,
    '--token-color': player.color,
    zIndex: 220
  };
}

function cellStyle(cell) {
  const sizes = {
    oval: [33, 22],
    rectangle: [10, 20]
  };
  const [width, height] = sizes[cell.shape] || [64, 64];

  return {
    transform: `translate(${cell.x - 32}px, ${cell.y - 32}px)`,
    '--cell-color': getCategory(cell.category).color,
    '--selection-width': `${width + 18}px`,
    '--selection-height': `${height + 18}px`
  };
}

function diceStyle() {
  return {
    transform: `translate(${props.dicePosition.x - 28}px, ${props.dicePosition.y - 28}px)`,
    '--dice-move-duration': `${props.diceRotation.duration || 280}ms`,
    zIndex: 115
  };
}

function diceCubeStyle() {
  return {
    transform: `rotateX(${props.diceRotation.x}deg) rotateY(${props.diceRotation.y}deg) rotateZ(${props.diceRotation.z}deg)`
  };
}

function startDrag(event, index) {
  if (!props.isEditing || event.button !== undefined && event.button !== 0) return;

  event.preventDefault();
  didDrag = false;
  const nextRoute = props.route.map((cell) => ({ ...cell }));
  const target = event.currentTarget;
  target.setPointerCapture?.(event.pointerId);
  let pendingPoint = null;

  const flushMove = () => {
    routeDragFrame = 0;
    if (!pendingPoint) return;
    nextRoute[index].x = pendingPoint.x;
    nextRoute[index].y = pendingPoint.y;
    emit('update:route', [...nextRoute]);
  };

  const move = (moveEvent) => {
    const rect = boardFrame.value.getBoundingClientRect();
    pendingPoint = {
      x: clamp((moveEvent.clientX - rect.left) / boardScale.value, 44, props.boardWidth - 44),
      y: clamp((moveEvent.clientY - rect.top) / boardScale.value, 44, props.boardHeight - 44)
    };
    didDrag = true;
    if (!routeDragFrame) {
      routeDragFrame = requestAnimationFrame(flushMove);
    }
  };

  const stop = () => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', stop);
    window.removeEventListener('pointercancel', stop);
    if (routeDragFrame) {
      cancelAnimationFrame(routeDragFrame);
      flushMove();
    }
  };

  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', stop);
  window.addEventListener('pointercancel', stop);
}

function nearestCellIndex(x, y) {
  return props.route.reduce((nearest, cell, index) => {
    const distance = Math.hypot(cell.x - x, cell.y - y);
    return distance < nearest.distance ? { index, distance } : nearest;
  }, { index: 0, distance: Infinity }).index;
}

function eventToBoardPoint(event) {
  const rect = boardFrame.value.getBoundingClientRect();
  return {
    x: clamp((event.clientX - rect.left) / boardScale.value, 0, props.boardWidth),
    y: clamp((event.clientY - rect.top) / boardScale.value, 0, props.boardHeight)
  };
}

function startTokenDrag(event, player) {
  if (props.isAnimating || props.isDiceRolling || event.button !== undefined && event.button !== 0) return;

  event.preventDefault();
  event.stopPropagation();
  didTokenDrag = false;
  const target = event.currentTarget;
  target.setPointerCapture?.(event.pointerId);
  const startPointer = eventToBoardPoint(event);
  const tokenRect = target.getBoundingClientRect();
  const boardRect = boardFrame.value.getBoundingClientRect();
  const tokenCenter = {
    x: (tokenRect.left + tokenRect.width / 2 - boardRect.left) / boardScale.value,
    y: (tokenRect.top + tokenRect.height / 2 - boardRect.top) / boardScale.value
  };
  const pointerOffset = {
    x: tokenCenter.x - startPointer.x,
    y: tokenCenter.y - startPointer.y
  };

  const move = (moveEvent) => {
    const point = eventToBoardPoint(moveEvent);
    const x = clamp(point.x + pointerOffset.x, 0, props.boardWidth);
    const y = clamp(point.y + pointerOffset.y, 0, props.boardHeight);
    didTokenDrag = true;
    emit('token-move', { playerId: player.id, x, y, position: nearestCellIndex(x, y), isDragging: true });
  };

  const stop = (stopEvent) => {
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', stop);
    window.removeEventListener('pointercancel', stop);

    if (didTokenDrag) {
      const point = eventToBoardPoint(stopEvent);
      const x = clamp(point.x + pointerOffset.x, 0, props.boardWidth);
      const y = clamp(point.y + pointerOffset.y, 0, props.boardHeight);
      emit('token-move', { playerId: player.id, position: nearestCellIndex(x, y), isDragging: false });
    }
  };

  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', stop);
  window.addEventListener('pointercancel', stop);
}

function clickToken(playerId) {
  if (didTokenDrag) {
    didTokenDrag = false;
    return;
  }
  emit('token-click', playerId);
}

function clickCell(index) {
  if (!props.isEditing) return;
  if (didDrag) {
    didDrag = false;
    return;
  }
  emit('cell-click', index);
}

function fitBoard() {
  nextTick(() => {
    if (!boardFrame.value) return;
    const rect = boardFrame.value.parentElement.getBoundingClientRect();
    boardScale.value = Math.max(rect.width / props.boardWidth, rect.height / props.boardHeight);
  });
}

onMounted(() => {
  fitBoard();
  window.addEventListener('resize', fitBoard);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', fitBoard);
});
</script>

<template>
  <div class="board-viewport" :class="{ editable: isEditing }">
    <div
      ref="boardFrame"
      class="board-frame"
      :style="{
        width: `${boardWidth}px`,
        height: `${boardHeight}px`,
        transform: `scale(${boardScale})`,
        ...backgroundStyle
      }"
    >
      <svg class="route-lines" :viewBox="`0 0 ${boardWidth} ${boardHeight}`" aria-hidden="true">
        <polyline :points="routePath" />
      </svg>

      <button
        v-for="(cell, index) in route"
        :key="cell.id"
        class="cell"
        :class="[
          {
            endpoint: index === 0 || index === route.length - 1,
            draggable: isEditing,
            selected: selectedCellIndex === index
          }
        ]"
        :style="cellStyle(cell)"
        :title="`${index + 1}. ${getCategory(cell.category).label}`"
        @click="clickCell(index)"
        @pointerdown="startDrag($event, index)"
      >
        <span class="cell-body" :class="`shape-${cell.shape || 'circle'}`">
          <span class="cell-label">{{ getCategory(cell.category).short }}</span>
          <small>{{ index + 1 }}</small>
        </span>
      </button>

      <button
        v-for="(player, index) in players"
        :key="player.id"
        class="token"
        :class="{ active: player.id === activePlayerId, 'dragging-origin': player.dragging, moving: player.moving }"
        :style="tokenStyle(player, index)"
        :title="`${player.name}: клетка ${player.position + 1}`"
        type="button"
        @click="clickToken(player.id)"
        @pointerdown="startTokenDrag($event, player)"
      >
        <span>{{ player.id }}</span>
      </button>

      <div
        v-for="player in players.filter((item) => item.dragging)"
        :key="`ghost-${player.id}`"
        class="token token-ghost"
        :style="tokenDragStyle(player)"
        aria-hidden="true"
      >
        <span>{{ player.id }}</span>
      </div>

      <button
        v-if="showDice"
        class="board-dice"
        :class="{ rolling: isDiceRolling }"
        :style="diceStyle()"
        type="button"
        @click="emit('dice-click')"
        aria-label="Кубик"
      >
        <div class="dice-cube" :style="diceCubeStyle()">
          <span class="dice-face dice-front" :data-value="diceFaces.front"></span>
          <span class="dice-face dice-back" :data-value="diceFaces.back"></span>
          <span class="dice-face dice-top" :data-value="diceFaces.top"></span>
          <span class="dice-face dice-bottom" :data-value="diceFaces.bottom"></span>
          <span class="dice-face dice-right" :data-value="diceFaces.right"></span>
          <span class="dice-face dice-left" :data-value="diceFaces.left"></span>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped src="./BoardCanvas.css"></style>

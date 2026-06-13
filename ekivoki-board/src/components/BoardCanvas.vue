<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { BOARD_DIMENSIONS, CELL_CLAMP_PADDING, clamp, getBoardCssVars, resolveCategoryStyle } from '../lib/boardConfig';
import pawnIcon from '../cone-3.svg';
import BoardCell from './board/BoardCell.vue';
import BoardDice from './board/BoardDice.vue';
import BoardToken from './board/BoardToken.vue';

const props = defineProps({
  activePlayerId: { type: Number, required: true },
  backgroundImage: { type: String, default: '' },
  boardHeight: { type: Number, required: true },
  boardStyle: { type: Object, required: true },
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

const viewportSize = ref({ width: 0, height: 0 });
const boardViewport = ref(null);
const boardFrame = ref(null);
let didDrag = false;
let didTokenDrag = false;
let routeDragFrame = 0;
let viewportResizeObserver;

const scaleX = computed(() => viewportSize.value.width > 0 ? viewportSize.value.width / props.boardWidth : 1);
const scaleY = computed(() => viewportSize.value.height > 0 ? viewportSize.value.height / props.boardHeight : 1);
const uiScale = computed(() => Math.min(scaleX.value, scaleY.value));
const routePath = computed(() => props.route.map((cell) => `${toViewportX(cell.x)},${toViewportY(cell.y)}`).join(' '));
const boardCssVars = computed(() => {
  const vars = getBoardCssVars(props.boardStyle);
  const scale = uiScale.value;
  const style = props.boardStyle;
  return {
    ...vars,
    '--cell-size': `${style.cellSize * scale}px`,
    '--cell-oval-width': `${style.ovalCellWidth * scale}px`,
    '--cell-rectangle-width': `${BOARD_DIMENSIONS.rectangleCellWidth * scale}px`,
    '--token-width': `${style.tokenWidth * scale}px`,
    '--token-height': `${style.tokenHeight * scale}px`,
    '--dice-size': `${BOARD_DIMENSIONS.diceSize * scale}px`,
    '--route-stroke-width': `${style.routeStrokeWidth * scale}px`,
    '--route-color': style.routeColor,
    '--route-opacity': style.routeOpacity
  };
});
const backgroundStyle = computed(() => {
  if (!props.backgroundImage) return {};

  return {
    backgroundImage: `linear-gradient(rgba(255, 250, 240, 0.14), rgba(255, 250, 240, 0.14)), url("${props.backgroundImage}")`
  };
});

watch(() => props.isEditing, fitBoard);
watch(() => [props.boardWidth, props.boardHeight], fitBoard);

function tokenOffset(playerIndex, totalPlayers) {
  const style = props.boardStyle;
  const baseRing = totalPlayers <= 4 ? BOARD_DIMENSIONS.tokenRingSmall : BOARD_DIMENSIONS.tokenRingLarge;
  const ring = Math.max(baseRing, BOARD_DIMENSIONS.tokenRingLarge) * 1.15;
  const angle = (Math.PI * 2 * playerIndex) / totalPlayers - Math.PI / 2;
  return {
    x: Math.cos(angle) * ring,
    y: Math.sin(angle) * ring
  };
}

function tokenStyle(player, index) {
  const cell = props.route[player.position] ?? props.route[0];
  const offset = tokenOffset(index, props.players.length);
  const style = props.boardStyle;
  const tokenHalfWidth = style.tokenWidth / 2;
  const tokenHalfHeight = style.tokenHeight / 2;
  const left = cell.x + offset.x - tokenHalfWidth;
  const top = cell.y + offset.y - tokenHalfHeight;

  return createTokenStyle(left, top, 120 + index, player.color);
}

function tokenDragStyle(player) {
  const style = props.boardStyle;
  const tokenHalfWidth = style.tokenWidth / 2;
  const tokenHalfHeight = style.tokenHeight / 2;
  const left = player.dragX - tokenHalfWidth;
  const top = player.dragY - tokenHalfHeight;
  return createTokenStyle(left, top, 220, player.color);
}

function createTokenStyle(left, top, zIndex, color) {
  return {
    transform: `translate(${toViewportX(left)}px, ${toViewportY(top)}px)`,
    '--pawn-icon-url': `url("${pawnIcon}")`,
    '--token-color': color,
    zIndex
  };
}

function playerTitle(player) {
  return `${player.name} · цвет ${player.color} · клетка ${player.position + 1}`;
}

function cellStyle(cell) {
  const style = props.boardStyle;
  const shape = resolveCategoryStyle(cell.category, style).shape;
  const sizes = {
    oval: [style.ovalCellWidth, style.cellSize],
    rectangle: [BOARD_DIMENSIONS.rectangleCellWidth, style.cellSize]
  };
  const [width, height] = sizes[shape] || [style.cellSize, style.cellSize];
  const left = cell.x - width / 2;
  const top = cell.y - height / 2;
  const selectionWidth = (width + BOARD_DIMENSIONS.selectionExtraSize) * uiScale.value;
  const selectionHeight = (height + BOARD_DIMENSIONS.selectionExtraSize) * uiScale.value;

  return {
    transform: `translate(${toViewportX(left)}px, ${toViewportY(top)}px)`,
    '--selection-width': `${selectionWidth}px`,
    '--selection-height': `${selectionHeight}px`
  };
}

function diceStyle() {
  const diceHalfSize = BOARD_DIMENSIONS.diceSize / 2;
  const left = props.dicePosition.x - diceHalfSize;
  const top = props.dicePosition.y - diceHalfSize;
  return {
    transform: `translate(${toViewportX(left)}px, ${toViewportY(top)}px)`,
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
  const target = event.currentTarget;
  target.setPointerCapture?.(event.pointerId);
  let pendingPoint = null;

  const flushMove = () => {
    routeDragFrame = 0;
    if (!pendingPoint) return;
    emit('update:route', props.route.map((cell, cellIndex) => (
      cellIndex === index
        ? { ...cell, x: pendingPoint.x, y: pendingPoint.y }
        : cell
    )));
  };

  const move = (moveEvent) => {
    const rect = boardFrame.value.getBoundingClientRect();
    pendingPoint = {
      x: clamp(fromViewportX(moveEvent.clientX - rect.left), CELL_CLAMP_PADDING, props.boardWidth - CELL_CLAMP_PADDING),
      y: clamp(fromViewportY(moveEvent.clientY - rect.top), CELL_CLAMP_PADDING, props.boardHeight - CELL_CLAMP_PADDING)
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
    x: clamp(fromViewportX(event.clientX - rect.left), 0, props.boardWidth),
    y: clamp(fromViewportY(event.clientY - rect.top), 0, props.boardHeight)
  };
}

function startTokenDrag(event, player) {
  if (props.isEditing || player.moving || props.isDiceRolling || event.button !== undefined && event.button !== 0) return;

  event.preventDefault();
  event.stopPropagation();
  didTokenDrag = false;
  const target = event.currentTarget;
  target.setPointerCapture?.(event.pointerId);
  const startPointer = eventToBoardPoint(event);
  const tokenRect = target.getBoundingClientRect();
  const boardRect = boardFrame.value.getBoundingClientRect();
  const tokenCenter = {
    x: fromViewportX(tokenRect.left + tokenRect.width / 2 - boardRect.left),
    y: fromViewportY(tokenRect.top + tokenRect.height / 2 - boardRect.top)
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
  if (didDrag) {
    didDrag = false;
    return;
  }
  emit('cell-click', index);
}

function fitBoard() {
  nextTick(() => {
    if (!boardViewport.value) return;
    const rect = boardViewport.value.getBoundingClientRect();
    viewportSize.value = {
      width: rect.width > 0 ? rect.width : props.boardWidth,
      height: rect.height > 0 ? rect.height : props.boardHeight
    };
  });
}

function toViewportX(value) {
  return Number(value) * scaleX.value;
}

function toViewportY(value) {
  return Number(value) * scaleY.value;
}

function fromViewportX(value) {
  const ratio = scaleX.value || 1;
  return Number(value) / ratio;
}

function fromViewportY(value) {
  const ratio = scaleY.value || 1;
  return Number(value) / ratio;
}

async function toggleFullscreen() {
  if (!boardViewport.value) return false;
  if (document.fullscreenElement === boardViewport.value) {
    await document.exitFullscreen();
    return false;
  }
  await boardViewport.value.requestFullscreen();
  return true;
}

defineExpose({
  toggleFullscreen
});

onMounted(() => {
  fitBoard();
  window.addEventListener('resize', fitBoard);
  if (window.ResizeObserver) {
    viewportResizeObserver = new ResizeObserver(() => fitBoard());
    viewportResizeObserver.observe(boardViewport.value);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', fitBoard);
  viewportResizeObserver?.disconnect();
});
</script>

<template>
  <div ref="boardViewport" class="board-viewport" :class="{ editable: isEditing }" :style="boardCssVars">
    <div ref="boardFrame" class="board-frame" :style="backgroundStyle">
      <svg class="route-lines" :viewBox="`0 0 ${viewportSize.width || 1} ${viewportSize.height || 1}`" aria-hidden="true">
        <polyline :points="routePath" />
      </svg>

      <BoardCell
        v-for="(cell, index) in route"
        :key="cell.id"
        :board-style="boardStyle"
        :cell="cell"
        :index="index"
        :is-draggable="isEditing"
        :is-endpoint="index === 0 || index === route.length - 1"
        :is-selected="selectedCellIndex === index"
        :style-builder="cellStyle"
        @click="clickCell(index)"
        @pointerdown="startDrag($event, index)"
      />

      <BoardToken
        v-for="(player, index) in players"
        :key="player.id"
        :is-active="player.id === activePlayerId"
        :player="player"
        :style-builder="() => tokenStyle(player, index)"
        :title="playerTitle(player)"
        @click="clickToken(player.id)"
        @pointerdown="startTokenDrag($event, player)"
      />

      <BoardToken
        v-for="player in players.filter((item) => item.dragging)"
        :key="`ghost-${player.id}`"
        is-ghost
        :player="player"
        :style-builder="tokenDragStyle"
      />

      <BoardDice
        v-if="showDice"
        :cube-style="diceCubeStyle()"
        :dice-value="diceValue"
        :is-rolling="isDiceRolling"
        :position-style="diceStyle()"
        @click="emit('dice-click')"
      />
    </div>
  </div>
</template>

<style src="./BoardCanvas.css"></style>

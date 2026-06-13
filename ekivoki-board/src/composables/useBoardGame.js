import { computed, ref, watch } from 'vue';
import defaultBoardImage from '../bg2.png';
import { useDiceThrow, randomDiceValue } from './useDiceThrow';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  DEFAULT_BOARD_NAME,
  DEFAULT_PLAYER_COUNT,
  DEFAULT_PRESET_ID,
  DICE_THROW,
  MOVE_TIMING,
  clamp,
  createDefaultBoardRoute,
  createDefaultBoardStyle,
  createDefaultRules,
  createPlayers,
  createRoute,
  routePresets,
  syncRouteWithCategoryStyles,
  wait, createDefaultTokenColors
} from '../lib/boardConfig';

export function useBoardGame() {
  const selectedPreset = ref(DEFAULT_PRESET_ID);
  const boardName = ref(DEFAULT_BOARD_NAME);
  const backgroundImage = ref(defaultBoardImage);
  const defaultTokenColors = createDefaultTokenColors();
  const boardStyle = ref(createDefaultBoardStyle());
  const route = ref(syncRouteWithCategoryStyles(createDefaultBoardRoute(), boardStyle.value));
  const rules = ref(createDefaultRules());

  const playerCount = ref(DEFAULT_PLAYER_COUNT);
  const players = ref(createPlayers(playerCount.value, [], boardStyle.value.tokenColors));
  const activePlayerId = ref(1);
  const stepInput = ref(1);
  const isAnimating = ref(false);
  const useDice = ref(false);
  const diceValue = ref(1);
  const isDiceRolling = ref(false);
  const dicePosition = ref({ x: BOARD_WIDTH / 2, y: BOARD_HEIGHT / 2 });
  const diceRotation = ref({ ...DICE_THROW.initialRotation });

  const isEditing = ref(false);
  const isPanelHidden = ref(false);
  const selectedCellIndex = ref(null);
  const activeTab = ref('game');

  const activePlayer = computed(() => players.value.find((player) => player.id === activePlayerId.value));
  const finishIndex = computed(() => Math.max(route.value.length - 1, 0));
  const completedPlayers = computed(() => players.value.filter((player) => player.position >= finishIndex.value).length);
  const stats = computed(() => ({
    cells: route.value.length,
    players: players.value.length
  }));
  const playerProgress = computed(() => players.value.map((player) => ({
    id: player.id,
    name: player.name,
    color: player.color,
    progress: Math.round((player.position / Math.max(finishIndex.value, 1)) * 100)
  })));
  const { animateDiceThrow } = useDiceThrow({
    activePlayer,
    dicePosition,
    diceRotation,
    diceValue,
    finishIndex,
    route
  });

  watch(playerCount, (count) => {
    players.value = createPlayers(Number(count), players.value, boardStyle.value.tokenColors);
    activePlayerId.value = Math.min(activePlayerId.value, Number(count));
  });

  watch(selectedPreset, (preset) => {
    const nextPreset = routePresets[preset] ?? routePresets[DEFAULT_PRESET_ID];
    route.value = createRoute(nextPreset.points);
    boardName.value = nextPreset.name;
    selectedCellIndex.value = null;
    resetGame();
  });

  watch(() => route.value.length, () => {
    players.value = players.value.map((player) => ({
      ...player,
      position: Math.min(player.position, finishIndex.value)
    }));

    if (selectedCellIndex.value !== null && selectedCellIndex.value >= route.value.length) {
      selectedCellIndex.value = null;
    }
  });

  function updateRoute(nextRoute) {
    route.value = nextRoute;
  }

  function updateBoardStyle(nextStyle) {
    boardStyle.value = nextStyle;
  }

  function updatePlayers(nextPlayers) {
    players.value = nextPlayers;
  }

  function selectToken(playerId) {
    activePlayerId.value = playerId;
  }

  async function selectCell(index) {
    if (isEditing.value || activeTab.value === 'editor') {
      selectedCellIndex.value = index;
      activeTab.value = 'editor';
      return;
    }

    if (isAnimating.value || isDiceRolling.value) return;
    await animatePlayerToPosition(activePlayerId.value, clamp(index, 0, finishIndex.value));
  }

  function isPlayerMoving(playerId) {
    return players.value.some((player) => player.id === playerId && player.moving);
  }

  async function moveToken({ playerId, position, x, y, isDragging }) {
    if (isDiceRolling.value || isPlayerMoving(playerId)) return;

    activePlayerId.value = playerId;
    const targetPosition = clamp(position ?? 0, 0, finishIndex.value);

    if (isDragging) {
      updateDraggedPlayer(playerId, x, y, targetPosition);
      return;
    }

    clearDraggedPlayer(playerId);
    await animatePlayerToPosition(playerId, targetPosition);
  }

  async function moveActivePlayer(steps = Number(stepInput.value)) {
    if (isAnimating.value || !activePlayer.value || steps === 0) return;

    const player = activePlayer.value;
    const direction = steps > 0 ? 1 : -1;
    const ticks = Math.abs(steps);

    isAnimating.value = true;
    player.moving = true;

    for (let tick = 0; tick < ticks; tick += 1) {
      player.position = clamp(player.position + direction, 0, finishIndex.value);
      await wait(MOVE_TIMING.activePlayerStepMs);
      if (player.position === 0 || player.position === finishIndex.value) break;
    }

    player.moving = false;
    isAnimating.value = false;
    selectNextPlayer();
  }

  async function animatePlayerToPosition(playerId, targetPosition) {
    const player = players.value.find((item) => item.id === playerId);
    if (!player || player.position === targetPosition || player.moving) return;

    const direction = targetPosition > player.position ? 1 : -1;
    isAnimating.value = true;
    player.moving = true;

    while (player.position !== targetPosition) {
      player.position = clamp(player.position + direction, 0, finishIndex.value);
      await wait(MOVE_TIMING.tokenDragStepMs);
    }

    player.moving = false;
    isAnimating.value = false;
  }

  async function rollDice() {
    if (isAnimating.value || isDiceRolling.value) return;

    if (!useDice.value) {
      await moveActivePlayer(Number(stepInput.value));
      return;
    }

    isDiceRolling.value = true;
    const activeCell = route.value[activePlayer.value?.position ?? 0] ?? route.value[0];
    const finalValue = randomDiceValue();
    await animateDiceThrow(activeCell, finalValue);

    diceValue.value = finalValue;
    stepInput.value = finalValue;
    isDiceRolling.value = false;
    await moveActivePlayer(finalValue);
  }

  function updateDraggedPlayer(playerId, x, y, targetPosition) {
    players.value = players.value.map((player) => (
      player.id === playerId
        ? {
            ...player,
            dragging: true,
            dragX: x ?? player.dragX,
            dragY: y ?? player.dragY,
            dragTargetPosition: targetPosition
          }
        : player
    ));
  }

  function clearDraggedPlayer(playerId) {
    players.value = players.value.map((player) => (
      player.id === playerId
        ? { ...player, dragging: false, dragX: null, dragY: null, dragTargetPosition: null }
        : player
    ));
  }

  function selectNextPlayer() {
    const currentIndex = players.value.findIndex((player) => player.id === activePlayerId.value);
    const nextIndex = (currentIndex + 1) % players.value.length;
    activePlayerId.value = players.value[nextIndex].id;
  }

  function resetGame(tokenPalette = boardStyle.value.tokenColors) {
    players.value = players.value.map((player, index) => ({
      ...player,
      color: tokenPalette?.[index] ?? player.color,
      position: 0,
      moving: false
    }));
    activePlayerId.value = 1;
    const start = route.value[0];
    if (start) dicePosition.value = { x: start.x, y: Math.max(start.y - 76, 50) };
  }

  return {
    selectedPreset,
    boardName,
    backgroundImage,
    boardStyle,
    route,
    rules,
    playerCount,
    players,
    activePlayerId,
    stepInput,
    isAnimating,
    useDice,
    diceValue,
    isDiceRolling,
    dicePosition,
    diceRotation,
    isEditing,
    isPanelHidden,
    selectedCellIndex,
    activeTab,
    completedPlayers,
    stats,
    playerProgress,
    updateRoute,
    updateBoardStyle,
    updatePlayers,
    selectToken,
    selectCell,
    moveToken,
    moveActivePlayer,
    rollDice,
    resetGame
  };
}

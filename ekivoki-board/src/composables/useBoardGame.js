import { computed, ref, watch } from 'vue';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  clamp,
  createDefaultRules,
  createPlayers,
  createRoute,
  routePresets
} from '../lib/boardConfig';

export function useBoardGame() {
  const selectedPreset = ref('classic');
  const boardName = ref('Мой борд');
  const backgroundImage = ref('');
  const route = ref(createRoute(routePresets.classic.points));
  const rules = ref(createDefaultRules());

  const playerCount = ref(4);
  const players = ref(createPlayers(playerCount.value));
  const activePlayerId = ref(1);
  const stepInput = ref(1);
  const isAnimating = ref(false);
  const useDice = ref(true);
  const diceValue = ref(1);
  const isDiceRolling = ref(false);
  const dicePosition = ref({ x: BOARD_WIDTH / 2, y: BOARD_HEIGHT / 2 });
  const diceRotation = ref({ x: -22, y: 32, z: -3, duration: 280 });

  const isEditing = ref(false);
  const isPanelHidden = ref(false);
  const showPlayerSettings = ref(false);
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

  watch(playerCount, (count) => {
    players.value = createPlayers(Number(count), players.value);
    activePlayerId.value = Math.min(activePlayerId.value, Number(count));
  });

  watch(selectedPreset, (preset) => {
    route.value = createRoute(routePresets[preset].points);
    boardName.value = routePresets[preset].name;
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

  function updatePlayers(nextPlayers) {
    players.value = nextPlayers;
  }

  function selectToken(playerId) {
    activePlayerId.value = playerId;
  }

  function selectCell(index) {
    if (!isEditing.value) return;
    selectedCellIndex.value = index;
    activeTab.value = 'editor';
  }

  async function moveToken({ playerId, position, x, y, isDragging }) {
    if (isAnimating.value || isDiceRolling.value) return;

    activePlayerId.value = playerId;
    const targetPosition = clamp(position ?? 0, 0, finishIndex.value);

    if (isDragging) {
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
      return;
    }

    players.value = players.value.map((player) => (
      player.id === playerId
        ? { ...player, dragging: false, dragX: null, dragY: null, dragTargetPosition: null }
        : player
    ));

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
      await wait(260);
      if (player.position === 0 || player.position === finishIndex.value) break;
    }

    player.moving = false;
    isAnimating.value = false;
    selectNextPlayer();
  }

  async function animatePlayerToPosition(playerId, targetPosition) {
    const player = players.value.find((item) => item.id === playerId);
    if (!player || player.position === targetPosition) return;

    const direction = targetPosition > player.position ? 1 : -1;
    isAnimating.value = true;
    player.moving = true;

    while (player.position !== targetPosition) {
      player.position = clamp(player.position + direction, 0, finishIndex.value);
      await wait(180);
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
    const finalValue = Math.floor(Math.random() * 6) + 1;
    await animateDiceThrow(activeCell, finalValue);

    diceValue.value = finalValue;
    stepInput.value = finalValue;
    isDiceRolling.value = false;
    await moveActivePlayer(finalValue);
  }

  function randomDicePointNear(cell) {
    return {
      x: clamp(cell.x + randomInt(-120, 120), 46, BOARD_WIDTH - 46),
      y: clamp(cell.y + randomInt(-140, 80), 46, BOARD_HEIGHT - 46)
    };
  }

  function diceCurvePoint(points, progress) {
    const inverse = 1 - progress;
    return {
      x: inverse ** 3 * points[0].x + 3 * inverse ** 2 * progress * points[1].x + 3 * inverse * progress ** 2 * points[2].x + progress ** 3 * points[3].x,
      y: inverse ** 3 * points[0].y + 3 * inverse ** 2 * progress * points[1].y + 3 * inverse * progress ** 2 * points[2].y + progress ** 3 * points[3].y
    };
  }

  function easeInOut(progress) {
    return progress < 0.5 ? 4 * progress ** 3 : 1 - ((-2 * progress + 2) ** 3) / 2;
  }

  async function animateDiceThrow(activeCell, finalValue) {
    const routeIndex = clamp((activePlayer.value?.position ?? 0) + randomInt(2, 10), 0, finishIndex.value);
    const landingCell = route.value[routeIndex] ?? activeCell;
    const start = dicePosition.value.x ? dicePosition.value : randomDicePointNear(activeCell);
    const end = randomDicePointNear(landingCell);
    const curve = [
      start,
      { x: clamp(start.x + randomInt(120, 360), 46, BOARD_WIDTH - 46), y: clamp(start.y + randomInt(-180, 120), 46, BOARD_HEIGHT - 46) },
      { x: clamp(end.x + randomInt(-360, 180), 46, BOARD_WIDTH - 46), y: clamp(end.y + randomInt(-180, 160), 46, BOARD_HEIGHT - 46) },
      end
    ];
    const startRotation = { ...diceRotation.value };
    const endRotation = {
      x: -22 + 360 * randomInt(3, 6),
      y: 32 + 360 * randomInt(3, 6),
      z: -3 + 360 * randomInt(1, 3),
      duration: 0
    };
    const duration = randomInt(1350, 2300);
    const bounceCount = randomInt(2, 4);
    const bounceHeight = randomInt(24, 52);
    let lastFaceChange = 0;
    const startedAt = performance.now();

    await new Promise((resolve) => {
      function frame(now) {
        const rawProgress = clamp((now - startedAt) / duration, 0, 1);
        const progress = easeInOut(rawProgress);
        const point = diceCurvePoint(curve, progress);
        const bounce = Math.abs(Math.sin(rawProgress * Math.PI * bounceCount)) * bounceHeight * (1 - rawProgress * 0.72);

        dicePosition.value = {
          x: point.x,
          y: clamp(point.y - bounce, 46, BOARD_HEIGHT - 46)
        };
        diceRotation.value = {
          x: startRotation.x + (endRotation.x - startRotation.x) * progress,
          y: startRotation.y + (endRotation.y - startRotation.y) * progress,
          z: startRotation.z + (endRotation.z - startRotation.z) * progress,
          duration: 0
        };

        if (now - lastFaceChange > 150 && rawProgress < 0.82) {
          diceValue.value = Math.floor(Math.random() * 6) + 1;
          lastFaceChange = now;
        }

        if (rawProgress < 1) {
          requestAnimationFrame(frame);
          return;
        }

        diceValue.value = finalValue;
        dicePosition.value = end;
        diceRotation.value = endRotation;
        resolve();
      }

      requestAnimationFrame(frame);
    });
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function selectNextPlayer() {
    const currentIndex = players.value.findIndex((player) => player.id === activePlayerId.value);
    const nextIndex = (currentIndex + 1) % players.value.length;
    activePlayerId.value = players.value[nextIndex].id;
  }

  function resetGame() {
    players.value = players.value.map((player) => ({ ...player, position: 0, moving: false }));
    activePlayerId.value = 1;
    const start = route.value[0];
    if (start) dicePosition.value = { x: start.x, y: Math.max(start.y - 76, 50) };
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return {
    selectedPreset,
    boardName,
    backgroundImage,
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
    showPlayerSettings,
    selectedCellIndex,
    activeTab,
    completedPlayers,
    stats,
    playerProgress,
    updateRoute,
    updatePlayers,
    selectToken,
    selectCell,
    moveToken,
    moveActivePlayer,
    rollDice,
    resetGame
  };
}

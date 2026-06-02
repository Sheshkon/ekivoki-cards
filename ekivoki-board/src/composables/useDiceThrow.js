import { DICE_CLAMP_PADDING, DICE_THROW, BOARD_HEIGHT, BOARD_WIDTH } from '../lib/boardConstants';
import { clamp, randomInt } from '../lib/boardMath';

export function useDiceThrow({
  activePlayer,
  dicePosition,
  diceRotation,
  diceValue,
  finishIndex,
  route
}) {
  async function animateDiceThrow(activeCell, finalValue) {
    const routeIndex = clamp(
      (activePlayer.value?.position ?? 0) + randomInt(DICE_THROW.landingRouteOffsetMin, DICE_THROW.landingRouteOffsetMax),
      0,
      finishIndex.value
    );
    const landingCell = route.value[routeIndex] ?? activeCell;
    const start = dicePosition.value.x ? dicePosition.value : randomDicePointNear(activeCell);
    const end = randomDicePointNear(landingCell);
    const curve = createDiceCurve(start, end);
    const startRotation = { ...diceRotation.value };
    const endRotation = createEndRotation();
    const duration = randomInt(DICE_THROW.minDurationMs, DICE_THROW.maxDurationMs);
    const bounceCount = randomInt(DICE_THROW.minBounceCount, DICE_THROW.maxBounceCount);
    const bounceHeight = randomInt(DICE_THROW.minBounceHeight, DICE_THROW.maxBounceHeight);
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
          y: clamp(point.y - bounce, DICE_CLAMP_PADDING, BOARD_HEIGHT - DICE_CLAMP_PADDING)
        };
        diceRotation.value = interpolateRotation(startRotation, endRotation, progress);

        if (now - lastFaceChange > DICE_THROW.faceChangeMs && rawProgress < DICE_THROW.faceChangeStopProgress) {
          diceValue.value = randomDiceValue();
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

  function randomDicePointNear(cell) {
    return {
      x: clamp(cell.x + randomInt(...DICE_THROW.nearCellX), DICE_CLAMP_PADDING, BOARD_WIDTH - DICE_CLAMP_PADDING),
      y: clamp(cell.y + randomInt(...DICE_THROW.nearCellY), DICE_CLAMP_PADDING, BOARD_HEIGHT - DICE_CLAMP_PADDING)
    };
  }

  function createDiceCurve(start, end) {
    return [
      start,
      {
        x: clamp(start.x + randomInt(...DICE_THROW.controlPointOneX), DICE_CLAMP_PADDING, BOARD_WIDTH - DICE_CLAMP_PADDING),
        y: clamp(start.y + randomInt(...DICE_THROW.controlPointOneY), DICE_CLAMP_PADDING, BOARD_HEIGHT - DICE_CLAMP_PADDING)
      },
      {
        x: clamp(end.x + randomInt(...DICE_THROW.controlPointTwoX), DICE_CLAMP_PADDING, BOARD_WIDTH - DICE_CLAMP_PADDING),
        y: clamp(end.y + randomInt(...DICE_THROW.controlPointTwoY), DICE_CLAMP_PADDING, BOARD_HEIGHT - DICE_CLAMP_PADDING)
      },
      end
    ];
  }

  function createEndRotation() {
    return {
      x: DICE_THROW.initialRotation.x + 360 * randomInt(...DICE_THROW.rotationXTurns),
      y: DICE_THROW.initialRotation.y + 360 * randomInt(...DICE_THROW.rotationYTurns),
      z: DICE_THROW.initialRotation.z + 360 * randomInt(...DICE_THROW.rotationZTurns),
      duration: 0
    };
  }

  return {
    animateDiceThrow
  };
}

export function randomDiceValue() {
  return Math.floor(Math.random() * 6) + 1;
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

function interpolateRotation(startRotation, endRotation, progress) {
  return {
    x: startRotation.x + (endRotation.x - startRotation.x) * progress,
    y: startRotation.y + (endRotation.y - startRotation.y) * progress,
    z: startRotation.z + (endRotation.z - startRotation.z) * progress,
    duration: 0
  };
}

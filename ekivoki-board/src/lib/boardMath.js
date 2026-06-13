import { BOARD_DIMENSIONS } from './boardConstants';

export function clamp(value, min, max) {
  return Math.min(Math.max(Number(value), min), max);
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getBoardCssVars(boardStyle) {
  const style = boardStyle ?? {};
  return {
    '--viewport-min-height': `${BOARD_DIMENSIONS.viewportMinHeight}px`,
    '--cell-size': `${style.cellSize ?? BOARD_DIMENSIONS.cellSize}px`,
    '--cell-oval-width': `${style.ovalCellWidth ?? BOARD_DIMENSIONS.ovalCellWidth}px`,
    '--cell-rectangle-width': `${BOARD_DIMENSIONS.rectangleCellWidth}px`,
    '--token-width': `${style.tokenWidth ?? BOARD_DIMENSIONS.tokenWidth}px`,
    '--token-height': `${style.tokenHeight ?? BOARD_DIMENSIONS.tokenHeight}px`,
    '--dice-size': `${BOARD_DIMENSIONS.diceSize}px`,
    '--route-stroke-width': `${style.routeStrokeWidth ?? BOARD_DIMENSIONS.routeStrokeWidth}px`,
    '--route-color': style.routeColor ?? '#263142',
    '--route-opacity': style.routeOpacity ?? 0.22,
    '--board-width': `${BOARD_DIMENSIONS.width}px`,
    '--board-height': `${BOARD_DIMENSIONS.height}px`
  };
}

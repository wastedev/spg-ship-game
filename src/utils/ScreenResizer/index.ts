import { Game } from 'phaser';
import { debounce, DebouncedFunc } from 'lodash';

export const debouncedResize: DebouncedFunc<() => void> = debounce(() => {
  if (window.game.isBooted) {
    window.game.scale.resize(window.innerWidth, window.innerHeight);
    window.game.canvas.setAttribute(
      'style',
      `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`,
    );
  }
}, 100);

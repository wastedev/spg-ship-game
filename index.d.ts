import { DebouncedFunc } from 'lodash';
import { Game } from 'phaser';

declare global {
  interface Window {
    sizeChanged: DebouncedFunc<() => void>;
    game: Game;
  }
}

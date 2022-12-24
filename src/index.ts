import { Game, Types } from 'phaser';
import { PreloadScene, TopScene, UiScene, SideScene } from './scenes';
import { debouncedResize } from './utils';

const gameConfig: Types.Core.GameConfig = {
  title: 'Игра - загрузка СПГ',
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#308CBA',
  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
    mode: Phaser.Scale.ScaleModes.ENVELOP,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'matter',
    matter: {
      setBounds: true,
      gravity: { y: 0 },
      debug: true,
    },
  },
  callbacks: {
    postBoot: () => {
      window.sizeChanged();
    },
  },
  canvasStyle: `display: block; width: 100%; height: 100%;`,
  autoFocus: true,
  scene: [PreloadScene, UiScene, TopScene, SideScene],
};

window.sizeChanged = debouncedResize;
window.onresize = () => window.sizeChanged();

if (window) {
  window.game = new Game(gameConfig);
}

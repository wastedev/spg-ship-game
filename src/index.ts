import { Game, Types } from 'phaser';
import { PreloadScene, TopScene, UiScene, SideScene } from './scenes';
import { BannerScene } from './scenes/BannerScene';
import { debouncedResize } from './utils';

const gameConfig: Types.Core.GameConfig = {
  title: 'Игра - загрузка СПГ',
  type: Phaser.CANVAS,
  parent: 'game',
  backgroundColor: '#308CBA',
  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
    mode: Phaser.Scale.ScaleModes.ENVELOP,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  fps: {
    min: 58,
    target: 60,
    panicMax: 64,
    smoothStep: true,
    forceSetTimeOut: true,
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
  scene: [PreloadScene, BannerScene, TopScene, SideScene, UiScene],
};

window.sizeChanged = debouncedResize;
window.onresize = () => window.sizeChanged();

if (window) {
  window.game = new Game(gameConfig);
}

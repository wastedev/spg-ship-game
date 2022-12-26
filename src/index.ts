// @ts-ignore
import { Game, Types } from 'phaser';
import * as Porthole from 'porthole-proxy';
import { PreloadScene, TopScene, UiScene, SideScene } from './scenes';
import { BannerScene } from './scenes/BannerScene';
import { debouncedResize } from './utils';

const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;

const gameConfig: Types.Core.GameConfig = {
  title: 'Игра - загрузка СПГ',
  type: Phaser.CANVAS,
  parent: 'game',
  backgroundColor: '#308CBA',
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
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
    },
  },
  canvasStyle: `display: block; width: 100%; height: 100%;`,
  autoFocus: true,
  scene: [PreloadScene, BannerScene, TopScene, SideScene, UiScene],
};

// window.sizeChanged = debouncedResize;
// window.onresize = () => window.sizeChanged();

// TEMP GAME INIT BEFORE porthole-proxy implementation
window.game = new Game(gameConfig);

// window.onload = function () {
//   window.windowProxy = new Porthole.WindowProxy(
//     'https://ferretvideo.com/projects/north/proxy/proxyGame3.html',
//   );
//   window.windowProxy.addEventListener(function (event: any) {
//     if (typeof event.data['startGame3'] !== undefined) {
//       window.game = new Game(gameConfig);
//     }
//   });
// };

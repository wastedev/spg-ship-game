// @ts-ignore
import { Game, Types } from 'phaser';
import * as Porthole from 'porthole-proxy';
import { PreloadScene, TopScene, UiScene, SideScene } from './scenes';
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
  scene: [PreloadScene, TopScene, SideScene, UiScene],
};

window.sizeChanged = debouncedResize;
window.onresize = () => window.sizeChanged();

// TEMP GAME INIT BEFORE porthole-proxy implementation
window.game = new Game(gameConfig);

window.onload = function () {
  window.windowProxy = new Porthole.WindowProxy(
    'https://ferretvideo.com/projects/north/proxy/proxyGame3.html',
  );
  window.windowProxy.addEventListener(function (event: any) {
    if (typeof event.data['startGame3'] !== undefined) {
      window.game = new Game(gameConfig);
    }
  });
};

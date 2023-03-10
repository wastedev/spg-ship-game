// @ts-ignore
import { Game, NONE, Scene, Types } from 'phaser';
import * as Porthole from 'porthole-proxy';
import { PreloadScene, TopScene, UiScene, SideScene, DockingScene } from './scenes';
import { BannerScene } from './scenes/BannerScene';

const isMobile =
  /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iP(ad|od|hone)/i.test(
    navigator.userAgent,
  );

let DEFAULT_WIDTH, DEFAULT_HEIGHT;

if (isMobile) {
  DEFAULT_WIDTH = 1920;
  DEFAULT_HEIGHT = 1080;
} else {
  DEFAULT_WIDTH = window.innerWidth;
  DEFAULT_HEIGHT = window.innerHeight;
}

const gameConfig: Types.Core.GameConfig = {
  title: 'Игра - загрузка СПГ',
  type: Phaser.AUTO,
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
      // debug: true,
      setBounds: true,
      gravity: { y: 0 },
    },
  },
  canvasStyle: `display: block; width: 100%; height: 100%;`,
  autoFocus: true,
  loader: { async: true },
  scene: [PreloadScene, BannerScene, TopScene, DockingScene, SideScene, UiScene],
};

// window.sizeChanged = debouncedResize;
// window.onresize = () => window.sizeChanged();

// TEMP GAME INIT BEFORE porthole-proxy implementation
// window.game = new Game(gameConfig);
window.onload = function () {
  window.windowProxy = new Porthole.WindowProxy(
    'https://ferretvideo.com/projects/north/proxy/proxyGame3.html',
  );

  window.windowProxy.addEventListener(function (event: any) {
    if (typeof event.data !== 'undefined' && event?.data === 'game_3_replay') {
      if (window.game) {
        // const scenes: Scene[] = window.game.scene.getScenes();

        // scenes.forEach((scene: Scene) => {
        //   scene.registry.destroy();
        //   scene.events.destroy();
        //   scene.scene.stop();
        // });

        window.game.scene.getScene('top-scene').scene.restart();
        window.game.scene.getScene('ui-scene').scene.restart();
      }
    }
  });

  window.game = new Game(gameConfig);
};

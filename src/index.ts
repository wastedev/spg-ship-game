// @ts-ignore
import { Game, NONE, Scene, Types } from 'phaser';
import * as Porthole from 'porthole-proxy';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { PreloadScene, TopScene, UiScene, SideScene, DockingScene, BannerScene } from './scenes';

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

const isRestart = location.href.split('?')[1];

const scenes = [PreloadScene, BannerScene, TopScene, DockingScene, SideScene, UiScene];
const restartScenes = [PreloadScene, TopScene, DockingScene, SideScene, UiScene];

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
  scene: isRestart ? restartScenes : scenes,
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
    if (typeof event.data['pageEvent'] !== 'undefined') {
      const eventData = JSON.parse(event.data['pageEvent']);
      if (eventData?.data === 'game_3_replay' && window.game) {
        location.href = `${location.origin}?isRestart`;
      }
    }
  });

  window.game = new Game(gameConfig);
};

// const scenes: Scene[] = window.game.scene.getScenes();
// scenes.forEach((scene) => {
//   scene.scene.stop();
// });
// window.game.scene.getScene('ui-scene').scene.remove();
// setTimeout(() => {
//   window.game.scene.getScene('ui-scene').scene.restart();
// }, 1000);
// gameConfig.scene = [PreloadScene, TopScene, DockingScene, SideScene, UiScene];
// location.reload();
// scenes.forEach((scene) => {
//   scene.scene.stop();
//   scene.scene.remove();
// });
// window.game.scene.getScene('top-scene').scene.restart();
// window.game.scene.getScene('ui-scene').scene.restart();
// scenes.forEach((scene: Scene) => {
//   scene.registry.destroy();
//   scene.events.destroy();
//   scene.scene.stop();
// });
// console.log(window.game.scene.isActive('top-scene'));
// if (!window.game.isRunning) {
//   console.log('dont run bitch');
// }
// window.game.destroy(true);
// window.game = null;
// if (!window.game) {
//   window.game = new Game(gameConfig);
// }

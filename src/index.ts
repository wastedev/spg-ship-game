// @ts-ignore
import { Game, NONE, Scene, Types } from 'phaser';
import * as Porthole from 'porthole-proxy';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { PreloadScene, TopScene, UiScene, SideScene, DockingScene } from './scenes';

window.onload = () => {
  const banner = document.getElementById('gameBanner') as HTMLElement;
  const isRestart = location.href.split('?')[1] === 'isRestart' ?? false;
  if (isRestart) {
    banner.remove();
  }
  const startButton = document.getElementById('btn') || '';
  if (startButton != '') {
    startButton.addEventListener('click', () => {
      banner.remove();
      const loader = document.querySelector('.bearOff') as HTMLElement;
      loader.classList.remove('bearOff');
      window.game = new Game(gameConfig);
    });
  }

  const isMobile =
    /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iP(ad|od|hone)|Mac/i.test(
      navigator.userAgent,
    );

  const touchable = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  let DEFAULT_WIDTH, DEFAULT_HEIGHT;

  if (isMobile && touchable()) {
    DEFAULT_WIDTH = window.innerWidth * window.devicePixelRatio;
    DEFAULT_HEIGHT = window.innerHeight * window.devicePixelRatio;
  } else {
    DEFAULT_WIDTH = window.innerWidth;
    DEFAULT_HEIGHT = window.innerHeight;
  }

  const scenes = [PreloadScene, TopScene, DockingScene, SideScene, UiScene];

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
    scene: scenes,
  };

  const windowProxy = new Porthole.WindowProxy(
    'https://ferretvideo.com/projects/north/proxy/proxyGame3.html',
  );
  windowProxy.addEventListener((event: any) => {
    if (typeof event.data['pageEvent'] !== 'undefined') {
      const eventData = JSON.parse(event.data['pageEvent']);
      if (eventData?.data === 'game_3_replay' && window.game) {
        location.href = `${location.origin}?isRestart`;
      }
    }
  });

  window.windowProxy = windowProxy;
};

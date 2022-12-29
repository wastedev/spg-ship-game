import { Scene, Types } from 'phaser';
import { threadId } from 'worker_threads';

export class PreloadScene extends Scene {
  private backgroundSound!: any;

  constructor() {
    super('preload-scene');
  }

  preload(): void {
    this.load.baseURL = 'assets/';

    // LOAD PLAYER ASSETS
    this.load.image('player-top', 'img/entities/player/player-top.png');
    this.load.image('player-side', 'img/entities/player/player-side.png');

    // LOAD STATION ASSETS
    this.load.image('station-top', 'img/entities/station/station-top.png');
    this.load.image('station-side', 'img/entities/station/station-side.png');
    this.load.image('station-side-connected', 'img/entities/station/station-side-connected.png');

    // LOAD BACKGROUND ASSETS
    this.load.image('background-icebergs-top', 'img/backgrounds/background-icebergs-top.png');
    this.load.image('background-side', 'img/backgrounds/background-side.png');
    this.load.image('background-banner', 'img/backgrounds/bannerBackground.png');
    this.load.image('background-docking', 'img/backgrounds/background-docking.png');

    // LOAD ICEBERGS ASSETS
    this.load.image('iceberg-1', 'img/entities/icebergs/iceberg-1.png');
    this.load.image('iceberg-2', 'img/entities/icebergs/iceberg-2.png');
    this.load.image('iceberg-3', 'img/entities/icebergs/iceberg-3.png');

    // LOAD BAR ASSETS
    this.load.image('bar', 'img/entities/images/bar.png');
    this.load.image('bar-cursor', 'img/entities/images/barCursor.png');

    // LOAD UI
    this.load.image('leftButtonMove', 'img/entities/ui/leftButtonMove.png');
    this.load.image('rightButtonMove', 'img/entities/ui/rightButtonMove.png');
    this.load.image('shotButton', 'img/entities/ui/shotButton.png');
    this.load.image('oilScore', 'img/entities/images/oilScore.png');
    this.load.image('healthScore', 'img/entities/images/healthScore.png');
    this.load.image('oilLoad', 'img/entities/ui/oilLoad.png');
    this.load.image('bannerStartBtn', 'img/entities/ui/startBannerButton.png');

    //LOAD ROCKET ANIMATION ASSETS
    this.load.image('rocket', 'img/entities/images/rocket.png');

    // LOAD GOAL ZONES
    this.load.image('goal-zone', 'img/entities/station/goal-zone.png');
    this.load.image('goal-distance', 'img/entities/station/goal-distance.png');

    this.load.image('goal-1000', 'img/entities/images/1000meter.png');
    this.load.image('goal-500', 'img/entities/images/500meter.png');
    this.load.image('goal-80', 'img/entities/images/80meter.png');

    // LOAD SOUNDS ASSETS
    this.load.audio('background', 'sounds/background.wav');
    this.load.audio('rocket', 'sounds/rocket.mp3');
  }

  create(): void {
    this.backgroundSound = this.sound.add('background');

    const musicConfig: Types.Sound.SoundConfig = {
      volume: 0.5,
      loop: true,
    };

    this.backgroundSound.play(musicConfig);

    this.scene.start('banner-scene');
  }
}

import { Scene, Types } from 'phaser';

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

    // LOAD ICEBERGS ASSETS
    this.load.image('iceberg-1', 'img/entities/icebergs/iceberg-1.png');
    this.load.image('iceberg-2', 'img/entities/icebergs/iceberg-2.png');
    this.load.image('iceberg-3', 'img/entities/icebergs/iceberg-3.png');

    //LOAD BAR ASSETS
    this.load.image('bar', 'img/entities/images/bar.png');
    this.load.image('bar-cursor', 'img/entities/images/barCursor.png');

    //LOAD ROCKET ANIMATION ASSETS
    this.load.spritesheet('rocketSpr', 'img/entities/images/rocketAnimation.png', {
      frameWidth: 1000,
      frameHeight: 1300,
    });

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

    this.scene.start('side-scene');
    this.scene.start('ui-scene');
  }
}

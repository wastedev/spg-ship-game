import { Scene, Types } from 'phaser';
import { threadId } from 'worker_threads';

export class PreloadScene extends Scene {
  private backgroundSound!: any;
  // private loader!: any;

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
    this.load.image('background-docking', 'img/backgrounds/background-docking.png');
    this.load.image('background-image', 'img/backgrounds/banner-background.png');
    this.load.image('banner-landscape', 'img/backgrounds/banner-background-landscape.png');

    // LOAD ICEBERG ANIMATIONS ASSETS
    this.load.spritesheet('sprIceberg-1', 'img/entities/icebergs/icebergAnimations1.png', {
      frameWidth: 180,
      frameHeight: 180,
    });
    this.load.spritesheet('sprIceberg-2', 'img/entities/icebergs/icebergAnimations2.png', {
      frameWidth: 180,
      frameHeight: 180,
    });
    this.load.spritesheet('sprIceberg-3', 'img/entities/icebergs/icebergAnimations3.png', {
      frameWidth: 180,
      frameHeight: 180,
    });

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

    // LOAD POPUP ASSETS
    this.load.image('1000meters', 'img/entities/ui/1000meters.png');
    this.load.image('500meters', 'img/entities/ui/500meters.png');
    this.load.image('80meters', 'img/entities/ui/80meters.png');
    this.load.image('dockingPopup', 'img/entities/ui/docking.png');
    this.load.image('hookInfoPopup', 'img/entities/ui/hookInfo.png');
    this.load.image('continueButton', 'img/entities/ui/continueButton.png');

    //LOAD ROCKET ASSETS
    this.load.image('rocket', 'img/entities/images/rocket.png');
    this.load.image('rocket-background-zone', 'img/entities/images/rocket_background_zone.png');
    this.load.image('rocket-zone', 'img/entities/images/rocket_zone.png');
    this.load.image('rocket-target-zone', 'img/entities/player/rocket-zone.png');

    // LOAD GOAL ZONES ASSETS
    this.load.image('goal-zone', 'img/entities/station/goal-zone.png');
    this.load.image('goal-distance', 'img/entities/station/goal-distance.png');

    // LOAD SOUNDS ASSETS
    this.load.audio('background', 'sounds/background.mp3');
    this.load.audio('rocket', 'sounds/rocket.mp3');
  }

  create(): void {
    this.backgroundSound = this.sound.add('background');
    const musicConfig: Types.Sound.SoundConfig = {
      volume: 0.5,
      loop: true,
    };

    const loader = document.getElementById('ferretVideoWaitlay');
    if (loader) {
      loader.style.display = 'none';
    }
    this.backgroundSound.play(musicConfig);
    this.scene.start('banner-scene');
  }
}

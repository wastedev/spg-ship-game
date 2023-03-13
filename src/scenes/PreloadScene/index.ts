import { Scene, Types } from 'phaser';
import { threadId } from 'worker_threads';

export class PreloadScene extends Scene {
  // private backgroundSound!: any;
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
    this.load.image('banner-image', 'img/backgrounds/banner-background.png');
    this.load.image('banner-text', 'img/backgrounds/background-text.svg');
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
    this.load.image('leftButtonMove', 'img/entities/ui/leftButtonMove.svg');
    this.load.image('rightButtonMove', 'img/entities/ui/rightButtonMove.svg');
    this.load.image('oilScore', 'img/entities/images/oilScore.png');
    this.load.image('healthScore', 'img/entities/images/healthScore.png');
    this.load.image('oilLoad', 'img/entities/ui/oilLoad.png');
    this.load.image('bannerStartBtn', 'img/entities/ui/startBannerButton.png');
    this.load.image('continueGame', 'img/entities/ui/continueGame.svg');
    this.load.image('pauseGame', 'img/entities/ui/pauseGame.svg');

    //sound buttons
    this.load.image('soundOn', 'img/entities/ui/sound.svg');
    this.load.image('soundOff', 'img/entities/ui/muteSound.svg');

    //end
    this.load.image('endBtn', 'img/entities/ui/endGameBtn.svg');

    // LOAD POPUP ASSETS
    this.load.image('docking-info', 'img/entities/ui/popups/info.jpg');
    this.load.image('1000meters', 'img/entities/ui/popups/1000meters.jpg');
    this.load.image('500meters', 'img/entities/ui/popups/500meters.jpg');
    this.load.image('80meters', 'img/entities/ui/popups/80meters.jpg');
    this.load.image('popupBg', 'img/entities/ui/popups/popupBackground.png');
    this.load.image('endPopup', 'img/entities/ui/popups/endGamePopup.jpg');
    this.load.image('rocketInfo', 'img/entities/ui/popups/rocketInfo.png');
    this.load.image('crossButton', 'img/entities/ui/closeButton.svg');
    this.load.image('continueButton', 'img/entities/ui/continueButton.svg');
    //////new

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
    const loader = document.getElementById('ferretVideoWaitlay');
    if (loader) {
      loader.style.display = 'none';
    }

    if (window.game.scene.getScene('banner-scene') !== null) {
      this.scene.start('banner-scene');
    } else {
      this.scene.start('top-scene');
      this.scene.start('ui-scene');
    }
  }
}

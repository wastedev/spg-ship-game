import { maxHeaderSize } from 'http';
import { World } from 'matter';
import { Scene, GameObjects, Types, Sound } from 'phaser';
import { FIRST_SCENE, SCENE_HEALTH, SECOND_SCENE } from '../../helpers';
import { UiScene } from '../UiScene';

export class SideScene extends Scene {
  private backgroundSide!: GameObjects.Image;
  private playerSide!: Phaser.Physics.Matter.Sprite;
  private oilStationSide!: GameObjects.Sprite;
  private rocketSound!: Sound.BaseSound;
  private rocketConfig!: Types.Sound.SoundConfig;
  private popUpInfo!: GameObjects.Image;
  private continueButton!: GameObjects.Image;
  private continueButtonClicked: boolean = false;

  //
  private popupBG!: GameObjects.Image;

  private rocketBackgroundZone!: GameObjects.Image;
  private rocketZone!: GameObjects.Image;
  private rocketTargetZone!: Phaser.Physics.Matter.Sprite;

  //new variables for rocket shooting
  private rocketCreated: boolean = false;
  private rocket!: Phaser.Physics.Matter.Sprite;
  private rocketX!: number;
  private rocketY!: number;
  private oldRocketX!: number;
  private oldRocketY!: number;
  private shot: boolean = false;
  private newRocket!: Phaser.Physics.Matter.Sprite;
  private velX!: number;
  private velY!: number;
  private angle!: number;
  private g: number = 0.25;
  private rocketAngle!: number;
  private rocketShotAttempt: number = 5;
  private pointerDown: boolean = false;
  private closeButton!: GameObjects.Image;

  private gameStatus: boolean = true;
  private getTarget: boolean = false;

  //functions for rocket shooting
  createRocket() {
    this.rocketCreated = true;
  }

  rocketShot() {
    if (!this.shot) {
      this.shot = true;
      this.newRocket = this.matter.add
        .sprite(this.rocketZone.x, this.rocketZone.y, 'rocket')
        .setScale(0.3)
        .setOrigin(0.5)
        .setTint(0xffffff);
      this.newRocket.setBounce(0);
      this.newRocket.angle = this.rocketZone.angle;
      this.velX = -(this.input.activePointer.x - this.rocketZone.x) / 6;
      this.velY = -(this.input.activePointer.y - this.rocketZone.y) / 6;
    }
  }

  resetRocket() {
    if (this.rocketShotAttempt != 0) {
      --this.rocketShotAttempt;
      this.shot = false;
      this.rocket.x = this.rocketZone.x;
      this.rocket.y = this.rocketZone.y;
      this.rocketX = this.oldRocketX = this.rocket.x;
      this.rocketY = this.oldRocketY = this.rocket.y;
      this.pointerDown = false;
      this.createRocket();
    } else {
      const ui = this.getUI();
      ui.setHealth(0);
    }
  }
  //

  constructor() {
    super('side-scene');
  }

  getLinePoints(line: any): Phaser.Math.Vector2[] {
    return line.getPoints(3) as Phaser.Math.Vector2[];
  }

  loadPopup(): void {
    this.popupBG.visible = true;
    this.popupBG.setDepth(50);
    this.popUpInfo = this.add.image(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      '80meters',
    );
    this.popUpInfo.scale = 1;
    this.popUpInfo.setDepth(51);
    this.continueButton = this.add
      .image(this.popUpInfo.x, this.popUpInfo.y + this.popUpInfo.y / 5, 'continueButton')
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerup', () => {
        this.popUpInfo.destroy();
        this.continueButton.destroy();
        this.closeButton.destroy();
        this.playerSide.visible = true;
        this.playerSide.setDepth(1);
        this.rocketTargetZone.visible = true;
        this.rocketTargetZone.setDepth(1);
        this.rocketTargetZone.setBounce(0);
        this.continueButtonClicked = true;
        this.popupBG.visible = false;
      });
    this.continueButton.setDepth(51);
    this.continueButton.setScale(1);
    this.closeButton = this.add
      .image(this.game.scale.width / 2 + 380, this.game.scale.height / 2 - 170, 'crossButton')
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerup', () => {
        this.popUpInfo.destroy();
        this.continueButton.destroy();
        this.closeButton.destroy();
        this.playerSide.visible = true;
        this.playerSide.setDepth(1);
        this.rocketTargetZone.visible = true;
        this.rocketTargetZone.setDepth(1);
        this.rocketTargetZone.setBounce(0);
        this.continueButtonClicked = true;
        this.popupBG.visible = false;
      });
    this.closeButton.setDepth(51);
  }

  protected getUI(): UiScene {
    return this.scene.get('ui-scene') as UiScene;
  }

  create(): void {
    this.popupBG = this.add.image(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'popupBg',
    );
    this.popupBG.visible = false;
    this.popupBG.setAlpha(0.7);
    this.loadPopup();

    this.rocketSound = this.sound.add('rocket');
    this.rocketConfig = {
      volume: 0.3,
      loop: false,
    };

    this.backgroundSide = this.add.image(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'background-side',
    );
    this.backgroundSide.displayWidth = window.game.scale.width + 20;
    this.backgroundSide.displayHeight = window.game.scale.height;
    this.backgroundSide.setDepth(-1);

    this.playerSide = this.matter.add.sprite(
      window.game.scale.width / 2 + window.game.scale.width / 3.5,
      window.game.scale.height / 2 + 100,
      'player-side',
    );
    this.playerSide.scale = 1;
    this.playerSide.visible = false;
    this.playerSide.setRectangle(0.001, 0.001);
    this.playerSide.setStatic(true);

    this.rocketTargetZone = this.matter.add.sprite(
      this.playerSide.x - 345,
      this.playerSide.y + 30,
      'rocket-target-zone',
    );
    this.rocketTargetZone.scale = 0.5;
    this.rocketTargetZone.visible = false;
    this.rocketTargetZone.setRectangle(110, 15);
    this.rocketTargetZone.setStatic(true);

    this.oilStationSide = this.add.sprite(
      window.game.scale.width / 10,
      window.game.scale.height / 2 - 100,
      'station-side',
    );
    this.oilStationSide.scale = 1;
    this.oilStationSide.setDepth(-1);

    this.rocketBackgroundZone = this.add.image(
      this.oilStationSide.x + this.oilStationSide.x / 10,
      this.oilStationSide.y + this.oilStationSide.y / 5,
      'rocket-background-zone',
    );
    this.rocketBackgroundZone.scale = 0.4;
    this.rocketBackgroundZone.active = false;

    this.rocketZone = this.add.image(
      this.oilStationSide.x + this.oilStationSide.x / 10,
      this.oilStationSide.y + this.oilStationSide.y / 5,
      'rocket-zone',
    );
    this.rocketZone.scale = 0.4;
    this.rocketZone.active = false;

    this.rocket = this.matter.add
      .sprite(this.rocketZone.x, this.rocketZone.y, 'rocket')
      .setScale(0.3)
      .setOrigin(0.5);

    this.rocket.angle = this.rocketZone.angle;
    this.rocketX = this.oldRocketX = this.rocket.x;
    this.rocketY = this.oldRocketY = this.rocket.y;
  }

  rocketEventSettings(): void {
    if (this.continueButtonClicked) {
      this.continueButtonClicked = false;

      this.input.on('pointerdown', (pointer: any) => {
        if (this.gameStatus) {
          this.pointerDown = true;
          this.createRocket();
        }
      });
      this.input.on('pointerup', (pointer: any) => {
        if (this.gameStatus) {
          if (!this.shot) {
            this.rocketSound.play(this.rocketConfig);
          }
          this.rocketShot();
          this.rocket.setAlpha(1);
        }
      });
    }
  }

  update(time: any, delta: any): void {
    this.rocketEventSettings();
    const ui = this.getUI();
    ui.setHealth(this.rocketShotAttempt);

    if (this.rocketShotAttempt < 1 && !this.getTarget && this.gameStatus) {
      this.gameStatus = false;
      ui.restartGame(3);
    }

    if (!this.shot) {
      if (this.pointerDown) {
        this.rocket.setAlpha(1);
        this.angle =
          Math.atan2(
            this.input.activePointer.x - this.rocketZone.x,
            -(this.input.activePointer.y - this.rocketZone.y),
          ) *
            (180 / Math.PI) -
          180;
        this.rocketZone.angle = this.rocket.angle = this.angle;
      }
    } else {
      this.rocket.setAlpha(1);

      this.rocketX += this.velX;
      this.rocketY += this.velY;
      this.velY += this.g;
      this.newRocket.x = this.rocketX;
      this.newRocket.y = this.rocketY;
      this.rocketAngle =
        Math.atan2(this.rocketX - this.oldRocketX, -(this.rocketY - this.oldRocketY)) *
        (180 / Math.PI);
      this.newRocket.angle = this.rocketAngle;
      this.newRocket.setDepth(1);

      if (this.newRocket) {
        this.matter.overlap(this.rocketTargetZone, [this.newRocket], () => {
          this.getTarget = true;
          this.gameStatus = false;
          this.resetRocket();
          ui.oilLoading();
        });
      }

      this.oldRocketX = this.rocketX;
      this.oldRocketY = this.rocketY;
      if (this.newRocket.y > window.game.scale.height + 50) {
        this.resetRocket();
      }
      if (this.newRocket.x <= -50) {
        this.resetRocket();
      }
      if (this.newRocket.x >= window.game.scale.width + 50) {
        this.resetRocket();
      }
    }
  }
}

//from create function
// this.bar = this.add.image(window.game.scale.width / 2, window.game.scale.height / 10, 'bar');
// this.bar.scale = 0.5;

// this.barCursor = this.matter.add.sprite(this.bar.x, this.bar.y - 35, 'bar-cursor');
// this.barCursor.setScale(0.5);

// this.graphics = this.add.graphics();//for drawing a line
// this.line = new Phaser.Geom.Line(
//   this.rocket.x,
//   this.rocket.y,
//   this.playerSide.x - 100,
//   this.playerSide.y + 100,
// );

// this.points = this.getLinePoints(this.line);
// this.points[1].y = this.points[1].y - 100;

// this.curve = new Phaser.Curves.Spline(this.points);
// this.graphics.lineStyle(1, 0x00000, 0);
// this.curve.draw(this.graphics, 64);

// this.pointerMove();//from update function

// pointerMove(): void {//function for pointer
//   if (this.barCursor.x <= this.bar.x - 120) {
//     this.barCursor.setVelocityX(8);
//   } else if (this.barCursor.x >= this.bar.x + 120) {
//     this.barCursor.setVelocityX(-8);
//   }
// }

// private shotButton!: GameObjects.Image;//unused variables

// this.t = -1;// from rocket fly logics from create function

// shot(): void { //shot button logic
//   if (this.sidePlayerHealth != 0) {
//     if (this.barCursor.x >= this.bar.x + 40) {
//       this.rocketSound.play(this.rocketConfig);
//       // this.t = 0; //from rocket fly logics
//       this.barCursor.setVelocityX(0);
//       this.shotButton.removeAllListeners();
//     } else {
//       --this.sidePlayerHealth;
//       --SCENE_HEALTH[SECOND_SCENE];
//     }
//     if (this.sidePlayerHealth === 0) {
//       console.log('GAME_OVER');

//       window.windowProxy.post({
//         finishGame3: JSON.stringify({
//           win: false,
//           lose: true,
//           crashCount: 3 - SCENE_HEALTH[FIRST_SCENE],
//           aimTries: 3 - SCENE_HEALTH[SECOND_SCENE],
//         }),
//       });

//       this.barCursor.setVelocityX(0);
//       this.shotButton.removeAllListeners();
//     }
//   }
// }

// this.shotButton = this.add//shot button visual from create function
//   .image(this.bar.x + 200, this.bar.y, 'shotButton')
//   .setScrollFactor(0)
//   .setInteractive()
//   .on('pointerup', () => {
//     this.shot();
//   });
// this.shotButton.scale = 0.35;

// this.rocketOnPoint = false;//from create method
// this.duration = 1500;

// private t!: number; //variables
// private duration!: number;
// private rocketOnPoint!: boolean;

// if (this.t === -1) { // rocket logic
//   return;
// }
// this.t += delta;
// if (this.t >= this.duration) {
//   this.rocket.setVelocity(0, 0);
// } else {
//   this.rocket.angle += 1;
//   var d = this.t / this.duration;
//   var p = this.curve.getPoint(d);
//   this.rocket.setPosition(p.x, p.y);
// }

// if (this.rocketOnPoint === false) {
//   if (this.rocket.x >= this.points[2].x - 5) {
//     this.rocketOnPoint = true;
//     this.oilStationSide.destroy();
//     this.oilStationSide = this.add.sprite(
//       window.game.scale.width / 5,
//       window.game.scale.height / 2 - 60,
//       'station-side-connected',
//     );
//     const ui = this.getUI();
//     ui.activateLoadButton();
//   }
// }

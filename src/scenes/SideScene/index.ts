import { Scene, GameObjects, Types, Sound } from 'phaser';
import { UiScene } from '../UiScene';

export interface IFingerAnimateTarget {
  xTarget: number;
  yTarget?: number;
  xStart?: number;
  yStart?: number;
}

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

  private fingerGuide!: GameObjects.Image;
  private fingerAnumateCount: number = 3;
  private fingerAnimateTarget: Partial<IFingerAnimateTarget> = {};
  private animationStart: boolean = false;
  private rocketVector!: GameObjects.Image;

  private graphics!: GameObjects.Graphics;
  private trajectoryMath: Phaser.Math.Vector2[] = [];
  private rocketXVec: number = 0;
  private rocketYVec: number = 0;
  private curve!: Phaser.Curves.CubicBezier;

  //functions for rocket shooting
  createRocket() {
    this.rocketCreated = true;
  }

  initRocketVector(): void {
    this.rocketVector = this.add.image(this.rocket.x + 100, this.rocket.y, 'rocketVector');
    let vectorLength = this.rocketTargetZone.x - this.rocket.x;
    this.rocketVector.setDisplaySize(vectorLength - 150, window.game.scale.height / 5);
    this.rocketVector.setOrigin(0, 0.5);
    this.rocketVector.setAlpha(0.8);
  }

  rocketShot(): void {
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
    this.popUpInfo = this.add
      .image(window.game.scale.width / 2, window.game.scale.height / 2, 'rocketInfo')
      .setScrollFactor(0)
      .setInteractive();
    this.popUpInfo.scale = 1;
    this.popUpInfo.setDepth(51);

    this.continueButton = this.add
      .image(this.popUpInfo.x, this.popUpInfo.y + this.popUpInfo.y / 6.5, 'continueButton')
      .setScrollFactor(0)
      .setInteractive({ cursor: 'pointer' })
      .on('pointerup', () => {
        this.popUpInfo.destroy();
        this.closeButton.destroy();
        this.continueButton.destroy();
        this.playerSide.visible = true;
        this.playerSide.setDepth(1);
        this.rocketTargetZone.visible = true;
        this.rocketTargetZone.setSensor(true);
        this.rocketTargetZone.setDepth(1);
        this.rocketTargetZone.setBounce(0);
        this.continueButtonClicked = true;
        this.popupBG.visible = false;
        this.animationStart = true;
      })
      .on('pointerover', () => {
        this.continueButton.setTexture('continueButtonHover');
      })
      .on('pointerout', () => {
        this.continueButton.setTexture('continueButton');
      });
    this.continueButton.setDepth(51);

    this.closeButton = this.add
      .image(this.game.scale.width / 2 + 380, this.game.scale.height / 2 - 170, 'crossButton')
      .setScrollFactor(0)
      .setInteractive({ cursor: 'pointer' })
      .on('pointerup', () => {
        this.popUpInfo.destroy();
        this.closeButton.destroy();
        this.continueButton.destroy();
        this.playerSide.visible = true;
        this.playerSide.setDepth(1);
        this.rocketTargetZone.visible = true;
        this.rocketTargetZone.setDepth(1);
        this.rocketTargetZone.setBounce(0);
        this.continueButtonClicked = true;
        this.popupBG.visible = false;
        this.animationStart = true;
      });
    this.closeButton.setDepth(51);
  }

  loadFingerAnimation(): void {
    this.fingerGuide = this.add.image(
      this.oilStationSide.x + 200,
      this.oilStationSide.y + 200,
      'fingerGuide',
    );

    this.fingerAnimateTarget.xTarget = this.fingerGuide.x - 100;
    this.fingerAnimateTarget.yTarget = this.fingerGuide.y - 100;
    this.fingerAnimateTarget.xStart = this.fingerGuide.x;
    this.fingerAnimateTarget.yStart = this.fingerGuide.y;
  }

  protected getUI(): UiScene {
    return this.scene.get('ui-scene') as UiScene;
  }

  create(): void {
    const ui = this.getUI();
    ui.hideButtons();

    this.popupBG = this.add.image(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'popupBg',
    );
    this.popupBG.visible = false;
    this.popupBG.setAlpha(0.7);
    this.popupBG.scale = 3;
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
    this.rocketXVec = this.rocketX;
    this.rocketYVec = this.rocketY;

    this.loadFingerAnimation();
    //
    this.initRocketVector();
    //
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

  fingerAnimation(): void {
    if (this.fingerAnumateCount != 0) {
      if (
        this.fingerGuide.x != this.fingerAnimateTarget.xTarget &&
        this.fingerGuide.y != this.fingerAnimateTarget.yTarget
      ) {
        this.fingerGuide.x -= 1;
        this.fingerGuide.y += 1;
      } else {
        this.fingerGuide.x = this.fingerAnimateTarget.xStart ? this.fingerAnimateTarget.xStart : 0;
        this.fingerGuide.y = this.fingerAnimateTarget.yStart ? this.fingerAnimateTarget.yStart : 0;
        --this.fingerAnumateCount;
        if (this.fingerAnumateCount === 0) this.fingerGuide.visible = false;
      }
    } else {
      this.animationStart = false;
      this.fingerGuide.visible = false;
    }
  }

  update(time: any, delta: any): void {
    if (this.animationStart) this.fingerAnimation();

    this.rocketEventSettings();
    const ui = this.getUI();
    ui.setHealth(this.rocketShotAttempt);

    if (this.rocketShotAttempt < 1 && !this.getTarget && this.gameStatus) {
      this.gameStatus = false;
      ui.gameLose();
    }

    if (!this.shot) {
      if (this.pointerDown) {
        this.rocketVector.visible = false;
        this.rocket.setAlpha(1);
        this.angle =
          Math.atan2(
            this.input.activePointer.x - this.rocketZone.x,
            -(this.input.activePointer.y - this.rocketZone.y),
          ) *
            (180 / Math.PI) -
          180;
        this.rocketZone.angle = this.rocket.angle = this.angle;

        let oldValues = [this.rocketXVec, this.rocketYVec];

        this.rocketXVec = -(this.input.activePointer.x - this.rocketZone.x) / 6;
        this.rocketYVec = -(this.input.activePointer.y - this.rocketZone.y) / 6;

        if (oldValues[0] != this.rocketXVec || oldValues[1] != this.rocketYVec) {
          for (let i = 0; i <= 32; i++) {
            if (i === 0) {
              this.trajectoryMath[i] = new Phaser.Math.Vector2(this.rocket.x, this.rocket.y);
            } else {
              this.trajectoryMath[i] = new Phaser.Math.Vector2(
                this.rocketX + this.rocketXVec * i,
                this.rocketY + this.rocketYVec * i,
              );
            }
          }
          if (this.graphics != null || this.graphics != undefined) {
            this.graphics.destroy();
          }
          this.graphics = this.add.graphics();
          this.graphics.lineStyle(4, 0xff00000, 0.7);

          let p0 = new Phaser.Math.Vector2(this.trajectoryMath[4].x, this.trajectoryMath[4].y);
          let p2 = new Phaser.Math.Vector2(
            this.trajectoryMath[20].x,
            this.trajectoryMath[20].y + 30,
          );

          let p3 = new Phaser.Math.Vector2(
            this.trajectoryMath[30].x,
            this.trajectoryMath[30].y + 110,
          );

          this.curve = new Phaser.Curves.CubicBezier(p0, this.trajectoryMath[14], p2, p3);
          this.curve.draw(this.graphics, 20);
        }
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
      this.newRocket.setBounce(0);

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

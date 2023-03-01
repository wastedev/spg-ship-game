import { GameObjects, Scene } from 'phaser';
import { Player } from '../../entities/Player';
import { GAME_SPEEDS, MOVEMENT_SPEED, ROTATION_SPEED } from '../../constants';
import { UiScene } from '../UiScene';
import { FIRST_SCENE, SCENE_HEALTH, SECOND_SCENE } from '../../helpers';
import { IncomingMessage } from 'http';
import { getuid } from 'process';

export class DockingScene extends Scene {
  public player!: Player;
  private station!: Phaser.Physics.Matter.Image;
  private background!: GameObjects.Image;

  private topBarrier!: MatterJS.BodyType;
  private bottomBarrier!: MatterJS.BodyType;

  private goalStage!: number;
  private goalStageRectangle!: Phaser.Physics.Matter.Sprite;
  private goalStageMessage!: Phaser.Physics.Matter.Sprite;
  private continueButton!: GameObjects.Image;
  private closeButton!: GameObjects.Image;
  private popupBG!: GameObjects.Image;

  private gameEndPopup!: GameObjects.Image;
  private gameEndBtn!: GameObjects.Image;

  constructor() {
    super('docking-scene');
  }

  create() {
    GAME_SPEEDS[MOVEMENT_SPEED] = 0.8;
    GAME_SPEEDS[ROTATION_SPEED] = 0.35;
    this.background = this.add.image(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'background-docking',
    );
    this.background.setOrigin(0.5);

    this.goalStage = 1000;
    this.player = new Player(
      this.matter.world,
      window.game.scale.width / 10,
      window.game.scale.height / 2,
      'player-top',
    );

    this.station = this.matter.add.image(
      window.game.scale.width - 100,
      window.game.scale.height / 2 + 10,
      'station-top',
      undefined,
      { isStatic: true },
    );
    this.station.scale = window.game.scale.height / window.game.scale.width;
    this.station.setRectangle(
      (this.station.width / 2) * this.station.scale - 20,
      window.game.scale.height,
    );
    this.station.setStatic(true);
    this.popupBG = this.add.image(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'popupBg',
    );
    this.popupBG.setAlpha(0.7);
    this.popupBG.visible = false;
  }

  public getUI(): UiScene {
    return this.scene.get('ui-scene') as UiScene;
  }

  areaHitboxes(divider: number, width: number) {
    this.topBarrier = this.matter.add.rectangle(
      this.goalStageRectangle.x,
      this.goalStageRectangle.y - this.goalStageRectangle.y / divider,
      this.goalStageRectangle.width / width,
      window.game.scale.height / 2 - this.goalStageRectangle.y / 3,
    );
    this.topBarrier.isStatic = true;

    this.bottomBarrier = this.matter.add.rectangle(
      this.goalStageRectangle.x,
      this.goalStageRectangle.y + this.goalStageRectangle.y / divider,
      this.goalStageRectangle.width / width,
      window.game.scale.height / 2 - this.goalStageRectangle.y / 3,
    );
    this.bottomBarrier.isStatic = true;
  }

  zoneKnock() {
    GAME_SPEEDS[MOVEMENT_SPEED] = 0;
    GAME_SPEEDS[ROTATION_SPEED] = 0;
    console.log('врезался');
    const ui = this.getUI();
    ui.restartGame(2);
  }

  zonePing(pingDelay: number, state: number): void {
    setTimeout(() => {
      this.goalStageRectangle.visible = false;
    }, pingDelay);
    setTimeout(() => {
      this.goalStageRectangle.visible = true;
    }, pingDelay + 1000);
    setTimeout(() => {
      this.goalStageRectangle.visible = false;
    }, pingDelay + 2000);
    setTimeout(() => {
      this.goalStageRectangle.visible = true;
    }, pingDelay + 3000);
    setTimeout(() => {
      if (state === 500) {
        this.goalStageRectangle.setX(window.game.scale.width / 2);
        this.goalStageRectangle.setDisplaySize(300, 200);
        this.areaHitboxes(1.9, 6.5);
      } else if (state === 80) {
        this.goalStageRectangle.setX(this.station.x - 350);
        this.goalStageRectangle.setDisplaySize(220, 50);
        this.areaHitboxes(2.5, 9);
      }
      GAME_SPEEDS[MOVEMENT_SPEED] = 0.8;
      GAME_SPEEDS[ROTATION_SPEED] = 0.35;
    }, pingDelay + 4000);
  }

  zonesStaging(): void {
    if (this.goalStage > 500) {
      if (
        this.player.x >= this.goalStageRectangle?.x - 30 &&
        (this.player.y >= this.goalStageRectangle?.y - 30 ||
          this.player.y <= this.goalStageRectangle?.y + 30)
      ) {
        this.goalStage = 500;
      }
    }

    if (this.goalStage > 80) {
      if (
        this.player.x >= this.goalStageRectangle?.x + 30 &&
        (this.player.y >= this.goalStageRectangle?.y - 30 ||
          this.player.y <= this.goalStageRectangle?.y + 30)
      ) {
        this.goalStage = 80;
      }
    }
    if (this.goalStage === 79) {
      if (this.player.x >= this.station.x - 350) {
        const ui = this.getUI();
        GAME_SPEEDS[MOVEMENT_SPEED] = 0;
        GAME_SPEEDS[ROTATION_SPEED] = 0;
        this.zonePing(1000, 0);
        setTimeout(() => {
          ui.sideSceneChange();
          this.scene.stop();
          this.scene.start('side-scene');
        }, 5000);
        this.goalStage--;
      }
    }

    switch (this.goalStage) {
      case 1000:
        this.goalStageRectangle = this.matter.add.sprite(
          window.game.scale.width / 5,
          window.game.scale.height / 2,
          'goal-distance',
        );
        this.goalStageRectangle.setDisplaySize(500, 300);
        this.goalStageRectangle.setSensor(true);
        this.areaHitboxes(1.65, 4);
        --this.goalStage;
        break;

      case 500:
        GAME_SPEEDS[MOVEMENT_SPEED] = 0;
        GAME_SPEEDS[ROTATION_SPEED] = 0;
        this.popupBG.visible = true;
        this.goalStageMessage = this.matter.add.sprite(
          window.game.scale.width / 2,
          window.game.scale.height / 2,
          '1000meters',
        );
        this.goalStageMessage.setScale(1);
        this.goalStageMessage.setStatic(true);
        this.goalStageMessage.setSensor(true);
        this.continueButton = this.add
          .image(
            this.goalStageMessage.x,
            this.goalStageMessage.y + this.goalStageMessage.y / 5,
            'continueButton',
          )
          .setScrollFactor(0)
          .setInteractive()
          .on('pointerup', () => {
            this.goalStageMessage.destroy();
            this.continueButton.destroy();
            this.closeButton.destroy();
            this.zonePing(1000, 500);
            this.popupBG.visible = false;
          });
        this.continueButton.setScale(1);
        this.continueButton.setZ(2);
        this.closeButton = this.add
          .image(this.game.scale.width / 2 + 380, this.game.scale.height / 2 - 170, 'crossButton')
          .setScrollFactor(0)
          .setInteractive()
          .on('pointerup', () => {
            this.goalStageMessage.destroy();
            this.continueButton.destroy();
            this.closeButton.destroy();
            this.zonePing(1000, 500);
            this.popupBG.visible = false;
          });
        --this.goalStage;
        break;

      case 80:
        GAME_SPEEDS[MOVEMENT_SPEED] = 0;
        GAME_SPEEDS[ROTATION_SPEED] = 0;
        this.goalStageMessage = this.matter.add.sprite(
          window.game.scale.width / 2,
          window.game.scale.height / 2,
          '500meters',
        );
        this.popupBG.visible = true;
        this.goalStageMessage.setScale(1);
        this.goalStageMessage.setStatic(true);
        this.goalStageMessage.setSensor(true);
        this.continueButton = this.add
          .image(
            this.goalStageMessage.x,
            this.goalStageMessage.y + this.goalStageMessage.y / 5,
            'continueButton',
          )
          .setScrollFactor(0)
          .setInteractive()
          .on('pointerup', () => {
            this.goalStageMessage.destroy();
            this.continueButton.destroy();
            this.closeButton.destroy();
            this.zonePing(1000, 80);
            this.popupBG.visible = false;
          });
        this.continueButton.setScale(1);
        this.continueButton.setZ(2);
        this.closeButton = this.add
          .image(this.game.scale.width / 2 + 380, this.game.scale.height / 2 - 170, 'crossButton')
          .setScrollFactor(0)
          .setInteractive()
          .on('pointerup', () => {
            this.goalStageMessage.destroy();
            this.continueButton.destroy();
            this.closeButton.destroy();
            this.zonePing(1000, 80);
            this.popupBG.visible = false;
          });
        --this.goalStage;
        break;
    }
  }

  update(time: number, delta: number): void {
    this.player.update();
    this.zonesStaging();
    this.matter.overlap(this.player, [this.bottomBarrier, this.topBarrier], () => {
      this.zoneKnock();
    });
  }
}

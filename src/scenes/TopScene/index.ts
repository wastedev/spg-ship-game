import { GAME_SPEEDS, IS_MOBILE, MOVEMENT_SPEED, ROTATION_SPEED } from '../../constants';
import { Scene, GameObjects } from 'phaser';
import { Enemy, Player } from '../../entities';
import { UiScene } from '..';
import { timingSafeEqual } from 'crypto';
import { FIRST_SCENE, SCENE_HEALTH, SECOND_SCENE } from '../../helpers/index';
import { countReset } from 'console';

export class TopScene extends Scene {
  public player!: Player;
  private goalZone!: Phaser.Physics.Matter.Sprite;

  private icebergs: Enemy[] = [];
  private topBarrier!: MatterJS.BodyType;
  private bottomBarrier!: MatterJS.BodyType;
  private backgroundIcebergs!: GameObjects.Image;

  private goalStageMessage!: Phaser.Physics.Matter.Sprite;
  private continueButton!: GameObjects.Image;
  private closeButton!: GameObjects.Image;

  private goalText!: Phaser.GameObjects.Text;
  private playerInside: boolean = false;

  //game state
  private gameStarted: boolean = true;
  //game blur
  private popupBG!: GameObjects.Image;

  constructor() {
    super('top-scene');
  }
  protected getUI(): UiScene {
    return this.scene.get('ui-scene') as UiScene;
  }

  public getDamage(): void {
    GAME_SPEEDS[MOVEMENT_SPEED] = 0;
    GAME_SPEEDS[ROTATION_SPEED] = 0;
  }

  public continueGame(): void {
    GAME_SPEEDS[MOVEMENT_SPEED] = 1;
    GAME_SPEEDS[ROTATION_SPEED] = 0.35;
  }

  private stopPlayer(): void {
    GAME_SPEEDS[MOVEMENT_SPEED] = 0;
    GAME_SPEEDS[ROTATION_SPEED] = 0;
  }

  private nextScene(): void {
    this.continueButton.destroy();
    this.closeButton.destroy();
    this.goalStageMessage.destroy();
    this.sceneChange();
  }

  private loadTargetPopup(): void {
    const ui = this.getUI();
    ui.hideUI();
    this.popupBG.visible = true;
    this.goalStageMessage = this.matter.add.sprite(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      '1000meters',
    );
    this.goalStageMessage.setSensor(true);
    this.goalStageMessage.setDepth(51);
    this.continueButton = this.add
      .image(
        this.goalStageMessage.x,
        this.goalStageMessage.y + this.goalStageMessage.y / 6.5,
        'continueButton',
      )
      .setScrollFactor(0)
      .setInteractive({ cursor: 'pointer' })
      .on('pointerdown', () => {
        ui.showUI();
        this.nextScene();
      })
      .on('pointerout', () => {
        this.continueButton.setTexture('continueButton');
      })
      .on('pointerover', () => {
        this.continueButton.setTexture('continueButtonHover');
      });
    this.continueButton.setDepth(51);
    if (window.game.scale.width >= 3000) {
      this.continueButton.setPosition(this.continueButton.x, this.continueButton.y - 80);
    }
    this.closeButton = this.add
      .image(this.goalStageMessage.x + 380, this.goalStageMessage.y - 170, 'crossButton')
      .setInteractive({ cursor: 'pointer' })
      .setScrollFactor(0)
      .on('pointerdown', () => {
        ui.showUI();
        this.nextScene();
      });
    this.closeButton.setDepth(51);
  }

  create(): void {
    this.popupBG = this.add.image(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'popupBg',
    );
    this.popupBG.visible = false;
    this.popupBG.setAlpha(0.7);
    this.popupBG.scale = 3;
    this.popupBG.setDepth(50);
    // CREATE PLAYER SPRITE

    this.player = new Player(this.matter.world, 100, window.game.scale.height / 2, 'player-top');
    this.player.setDepth(49);

    SCENE_HEALTH[FIRST_SCENE] = this.player.getHealth();
    SCENE_HEALTH[SECOND_SCENE] = 3;
    // CREATE BACKGROUND SPRITE
    this.backgroundIcebergs = this.add.sprite(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'background-icebergs-top',
    );
    this.backgroundIcebergs.displayWidth = window.game.scale.width + 20;
    this.backgroundIcebergs.displayHeight = window.game.scale.height;
    this.backgroundIcebergs.setDepth(-1);

    // INITIALIZE ENEMIES SPRITES
    this.initInvisibleHitboxes();

    // CREATE GOAL ZONE
    this.goalZone = this.matter.add.sprite(
      window.game.scale.width - window.game.scale.width / 10,
      window.game.scale.height / 2,
      'goal-distance',
    );
    this.goalZone.setScale(0.4);
    this.goalZone.setDisplaySize(220, 50);
    this.goalZone.setStatic(true);
    this.goalZone.setSensor(true);
    this.goalZone.setDepth(-1);

    this.goalText = this.add.text(this.goalZone.x, this.goalZone.y, '1000', {
      fontSize: '25px',
      fontStyle: 'bold',
      color: 'white',
      fontFamily: 'Arial',
    });
    this.goalText.setOrigin(0.5);
    this.goalText.setDepth(0);

    this.initEnemies();
  }

  sceneChange(): void {
    this.scene.stop();
    this.scene.start('docking-scene');
  }

  initEnemies(): void {
    let count: number = 0;
    let _width1: number = 0;
    let _width2: number = 0;
    let multipleVal: number = 0;
    let iDivider: number = 0;
    if (IS_MOBILE) {
      count = 4;
      _width1 = 15;
      _width2 = 11;
      multipleVal = 2;
      iDivider = 1.1;
    } else {
      count = 6;
      _width1 = 10;
      _width2 = 11;
      multipleVal = 1.3;
      iDivider = 1.1;
    }
    for (let i = 1; i <= count; i++) {
      this.icebergs.push(
        new Enemy(
          this.matter.world,
          window.game.scale.width / _width1 +
            (window.game.scale.width / _width2) * multipleVal * (i / iDivider),
          window.game.scale.height / 4 + Math.floor(Math.random() * (window.game.scale.height / 2)),
          `icebergAnimation-${Math.floor(Math.random() * 3) + 1}`,
        ),
      );
    }
  }

  initInvisibleHitboxes() {
    this.topBarrier = this.matter.add.rectangle(
      window.game.scale.width / 2,
      window.game.scale.height / 6 / 2,
      window.game.scale.width,
      window.game.scale.height / 6,
    );
    this.topBarrier.isStatic = true;

    this.bottomBarrier = this.matter.add.rectangle(
      window.game.scale.width / 2,
      window.game.scale.height - window.game.scale.height / 6 / 2,
      window.game.scale.width,
      window.game.scale.height / 6,
    );
    this.bottomBarrier.isStatic = true;
  }

  private checkZone(): void {
    if (!this.playerInside) {
      if (
        this.player.x >= this.goalZone?.x &&
        this.player.y >= this.goalZone?.y - 10 &&
        this.player.y <= this.goalZone?.y + 10
      ) {
        if (this.player.angle <= 3 && this.player.angle >= -3) {
          this.playerInside = true;
          this.stopPlayer();
          setTimeout(() => {
            this.goalZone.visible = false;
          }, 1000);

          setTimeout(() => {
            this.goalZone.visible = true;
          }, 2000);

          setTimeout(() => {
            this.stopPlayer();
            this.goalZone.visible = false;
          }, 3000);

          setTimeout(() => {
            this.goalZone.visible = true;
          }, 4000);

          setTimeout(() => {
            this.loadTargetPopup();
          }, 5000);
        }
      }
    }
  }

  update(): void {
    if (this.player.getHealth() <= 0) {
      this.gameStarted = false;
      const ui = this.getUI();
      ui.gameLose();
    }

    if (this.player.x >= this.goalZone.x + 20) {
      console.log('you lose');
    }

    this.checkZone();

    if (this.gameStarted) {
      this.player.update();
      const ui = this.getUI();
      ui.setHealth(this.player.getHealth());

      if (this.icebergs.every((iceberg) => iceberg instanceof Enemy)) {
        this.icebergs.forEach((item) => item.update());
      }
    }

    if (this.player.x >= this.goalZone.x + 50) {
      // if you dont get the goalzone
      this.gameStarted = false;
      const ui = this.getUI();
      ui.gameLose();
    }

    this.matter.overlap(this.player, [this.topBarrier, this.bottomBarrier], () => {
      this.gameStarted = false;
      const ui = this.getUI();
      ui.gameLose();
    });
  }
}

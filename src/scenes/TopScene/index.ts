import { GAME_SPEEDS, MOVEMENT_SPEED, ROTATION_SPEED } from '../../constants';
import { Scene, GameObjects } from 'phaser';
import { Enemy, Player } from '../../entities';
import { UiScene } from '..';
import { timingSafeEqual } from 'crypto';

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

  private gameStarted: boolean = false;
  private popupBG!: GameObjects.Image;

  constructor() {
    super('top-scene');
  }

  protected getUI(): UiScene {
    return this.scene.get('ui-scene') as UiScene;
  }

  initTarget(): void {
    this.goalStageMessage = this.matter.add.sprite(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'docking-info',
    );
    this.goalStageMessage.setDepth(51);
    this.goalStageMessage.setScale(0.7);
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
        this.gameStarted = true;
        this.initEnemies();
        GAME_SPEEDS[MOVEMENT_SPEED] = 0.76;
        GAME_SPEEDS[ROTATION_SPEED] = 0.32;
        this.popupBG.visible = false;
      });
    this.continueButton.setScale(1);
    this.continueButton.setZ(2);
    this.continueButton.setDepth(51);
    this.closeButton = this.add
      .image(this.game.scale.width / 2 + 420, this.game.scale.height / 2 - 190, 'crossButton')
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerup', () => {
        this.goalStageMessage.destroy();
        this.continueButton.destroy();
        this.closeButton.destroy();
        this.gameStarted = true;
        this.initEnemies();
        GAME_SPEEDS[MOVEMENT_SPEED] = 0.76;
        GAME_SPEEDS[ROTATION_SPEED] = 0.32;
        this.popupBG.visible = false;
      });
    this.closeButton.setDepth(51);
    this.popupBG.visible = true;
  }

  create(): void {
    GAME_SPEEDS[MOVEMENT_SPEED] = 0;
    GAME_SPEEDS[ROTATION_SPEED] = 0;
    this.popupBG = this.add.image(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'popupBg',
    );
    this.popupBG.visible = false;
    this.popupBG.setAlpha(0.7);
    this.popupBG.setDepth(50);
    this.initTarget();
    // CREATE PLAYER SPRITE

    this.player = new Player(this.matter.world, 100, window.game.scale.height / 2, 'player-top');

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
      'goal-zone',
    );
    this.goalZone.setScale(0.4);
    this.goalZone.displayWidth = 210;
    this.goalZone.setStatic(true);
    this.goalZone.setSensor(true);
    this.goalZone.setDepth(-1);

    this.goalZone.setOnCollide((obj: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          GAME_SPEEDS[MOVEMENT_SPEED] -= 0.126;
          GAME_SPEEDS[ROTATION_SPEED] -= 0.053;
          console.log(GAME_SPEEDS[MOVEMENT_SPEED], GAME_SPEEDS[ROTATION_SPEED]);
        },
        repeat: 5,
        callbackScope: this,
      });

      setTimeout(() => {
        this.goalZone.visible = false;
      }, 7000);
      setTimeout(() => {
        this.goalZone.visible = true;
      }, 8000);
      setTimeout(() => {
        this.goalZone.visible = false;
      }, 9000);
      setTimeout(() => {
        this.goalZone.visible = true;
      }, 10000);
      setTimeout(() => {
        this.scene.stop();
        this.sceneChange();
      }, 11000);
    });
  }

  update(): void {
    if (this.player.getHealth() <= 0) {
      this.gameStarted = false;
      const ui = this.getUI();
      ui.restartGame(1);
    }

    if (this.gameStarted) {
      this.player.update();
      const ui = this.getUI();
      ui.setHealth(this.player.getHealth());

      if (this.icebergs.every((iceberg) => iceberg instanceof Enemy)) {
        this.icebergs.forEach((item) => item.update());
      }
    }

    if (this.player.x >= this.goalZone.x) {
      // if you dont get the goalzone
      this.gameStarted = false;
      const ui = this.getUI();
      ui.restartGame(1);
    }

    this.matter.overlap(this.player, [this.topBarrier, this.bottomBarrier], () => {
      this.gameStarted = false;
      const ui = this.getUI();
      ui.restartGame(1);
    });
  }

  sceneChange(): void {
    this.scene.start('docking-scene');
    this.scene.stop();
  }

  initEnemies(): void {
    for (let i = 1; i <= 6; i++) {
      this.icebergs.push(
        new Enemy(
          this.matter.world,
          (window.game.scale.width / 9) * 1.3 * (i / 1.1),
          window.game.scale.height / 4 + Math.floor(Math.random() * (window.game.scale.height / 2)),
          `icebergAnimation-${Math.floor(Math.random() * 3) + 1}`,
        ),
      );
    }
  }

  logging() {
    console.log('crush');
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
}

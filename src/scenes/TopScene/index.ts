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

  private zoneBorderTop!: MatterJS.BodyType;
  private zoneBorderBottom!: MatterJS.BodyType;

  private goalStageMessage!: Phaser.Physics.Matter.Sprite;
  private continueButton!: GameObjects.Image;
  private closeButton!: GameObjects.Image;

  private gameStarted: boolean = false;

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
        this.gameStarted = true;
        this.initEnemies();
        GAME_SPEEDS[MOVEMENT_SPEED] = 0.76;
        GAME_SPEEDS[ROTATION_SPEED] = 0.32;
      });
    this.continueButton.setScale(1);
    this.continueButton.setZ(2);
    this.closeButton = this.add
      .image(this.game.scale.width / 2 + 420, this.game.scale.height / 2 - 190, 'crossButton')
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerup', () => {
        this.goalStageMessage.destroy();
        this.continueButton.destroy();
        this.closeButton.destroy();
        GAME_SPEEDS[MOVEMENT_SPEED] = 0.76;
        GAME_SPEEDS[ROTATION_SPEED] = 0.32;
      });
  }

  create(): void {
    GAME_SPEEDS[MOVEMENT_SPEED] = 0;
    GAME_SPEEDS[ROTATION_SPEED] = 0;
    this.initTarget();
    // CREATE PLAYER SPRITE

    this.player = new Player(
      this.matter.world,
      window.game.scale.width / 10,
      window.game.scale.height / 2,
      'player-top',
    );

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
      this.initGoalZoneBorder();
      setTimeout(() => {
        this.sceneChange();
      }, 6000);
    });
  }

  update(): void {
    if (this.gameStarted) {
      this.player.update();
      const ui = this.getUI();
      ui.setHealth(this.player.getHealth());

      if (this.icebergs.every((iceberg) => iceberg instanceof Enemy)) {
        this.icebergs.forEach((item) => item.update());
      }
    }

    if (this.zoneBorderBottom && this.zoneBorderTop) {
      //demo logic for your stop in the goal zone for scene change
      this.matter.overlap(this.player, [this.zoneBorderTop, this.zoneBorderBottom], () => {
        window.windowProxy.post({
          finishGame3: JSON.stringify({
            win: false,
            lose: true,
            crashCount: 3,
            aimTries: 0,
          }),
        });
      });
    }

    if (this.player.x >= this.goalZone.x) {
      // if you dont get the goalzone
      window.windowProxy.post({
        finishGame3: JSON.stringify({
          win: false,
          lose: true,
          crashCount: 3,
          aimTries: 0,
        }),
      });
    }
  }

  sceneChange(): void {
    this.scene.start('docking-scene');
    this.scene.stop();
  }

  initGoalZoneBorder(): void {
    this.zoneBorderTop = this.matter.add.rectangle(this.goalZone.x, this.goalZone.y - 50, 220, 5);
    this.zoneBorderTop.isStatic = true;

    this.zoneBorderBottom = this.matter.add.rectangle(
      this.goalZone.x,
      this.goalZone.y + 50,
      220,
      5,
    );
    this.zoneBorderBottom.isStatic = true;
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

// if (this.goalZone.body) {
//   if (
//     this.player.x >= this.goalZone?.x - 50 &&
//     (this.player.y >= this.goalZone?.y - 30 || this.player.y <= this.goalZone?.y + 30) &&
//     !this.isBannerShowed
//   ) {
//     this.sceneChange();
//   }
// }

import { GAME_SPEEDS, MOVEMENT_SPEED, ROTATION_SPEED } from '../../constants';
import { Scene, GameObjects } from 'phaser';
import { Enemy, Player } from '../../entities';
import { UiScene } from '..';
import { timingSafeEqual } from 'crypto';

export class TopScene extends Scene {
  public player!: Player;
  private station!: Phaser.Physics.Matter.Image;
  private goalZone!: Phaser.Physics.Matter.Sprite;

  private icebergs: Enemy[] = [];
  private topBarrier!: MatterJS.BodyType;
  private bottomBarrier!: MatterJS.BodyType;
  private backgroundIcebergs!: GameObjects.Image;

  private popup!: GameObjects.Image;
  private continueButton!: GameObjects.Image;
  //testthings i shoud delete this after end
  private animated!: GameObjects.Image;

  constructor() {
    super('top-scene');
  }

  protected getUI(): UiScene {
    return this.scene.get('ui-scene') as UiScene;
  }

  create(): void {
    this.animated = this.add.image(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'sprIceberg-1',
    );
    //Animations
    this.anims.create({
      key: 'sprIceberg-1',
      frames: this.anims.generateFrameNumbers('sprIceberg-1', { start: 0, end: 6 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'sprIceberg-2',
      frames: this.anims.generateFrameNumbers('sprIceberg-2', { start: 0, end: 6 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'sprIceberg-3',
      frames: this.anims.generateFrameNumbers('sprIceberg-3', { start: 0, end: 6 }),
      frameRate: 10,
      repeat: -1,
    });

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
    this.initEnemies();
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

    this.goalZone.setOnCollide((obj: Phaser.Types.Physics.Matter.MatterCollisionData) => {});
  }

  update(): void {
    this.player.update();

    const ui = this.getUI();
    ui.setHealth(this.player.getHealth());

    if (this.icebergs.every((iceberg) => iceberg instanceof Enemy)) {
      this.icebergs.forEach((item) => item.update());
    }
    if (this.goalZone.body) {
      if (
        this.player.x >= this.goalZone?.x - 50 &&
        (this.player.y >= this.goalZone?.y - 30 || this.player.y <= this.goalZone?.y + 30)
      ) {
        GAME_SPEEDS[MOVEMENT_SPEED] = 0;
        GAME_SPEEDS[ROTATION_SPEED] = 0;
        this.popup = this.add.image(
          window.game.scale.width / 2,
          window.game.scale.height / 2,
          'dockingPopup',
        );
        this.popup.setScale(0.7);
        this.continueButton = this.add
          .image(this.popup.x, this.popup.y + this.popup.y / 3, 'continueButton')
          .setScrollFactor(0)
          .setInteractive()
          .on('pointerup', () => {
            GAME_SPEEDS[MOVEMENT_SPEED] = 0.39;
            GAME_SPEEDS[ROTATION_SPEED] = 0.16;
            this.popup.destroy();
            this.continueButton.destroy();
            this.scene.start('docking-scene');
            this.scene.stop();
          });
      }
    }
  }

  initEnemies(): void {
    for (let i = 1; i <= 5; i++) {
      this.icebergs.push(
        new Enemy(
          this.matter.world,
          (window.game.scale.width / 8) * 1.5 * (i / 1.13),
          window.game.scale.height / 4 + Math.floor(Math.random() * (window.game.scale.height / 2)),
          `sprIceberg-${Math.floor(Math.random() * 3) + 1}`,
        ),
      );
    }
  }

  initInvisibleHitboxes() {
    this.topBarrier = this.matter.add.rectangle(
      window.game.scale.width / 2,
      0 + window.game.scale.height / 6 / 2,
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

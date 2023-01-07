import { GAME_SPEEDS, MOVEMENT_SPEED, ROTATION_SPEED } from '../../constants';
import { Scene, GameObjects } from 'phaser';
import { Enemy, Player } from '../../entities';
import { UiScene } from '..';

export class TopScene extends Scene {
  public player!: Player;
  private station!: Phaser.Physics.Matter.Image;
  private goalZone!: Phaser.Physics.Matter.Sprite;

  private icebergs: Enemy[] = [];
  private topBarrier!: MatterJS.BodyType;
  private bottomBarrier!: MatterJS.BodyType;
  private backgroundIcebergs!: GameObjects.Image;

  constructor() {
    super('top-scene');
  }

  protected getUI(): UiScene {
    return this.scene.get('ui-scene') as UiScene;
  }

  create(): void {
    //UI CHANGES

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

    this.goalZone.setOnCollide(() => {
      // GAME_SPEEDS[MOVEMENT_SPEED] = 0.39;
      // GAME_SPEEDS[ROTATION_SPEED] = 0.16;
      // this.cameras.main.pan(this.player.x, this.player.y, 1500);
      // this.cameras.main.zoomTo(1.5, 1500);
    });

    // CREATE CAMERA
    // this.cameras.main.setBounds(0, 0, window.game.scale.width, window.game.scale.height);
    // this.cameras.main.setZoom(1);
    // this.cameras.main.centerOn(0, 0);
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
        this.scene.start('docking-scene');
        this.scene.stop();
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
          `iceberg-${Math.floor(Math.random() * 3) + 1}`,
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

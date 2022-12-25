import { GAME_SPEEDS, MOVEMENT_SPEED, ROTATION_SPEED } from './../../constants';
import { Scene, GameObjects } from 'phaser';
import { Enemy, Player } from '../../entities';

export class TopScene extends Scene {
  public player!: Player;
  private station!: Phaser.Physics.Matter.Image;
  private goalZone!: Phaser.Physics.Matter.Sprite;

  private icebergs!: Enemy[];
  private topBarrier!: MatterJS.BodyType;
  private bottomBarrier!: MatterJS.BodyType;
  private backgroundIcebergs!: GameObjects.Image;

  constructor() {
    super('top-scene');
  }

  create(): void {
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

    // CREATE STATION SPRITE
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

    // INITIALIZE ENEMIES SPRITES
    this.initEnemies();
    this.initInvisibleHitboxes();

    // CREATE GOAL ZONE
    this.goalZone = this.matter.add.sprite(
      window.game.scale.width - window.game.scale.width / 4,
      window.game.scale.height / 2,
      'goal-zone',
    );
    this.goalZone.setScale(0.4);
    this.goalZone.displayWidth = 210;
    this.goalZone.setStatic(true);
    this.goalZone.setSensor(true);
    this.goalZone.setDepth(-1);

    this.goalZone.setOnCollide(() => {
      GAME_SPEEDS[MOVEMENT_SPEED] = GAME_SPEEDS[MOVEMENT_SPEED] / 3;
      GAME_SPEEDS[ROTATION_SPEED] = GAME_SPEEDS[ROTATION_SPEED] / 2;

      this.cameras.main.pan(this.player.x, this.player.y, 1500);
      this.cameras.main.zoomTo(1.5, 1500);
    });

    // CREATE CAMERA
    this.cameras.main.setBounds(0, 0, window.game.scale.width, window.game.scale.height);
    this.cameras.main.setZoom(1);
    this.cameras.main.centerOn(0, 0);
  }

  update(): void {
    this.player.update();
  }

  initEnemies(): void {
    this.icebergs = new Array(7);

    for (let i = 1; i <= 3; i++) {
      this.icebergs.push(
        new Enemy(
          this.matter.world,
          (window.game.scale.width / 8) * 2 * (i / 1.16),
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

import { Scene, GameObjects } from 'phaser';
import { Enemy, Player } from '../../entities';

export class TopScene extends Scene {
  public player!: Player;
  private station!: Phaser.Physics.Matter.Image;

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
      window.game.scale.height / 2,
      'station-top',
      undefined,
      { isStatic: true },
    );
    this.station.scale = window.game.scale.height / window.game.scale.width;
    this.station.setRectangle(
      (this.station.width / 2) * this.station.scale,
      window.game.scale.height,
    );
    this.station.setStatic(true);

    // INITIALIZE ENEMIES SPRITES
    this.initEnemies();
    this.initInvisibleHitboxes();
  }

  update(): void {
    this.player.update();
  }

  initEnemies(): void {
    this.icebergs = new Array(7);

    for (let i = 1; i <= Math.floor(window.innerWidth / window.innerHeight) + 1; i++) {
      this.icebergs.push(
        new Enemy(
          this.matter.world,
          window.game.scale.width / 8 + (window.game.scale.width / 4) * (i / 1.5),
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

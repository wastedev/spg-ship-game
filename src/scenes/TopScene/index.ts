import { Scene, GameObjects } from 'phaser';
import { Enemy, Player } from '../../entities';

export class TopScene extends Scene {
  private player!: GameObjects.Sprite;
  private station!: GameObjects.Sprite;

  private icebergs!: Enemy[];

  private backgroundIcebergs!: GameObjects.Image;

  constructor() {
    super('top-scene');
  }

  create(): void {
    // CREATE PLAYER SPRITE
    this.player = new Player(
      this,
      window.game.scale.width / 10,
      window.game.scale.height / 2,
      'player-top',
    );
    this.player.scale = 0.3;

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
    this.station = this.add.sprite(
      window.game.scale.width - 70,
      window.game.scale.height / 2,
      'station-top',
    );
    this.station.scale = 0.68;

    // INITIALIZE ENEMIES SPRITES
    this.initEnemies();
  }

  update(): void {
    this.player.update();
  }

  initEnemies(): void {
    this.icebergs = new Array(7);

    for (let i = 1; i <= Math.floor(window.innerWidth / window.innerHeight) + 1; i++) {
      this.icebergs.push(
        new Enemy(
          this,
          window.game.scale.width / 8 + (window.game.scale.width / 4) * (i / 1.5),
          window.game.scale.height / 4 + Math.floor(Math.random() * (window.game.scale.height / 2)),
          `iceberg-${Math.floor(Math.random() * 3) + 1}`,
        ),
      );
    }

    this.physics.add.overlap(this.player, this.icebergs, () => console.log('END'));
  }
}

import { Scene, GameObjects, Physics } from 'phaser';
import { Player } from '../../entities';

export class TopScene extends Scene {
  private player!: GameObjects.Sprite;
  private station!: GameObjects.Sprite;

  private icebergs!: any[];

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

    // CREATE STATION SPRITE
    this.station = this.add.sprite(
      window.game.scale.width - 70,
      window.game.scale.height / 2,
      'station-top',
    );
    this.station.scale = 0.68;

    // INITIALIZE ENEMIES SPRITES
    this.initEnemies();
    this.physics.add.overlap(this.player, this.icebergs, () => console.log('END'));
  }

  initEnemies(): void {
    this.icebergs = new Array(7);

    for (let i = 1; i < 4; i++) {
      var tempSprite = this.physics.add.image(
        i > 2 ? 750 * i - 390 * i : i === 2 ? 750 : 500,
        200 + Math.floor(Math.random() * (window.game.scale.height - 400)),
        `iceberg-${Math.floor(Math.random() * 3) + 1}`,
      );
      tempSprite.rotation = Math.PI / 2;
      tempSprite.scale = 0.5;
      tempSprite.setCircle(tempSprite.height / 2 + 20, -30, -30);

      this.icebergs.push(tempSprite);
    }
  }
}

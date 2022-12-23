import { Scene, GameObjects, Input } from 'phaser';

export class SideScene extends Scene {
  private backgroundSide!: GameObjects.Image;
  private playerSide!: GameObjects.Sprite;
  private oilStationSide!: GameObjects.Sprite;
  private bar!: GameObjects.Image;
  private barCursor!: GameObjects.Sprite;
  private keySpace!: Input.Keyboard.Key;
  private rocket!: GameObjects.Sprite;
  constructor() {
    super('side-scene');
  }

  create(): void {
    this.backgroundSide = this.add.image(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'background-side',
    );
    this.backgroundSide.displayWidth = window.game.scale.width + 20;
    this.backgroundSide.displayHeight = window.game.scale.height;
    this.backgroundSide.setDepth(-1);

    this.playerSide = this.add.sprite(
      window.game.scale.width / 2 + 100,
      window.game.scale.height / 2 + 100,
      'player-side',
    );
    this.playerSide.scale = 1;

    this.oilStationSide = this.add.sprite(
      window.game.scale.width / 10,
      window.game.scale.height / 2 - 100,
      'station-side',
    );
    this.oilStationSide.scale = 1;

    this.bar = this.add.image(window.game.scale.width / 2, window.game.scale.height / 10, 'bar');
    this.bar.scale = 0.5;

    this.barCursor = this.physics.add.sprite(this.bar.x, this.bar.y - 35, 'bar-cursor');
    this.barCursor.scale = 0.5;
    this.barCursor.body.velocity.x = 500;

    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  pointerMovement(): void {
    if (this.keySpace.isDown) {
      if (this.barCursor.x >= this.bar.x + 40) {
        console.log('success');
        this.rocket = this.add.sprite(
          window.game.scale.width / 2,
          window.game.scale.height / 2,
          'rocketSpr',
        );
        this.rocket.scale = 0.5;
        this.anims.create({
          key: 'rocketConnect',
          frameRate: 15,
          frames: this.anims.generateFrameNumbers('rocketSpr', {
            start: 0,
            end: 7,
          }),
          repeat: -1,
        });
        this.rocket.play('rocketConnect');
      } else {
        console.log('fail');
      }
    }
    if (this.barCursor.x <= this.bar.x - 120) {
      this.barCursor.body.velocity.x = 500;
    } else if (this.barCursor.x >= this.bar.x + 120) {
      this.barCursor.body.velocity.x = -500;
    }
  }

  update(): void {
    this.pointerMovement();
  }
}

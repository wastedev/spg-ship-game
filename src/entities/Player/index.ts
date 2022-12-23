import { Physics, Input } from 'phaser';

export class Player extends Physics.Arcade.Sprite {
  protected health: number = 3;
  private keyW!: Input.Keyboard.Key;
  private keyS!: Input.Keyboard.Key;
  private keyUp!: Input.Keyboard.Key;
  private keyDown!: Input.Keyboard.Key;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    // KEYS
    this.keyW = this.scene.input.keyboard.addKey('W');
    this.keyS = this.scene.input.keyboard.addKey('S');
    this.keyUp = this.scene.input.keyboard.addKey(38);
    this.keyDown = this.scene.input.keyboard.addKey(40);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.getBody().setCollideWorldBounds(true);
  }

  update(): void {
    this.getBody().setVelocity(0);
    this.rotation = 0;

    if (this.keyW?.isDown) {
      this.getBody().velocity.y = -40;
      this.rotation = -(1 / 6) * Math.PI;
    }

    if (this.keyS?.isDown) {
      this.getBody().velocity.y = 40;
      this.rotation = (1 / 6) * Math.PI;
    }

    if (this.keyUp?.isDown) {
      this.getBody().velocity.y = -40;
      this.rotation = -(1 / 6) * Math.PI;
    }

    if (this.keyDown?.isDown) {
      this.getBody().velocity.y = 40;
      this.rotation = (1 / 6) * Math.PI;
    }

    this.getBody().setVelocityX(50);
  }

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body;
  }
}

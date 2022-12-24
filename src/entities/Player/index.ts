import { Input } from 'phaser';

export class Player extends Phaser.Physics.Matter.Image {
  protected health: number = 3;
  private keyW!: Input.Keyboard.Key;
  private keyS!: Input.Keyboard.Key;
  private keyUp!: Input.Keyboard.Key;
  private keyDown!: Input.Keyboard.Key;
  public duration!: string;

  constructor(
    world: Phaser.Physics.Matter.World,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
  ) {
    super(world, x, y, texture, frame);

    // KEYS
    this.keyW = this.world.scene.input.keyboard.addKey('W');
    this.keyS = this.world.scene.input.keyboard.addKey('S');
    this.keyUp = this.world.scene.input.keyboard.addKey(38);
    this.keyDown = this.world.scene.input.keyboard.addKey(40);

    this.setScale(0.26);
    this.setRectangle(this.width * this.scale - 32, this.height * this.scale - 32);

    world.scene.add.existing(this);
  }

  updateByTarget(_duration: string): void {
    this.duration = _duration;
  }

  update(): void {
    if (this.keyW?.isDown) {
      this.setVelocityY(-0.32);
      if (this.angle >= -32) {
        this.setAngle(this.angle - 0.16);
      }
    }

    if (this.keyS?.isDown) {
      this.setVelocityY(0.32);
      if (this.angle <= 32) {
        this.setAngle(this.angle + 0.16);
      }
    }

    if (this.keyUp?.isDown) {
      this.setVelocityY(-0.32);
      if (this.angle >= -32) {
        this.setAngle(this.angle - 0.16);
      }
    }

    if (this.keyDown?.isDown) {
      this.setVelocityY(0.32);
      if (this.angle <= 32) {
        this.setAngle(this.angle + 0.16);
      }
    }

   if (!this.keyW?.isDown && !this.keyS?.isDown && !this.keyUp?.isDown && !this.keyDown?.isDown) {
      if (this.angle === 0) {
        return;
      } else {
        if (this.angle < 0) {
          this.setAngle(this.angle + 0.16);
        } else {
          this.setAngle(this.angle - 0.16);
        }
      }
    }

    switch (this.duration) {
      case 'down':
              this.setVelocityY(0.32);
      if (this.angle <= 32) {
        this.setAngle(this.angle + 0.16);
      }
        break;
      case 'up':
      this.setVelocityY(-0.32);
      if (this.angle >= -32) {
        this.setAngle(this.angle - 0.16);
      }
        break;
      case 'none':
              this.setVelocityY(0);
        break;
    }
    
        this.setVelocityX(0.76);
  }
}

import { Input } from 'phaser';

export enum Duration {
  Up = 'UP',
  Down = 'DOWN',
  None = 'NONE',
}

export class Player extends Phaser.Physics.Matter.Image {
  public duration: Duration = Duration.None;
  protected health: number = 3;

  private keyW!: Input.Keyboard.Key;
  private keyS!: Input.Keyboard.Key;
  private keyUp!: Input.Keyboard.Key;
  private keyDown!: Input.Keyboard.Key;

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

  public updateByTarget(_duration: Duration): void {
    this.duration = _duration;
  }

  private moveUp(): void {
    this.setVelocityY(-0.32);
    if (this.angle >= -32) {
      this.setAngle(this.angle - 0.16);
    }
  }

  private moveDown(): void {
    this.setVelocityY(0.32);
    if (this.angle <= 32) {
      this.setAngle(this.angle + 0.16);
    }
  }

  update(): void {
    const movementDuration: Duration = this.duration;

    if (this.keyW?.isDown || this.keyS?.isDown || this.keyUp?.isDown || this.keyDown?.isDown) {
      if (this.keyW?.isDown) {
        this.moveUp();
      }

      if (this.keyS?.isDown) {
        this.moveDown();
      }

      if (this.keyUp?.isDown) {
        this.moveUp();
      }

      if (this.keyDown?.isDown) {
        this.moveDown();
      }
    } else {
      if (movementDuration === Duration.Up) {
        this.moveUp();
      }

      if (movementDuration === Duration.Down) {
        this.moveDown();
      }
    }

    this.setVelocityX(0.76);

    if (
      !this.keyW?.isDown &&
      !this.keyS?.isDown &&
      !this.keyUp?.isDown &&
      !this.keyDown?.isDown &&
      movementDuration === Duration.None
    ) {
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
  }
}

import { Input } from 'phaser';
import { GAME_SPEEDS, MOVEMENT_SPEED, ROTATION_SPEED } from '../../constants';
import { Enemy } from '../Enemy';
import { FIRST_SCENE, SCENE_HEALTH } from '../../helpers';

export enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  None = 'NONE',
}

export class Player extends Phaser.Physics.Matter.Image {
  public direction: Direction = Direction.None;
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
    this.setOrigin(0, 0.5);
    this.setRectangle(this.width * this.scale - 32, this.height * this.scale - 32);

    this.setOnCollide((collideData: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      const { bodyA, bodyB } = collideData;

      if (!bodyB.gameObject) return;

      if (bodyB.gameObject instanceof Enemy) {
        this.getDamage();

        this.setTint(0xff0000);
        setTimeout(() => {
          this.setTint(0xffffff);
        }, 123);

        bodyB.gameObject.destroy();
      }

      if (bodyB.gameObject instanceof Phaser.Physics.Matter.Image) {
        console.log('GAME_OVER');
        window.windowProxy.post({
          finishGame3: JSON.stringify({
            win: false,
            lose: true,
            crashCount: 3 - this.health,
            aimTries: 0,
          }),
        });
      }
    });

    this.world.scene.add.existing(this);
  }

  public getHealth(): number {
    return this.health;
  }

  public updateByTarget(_duration: Direction): void {
    this.direction = _duration;
  }

  private moveUp(): void {
    this.setVelocityY(-GAME_SPEEDS[MOVEMENT_SPEED]);
    if (this.angle >= -32) {
      this.setAngle(this.angle - GAME_SPEEDS[ROTATION_SPEED]);
    }
  }

  private moveDown(): void {
    this.setVelocityY(GAME_SPEEDS[MOVEMENT_SPEED]);
    if (this.angle <= 32) {
      this.setAngle(this.angle + GAME_SPEEDS[ROTATION_SPEED]);
    }
  }

  public getDamage(): void {
    if (this.health > 1) {
      --this.health;
      --SCENE_HEALTH[FIRST_SCENE];
    } else {
      --this.health;
      --SCENE_HEALTH[FIRST_SCENE];

      console.log('GAME_OVER');
      window.windowProxy.post({
        finishGame3: JSON.stringify({
          win: false,
          lose: true,
          crashCount: 3 - this.health,
          aimTries: 0,
        }),
      });
    }
  }

  update(): void {
    const movementDuration: Direction = this.direction;

    if (this.keyW?.isDown) {
      this.moveUp();
    } else if (this.keyS?.isDown) {
      this.moveDown();
    } else if (this.keyUp?.isDown) {
      this.moveUp();
    } else if (this.keyDown?.isDown) {
      this.moveDown();
    } else if (movementDuration === Direction.Up) {
      this.moveUp();
    } else if (movementDuration === Direction.Down) {
      this.moveDown();
    } else {
      this.setVelocityY(GAME_SPEEDS[ROTATION_SPEED]);
    }

    this.setVelocityX(GAME_SPEEDS[MOVEMENT_SPEED]);

    if (
      !this.keyW?.isDown &&
      !this.keyS?.isDown &&
      !this.keyUp?.isDown &&
      !this.keyDown?.isDown &&
      movementDuration === Direction.None
    ) {
      if (this.angle === 0) {
        return;
      } else {
        if (this.angle < 0) {
          this.setAngle(this.angle + GAME_SPEEDS[ROTATION_SPEED]);
        } else {
          this.setAngle(this.angle - GAME_SPEEDS[ROTATION_SPEED]);
        }
      }
    }
  }
}

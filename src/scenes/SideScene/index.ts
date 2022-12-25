import { Scene, GameObjects, Input } from 'phaser';

export class SideScene extends Scene {
  private backgroundSide!: GameObjects.Image;
  private playerSide!: GameObjects.Sprite;
  private oilStationSide!: GameObjects.Sprite;
  private bar!: GameObjects.Image;
  private barCursor!: Phaser.Physics.Matter.Sprite;
  private keySpace!: Input.Keyboard.Key;
  private rocket!: Phaser.Physics.Matter.Image;
  private graphics!: Phaser.GameObjects.Graphics;
  private line!: Phaser.Geom.Line;
  private t!: number;
  private duration!: number;
  private curve!: Phaser.Curves.Spline;
  private health!: number;
  private points!: Phaser.Math.Vector2[];
  private rocketOnPoint!: boolean;
  constructor() {
    super('side-scene');
  }

  getLinePoints(line: any): Phaser.Math.Vector2[] {
    return line.getPoints(3) as Phaser.Math.Vector2[];
  }

  create(): void {
    this.health = 3;
    this.rocketOnPoint = false;
    this.duration = 1500;
    this.backgroundSide = this.add.image(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'background-side',
    );
    this.backgroundSide.displayWidth = window.game.scale.width + 20;
    this.backgroundSide.displayHeight = window.game.scale.height;
    this.backgroundSide.setDepth(-1);

    this.playerSide = this.add.sprite(
      window.game.scale.width / 2 + window.game.scale.width / 10,
      window.game.scale.height / 2 + 100,
      'player-side',
    );
    this.playerSide.scale = 1;
    this.playerSide.setDepth(1);

    this.oilStationSide = this.add.sprite(
      window.game.scale.width / 10,
      window.game.scale.height / 2 - 100,
      'station-side',
    );
    this.oilStationSide.scale = 1;

    this.bar = this.add.image(window.game.scale.width / 2, window.game.scale.height / 10, 'bar');
    this.bar.scale = 0.5;

    this.barCursor = this.matter.add.sprite(this.bar.x, this.bar.y - 35, 'bar-cursor');
    this.barCursor.setScale(0.5);
    this.barCursor.setVelocityX(10);

    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.rocket = this.matter.add.image(
      this.oilStationSide.x + this.oilStationSide.x / 10,
      this.oilStationSide.y + this.oilStationSide.y / 5,
      'rocket',
    );
    this.rocket.setScale(0.2);
    this.rocket.setFriction(0);
    this.rocket.setFrictionAir(0);
    this.rocket.setBounce(0);
    // this.rocket.setVisible(false);

    this.graphics = this.add.graphics();
    this.line = new Phaser.Geom.Line(
      this.rocket.x,
      this.rocket.y,
      this.playerSide.x - 100,
      this.playerSide.y + 100,
    );

    this.points = this.getLinePoints(this.line);
    this.points[1].y = this.points[1].y - 100;

    this.curve = new Phaser.Curves.Spline(this.points);
    this.graphics.lineStyle(1, 0x00000, 0);
    this.curve.draw(this.graphics, 64);

    this.t = -1;
  }

  pointerMovement(): void {
    if (this.health != 0) {
      if (this.keySpace.isDown) {
        console.log('сработало' + this.health);
        if (this.barCursor.x >= this.bar.x + 40) {
          this.t = 0;
        } else {
          --this.health;
        }
      }
    }
    if (this.barCursor.x <= this.bar.x - 120) {
      this.barCursor.setVelocityX(8);
    } else if (this.barCursor.x >= this.bar.x + 120) {
      this.barCursor.setVelocityX(-8);
    }
  }

  update(time: any, delta: any): void {
    this.pointerMovement();
    if (this.t === -1) {
      return;
    }
    this.t += delta;
    if (this.t >= this.duration) {
      this.rocket.setVelocity(0, 0);
    } else {
      this.rocket.angle += 1;
      var d = this.t / this.duration;
      var p = this.curve.getPoint(d);
      this.rocket.setPosition(p.x, p.y);
    }

    if (this.rocketOnPoint === false) {
      if (this.rocket.x >= this.points[2].x - 5) {
        this.rocketOnPoint = true;
        this.oilStationSide.destroy();
        this.oilStationSide = this.add.sprite(
          window.game.scale.width / 5,
          window.game.scale.height / 2 - 60,
          'station-side-connected',
        );
      }
    }
  }
}

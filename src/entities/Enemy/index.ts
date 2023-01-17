export class Enemy extends Phaser.Physics.Matter.Sprite {
  shaking!: number;
  yPos!: number;
  constructor(
    world: Phaser.Physics.Matter.World,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
  ) {
    super(world, x, y, texture, frame);

    setInterval(() => this.animation(), 1000);

    if (texture == 'icebergAnimation-1') {
      this.anims.create({
        key: 'icebergAnimation-1',
        frames: this.anims.generateFrameNumbers('sprIceberg-1', { start: 0, end: 6 }),
        frameRate: 7,
        repeat: -1,
      });
    }

    if (texture == 'icebergAnimation-2') {
      this.anims.create({
        key: 'icebergAnimation-2',
        frames: this.anims.generateFrameNumbers('sprIceberg-2', { start: 0, end: 6 }),
        frameRate: 7,
        repeat: -1,
      });
    }

    if (texture == 'icebergAnimation-3') {
      this.anims.create({
        key: 'icebergAnimation-3',
        frames: this.anims.generateFrameNumbers('sprIceberg-3', { start: 0, end: 6 }),
        frameRate: 7,
        repeat: -1,
      });
    }

    this.setCircle(75);
    this.setSensor(true);
    this.play(texture);
    world.scene.add.existing(this);
  }

  animation(): void {
    if (this.body) {
      this.shaking = Math.random();
      const dir = Math.random();
      if (dir >= 0.5) this.setVelocityY(-this.shaking);
      else this.setVelocityY(this.shaking);
    }
  }

  update(): void {
    if (this.visible == false) {
      this.destroy();
    } else {
      if (!this.body.gameObject) return;
    }
  }
}

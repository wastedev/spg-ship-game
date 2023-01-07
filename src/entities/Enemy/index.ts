export class Enemy extends Phaser.Physics.Matter.Image {
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
    this.setScale(0.5);
    this.setCircle((this.height * this.scale) / 2 - 20);
    this.setAngle(90);
    // this.setStatic(true);

    this.shaking = Math.random();
    this.yPos = this.body.position.y;
    this.setVelocityY(this.shaking);

    world.scene.add.existing(this);
  }

  update(): void {
    if (this.visible == false) {
      this.destroy();
    } else {
      if (!this.body.gameObject) return;
      if (this.y >= this.yPos + 20) {
        this.setVelocityY(-this.shaking);
      } else if (this.y <= this.yPos - 20) {
        this.setVelocityY(this.shaking);
      }
    }
  }
}

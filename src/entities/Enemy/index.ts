export class Enemy extends Phaser.Physics.Matter.Image {
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
    this.setAngle(Math.floor(Math.random() * 180) + 1);
    this.setStatic(true);

    world.scene.add.existing(this);
  }
}

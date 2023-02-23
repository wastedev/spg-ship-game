import { GameObjects, Scene } from 'phaser';

export class BannerScene extends Scene {
  private bannerBackground!: GameObjects.Image;
  private banner!: GameObjects.Image;
  private bannerStartButton!: GameObjects.Image;

  constructor() {
    super('banner-scene');
  }

  create(): void {
    this.bannerBackground = this.add.image(0, 0, 'background-image');
    this.bannerBackground.setScale(1);
    this.bannerBackground.setOrigin(0);
    this.banner = this.add.image(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'banner-landscape',
    );

    this.bannerStartButton = this.add
      .image(
        this.banner.x - this.banner.x / 1.5,
        window.game.scale.height / 3 + window.game.scale.height / 2.7,
        'bannerStartBtn',
      )
      .setInteractive()
      .on('pointerup', () => {
        this.scene.start('side-scene');
        this.scene.start('ui-scene');
      });
    this.bannerStartButton.setScale(0.7);

    ///////////

    // this.animation = this.add.sprite(
    //   window.game.scale.width / 2,
    //   window.game.scale.height / 2,
    //   'sprIceberg-1',
    // );
    // this.animation.setScale(2);
    // this.animation.play('icebergAnimation-2');
  }
}

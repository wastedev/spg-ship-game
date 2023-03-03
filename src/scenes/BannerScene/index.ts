import { GameObjects, Scene } from 'phaser';

export class BannerScene extends Scene {
  private bannerBackground!: GameObjects.Image;
  private banner!: GameObjects.Image;
  private bannerStartButton!: GameObjects.Image;
  private bannerText!: GameObjects.Image;

  constructor() {
    super('banner-scene');
  }

  create(): void {
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.banner = this.add.image(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'banner-image',
    );
    this.banner.setDisplaySize(width, height);
    console.log(width, height);

    this.bannerText = this.add.image(
      this.game.scale.width / 2 - 220,
      this.game.scale.height / 2 - 80,
      'banner-text',
    );

    this.bannerText.setDisplaySize(width / 2, height / 2);

    this.bannerStartButton = this.add
      .image(
        this.game.scale.width / 2 - this.game.scale.width / 3.15,
        window.game.scale.height / 3 + window.game.scale.height / 2,
        'bannerStartBtn',
      )
      .setInteractive()
      .on('pointerup', () => {
        this.scene.start('top-scene');
        this.scene.start('ui-scene');
      });

    this.bannerStartButton.setScale(1);

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

import { GameObjects, Scene } from 'phaser';
import { IS_MOBILE } from './../../constants/index';
export class BannerScene extends Scene {
  private banner!: GameObjects.Image;
  private bannerStartButton!: GameObjects.Image;
  private bannerText!: GameObjects.Image;

  constructor() {
    super('banner-scene');
  }

  create(): void {
    this.banner = this.add.image(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'banner-image',
    );
    this.banner.setDisplaySize(window.game.scale.width, window.game.scale.height);

    this.bannerText = this.add.image(
      window.game.scale.width / 2 - window.game.scale.width / 5,
      window.game.scale.height / 2 - window.game.scale.height / 15,
      'banner-text',
    );
    this.bannerText.setOrigin(0.5);

    this.bannerStartButton = this.add
      .image(
        this.bannerText.x - this.bannerText.x / 1.8,
        this.bannerText.y + this.bannerText.y / 1.5,
        'bannerStartBtn',
      )
      .setInteractive({ cursor: 'pointer' })
      .on('pointerup', () => {
        this.scene.start('top-scene');
        this.scene.start('ui-scene');
      })
      .on('pointerover', () => {
        this.bannerStartButton.setTexture('bannerStartBtnHover');
      })
      .on('pointerout', () => {
        this.bannerStartButton.setTexture('bannerStartBtn');
      });

    if (!IS_MOBILE) {
      let width = window.innerWidth;
      let height = window.innerHeight;
      this.banner.setDisplaySize(width, height);
      this.bannerText.setDisplaySize(width / 2.3, height / 2.3);
      this.bannerStartButton.setDisplaySize(width / 10, height / 15);
    }

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

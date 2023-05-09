import { GameObjects, Scene } from 'phaser';
import { IS_MOBILE } from './../../constants/index';
export class BannerScene extends Scene {
  private banner!: GameObjects.Image;
  private bannerImgMobile!: GameObjects.Image;
  private bannerImg!: GameObjects.Image;
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
      window.game.scale.width / 2 - window.game.scale.width / 5.75,
      window.game.scale.height / 2 - window.game.scale.height / 15,
      'banner-text',
    );
    this.bannerText.setOrigin(0.5);

    this.bannerStartButton = this.add
      .image(
        this.bannerText.x - this.bannerText.width / 2,
        this.bannerText.y + this.bannerText.height / 2 + 30,
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
    this.bannerStartButton.setOrigin(0);

    if (!IS_MOBILE) {
      let width = window.innerWidth;
      let height = window.innerHeight;
      this.banner.setDisplaySize(width, height);
      this.bannerText.setDisplaySize(width / 2.3, height / 2.3);
      this.bannerStartButton.setDisplaySize(width / 10, height / 15);
      this.bannerStartButton.setOrigin(2.2, -4);
      this.bannerStartButton.setPosition(this.bannerText.x, this.bannerText.y);
    } else {
      let width = window.innerWidth;
      let height = window.innerHeight;
      //
      this.banner.destroy();
      //
      this.banner = this.add.image(
        window.game.scale.width / 2,
        window.game.scale.height / 2,
        'banner-image-mobile',
      );
      this.banner.setDisplaySize(window.game.scale.width, window.game.scale.height);
      //
      // this.bannerImgMobile = this.add.image(
      //   window.game.scale.width / 2,
      //   window.game.scale.height / 2,
      //   'mobile-pic1',
      // );
      // this.bannerImgMobile.setScale(3);
      //
      this.bannerText.destroy();
      //
      this.bannerText = this.add.image(
        window.game.scale.width / 2 - window.game.scale.width / 5,
        window.game.scale.height / 2 - window.game.scale.height / 15,
        'banner-text',
      );
      this.bannerText.setOrigin(0.5);
      this.bannerText.setDisplaySize(this.game.scale.width / 2, this.game.scale.height / 2);
      this.bannerText.setPosition(this.bannerText.x, this.banner.y + 25);
      //
      //тут все перепробовал
      this.bannerStartButton.destroy();
      //
      this.bannerStartButton = this.add
        .image(35, this.bannerText.y + this.bannerText.height / 1.5, 'bannerStartBtn')
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
      this.bannerStartButton.setDisplaySize(width / 4, height / 6);
      this.bannerStartButton.setOrigin(-0.35);
    }
  }
}

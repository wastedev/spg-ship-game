import { GameObjects, Scene } from 'phaser';

export class BannerScene extends Scene {
  private bannerBackground!: GameObjects.Image;
  private bannerStartButton!: GameObjects.Image;
  constructor() {
    super('banner-scene');
  }

  create(): void {
    this.bannerBackground = this.add.image(0, 0, 'background-banner');
    this.bannerBackground.setScale(1);
    this.bannerBackground.setOrigin(0);
    this.bannerStartButton = this.add
      .image(
        window.game.scale.width / 2 - window.game.scale.width / 2.63,
        window.game.scale.height / 2 + window.game.scale.height / 3,
        'bannerStartBtn',
      )
      .setInteractive()
      .on('pointerup', () => {
        this.scene.start('top-scene');
        this.scene.start('ui-scene');
      });
    this.bannerStartButton.setScale(0.8);
  }
}

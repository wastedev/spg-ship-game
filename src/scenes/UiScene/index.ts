import { GameObjects, Scene } from 'phaser';
import { Player } from 'src/entities';
import { TopScene } from '../TopScene';

export class UiScene extends Scene {
  private leftButton!: GameObjects.Image;
  private rightButton!: GameObjects.Image;

  constructor() {
    super('ui-scene');
  }
  protected getPlayer(): TopScene {
    return this.scene.get('top-scene') as TopScene;
  }
  create(): void {
    this.scene.swapPosition('ui-scene', 'top-scene');
    this.leftButton = this.add
      .image(
        window.game.scale.width / 2 - window.game.scale.width / 4,
        window.game.scale.height / 2 + window.game.scale.height / 3,
        'leftButtonMove',
      )
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerdown', () => {
        const player: any = this.getPlayer().player;
        player.updateByTarget('up');
      })
      .on('pointerup', () => {
        const player: any = this.getPlayer().player;
        player.updateByTarget('none');
      })
      .on('pointerout', () => {
        const player: any = this.getPlayer().player;
        player.updateByTarget('none');
      });
    this.leftButton.scale = 0.5;

    this.rightButton = this.add
      .image(
        window.game.scale.width / 2 + window.game.scale.width / 4,
        window.game.scale.height / 2 + window.game.scale.height / 3,
        'rightButtonMove',
      )
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerdown', () => {
        const player: any = this.getPlayer().player;
        player.updateByTarget('down');
      })
      .on('pointerup', () => {
        const player: any = this.getPlayer().player;
        player.updateByTarget('none');
      })
      .on('pointerout', () => {
        const player: any = this.getPlayer().player;
        player.updateByTarget('none');
      });
    this.rightButton.scale = 0.5;
  }

  update(): void {}
}

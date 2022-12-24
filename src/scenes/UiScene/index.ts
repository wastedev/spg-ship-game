import { Duration, Player } from './../../entities/Player';
import { GameObjects, Scene } from 'phaser';
import { TopScene } from '../TopScene';

export class UiScene extends Scene {
  private leftButton!: GameObjects.Image;
  private rightButton!: GameObjects.Image;

  constructor() {
    super('ui-scene');
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
        const player: Player = this.getPlayer().player;
        player.updateByTarget(Duration.Up);
      })
      .on('pointerup', () => {
        const player: Player = this.getPlayer().player;
        player.updateByTarget(Duration.None);
      })
      .on('pointerout', () => {
        const player: Player = this.getPlayer().player;
        player.updateByTarget(Duration.None);
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
        const player: Player = this.getPlayer().player;
        player.updateByTarget(Duration.Down);
      })
      .on('pointerup', () => {
        const player: Player = this.getPlayer().player;
        player.updateByTarget(Duration.None);
      })
      .on('pointerout', () => {
        const player: Player = this.getPlayer().player;
        player.updateByTarget(Duration.None);
      });
    this.rightButton.scale = 0.5;
  }

  update(): void {}

  protected getPlayer(): TopScene {
    return this.scene.get('top-scene') as TopScene;
  }
}

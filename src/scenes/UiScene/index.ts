import { Direction, Player } from './../../entities/Player';
import { GameObjects, Scene } from 'phaser';
import { TopScene } from '../TopScene';

export class UiScene extends Scene {
  private leftButton!: GameObjects.Image;
  private rightButton!: GameObjects.Image;
  private oilScore!: GameObjects.Image;
  private scoreText!: GameObjects.Text;
  private oil!: number;

  constructor() {
    super('ui-scene');
  }

  create(): void {
    // this.scene.swapPosition('ui-scene', 'top-scene');
    this.oil = 0;
    this.oilScore = this.add.image(window.game.scale.width - 70, 40, 'oilScore');
    this.oilScore.scale = 0.5;
    this.scoreText = this.add.text(window.game.scale.width - 75, 25, this.oil.toString(), {
      font: '25px Bold Courier',
      color: '#0F6894',
    });

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
        player.updateByTarget(Direction.Up);
      })
      .on('pointerup', () => {
        const player: Player = this.getPlayer().player;
        player.updateByTarget(Direction.None);
      })
      .on('pointerout', () => {
        const player: Player = this.getPlayer().player;
        player.updateByTarget(Direction.None);
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
        player.updateByTarget(Direction.Down);
      })
      .on('pointerup', () => {
        const player: Player = this.getPlayer().player;
        player.updateByTarget(Direction.None);
      })
      .on('pointerout', () => {
        const player: Player = this.getPlayer().player;
        player.updateByTarget(Direction.None);
      });
    this.rightButton.scale = 0.5;
  }

  protected sideSceneChange(): void {
    this.leftButton.destroy();
    this.rightButton.destroy();
  }
  update(): void {}

  protected getPlayer(): TopScene {
    return this.scene.get('top-scene') as TopScene;
  }
}

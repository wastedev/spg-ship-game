import { GameObjects, Scene } from 'phaser';
import { Player } from 'src/entities';
import { TopScene } from '../TopScene';

export class UiScene extends Scene {
  private leftButton!: GameObjects.Sprite;
  private rightButton!: GameObjects.Sprite;

  constructor() {
    super('ui-scene');
  }
  protected getPlayer(): TopScene {
    return this.scene.get('top-scene') as TopScene;
  }
  create(): void {
    this.scene.swapPosition('ui-scene', 'top-scene');
    this.leftButton = this.physics.add
      .sprite(
        window.game.scale.width / 2 - window.game.scale.width / 4,
        window.game.scale.height / 2 + window.game.scale.height / 3,
        'leftButtonMove',
      )
      .setInteractive()
      .on('pointerdown', () => {
        const player: any = this.getPlayer().player;
        player.updateByTarget('up');
      })
      .on('pointerover', () => {
        const player: any = this.getPlayer().player;
        player.updateByTarget('up');
      })
      .on('pointerup', () => {})
      .on('pointerout', () => {});
    // this.leftButton.on(Phaser.Input.Events.POINTER_OVER, () => {
    //   const player: any = this.getPlayer().player;
    //   console.log(player);
    //   player.updateByTarget('up');
    // });
    // .on(Phaser.Input.Events.POINTER_UP, () => {
    //   this.leftButton.removeListener(Phaser.Input.Events.POINTER_OVER);
    // })
    // .on(Phaser.Input.Events.POINTER_OUT, () => {
    //   this.leftButton.removeListener(Phaser.Input.Events.POINTER_OVER);
    // });
    this.leftButton.scale = 0.5;

    this.rightButton = this.add.sprite(
      window.game.scale.width / 2 + window.game.scale.width / 4,
      window.game.scale.height / 2 + window.game.scale.height / 3,
      'rightButtonMove',
    );
    this.rightButton.scale = 0.5;
    this.rightButton
      .setInteractive()
      .on(Phaser.Input.Events.GAMEOBJECT_OVER, () => {
        console.log('right');
      })
      .on(Phaser.Input.Events.GAMEOBJECT_OUT, () => {
        console.log('rightout');
      });
  }

  update(): void {}
}

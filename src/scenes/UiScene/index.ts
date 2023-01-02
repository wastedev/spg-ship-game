import { Direction, Player } from './../../entities/Player';
import { GameObjects, Scene } from 'phaser';
import { TopScene } from '../TopScene';
import { DockingScene } from '../DockingScene';
import { FIRST_SCENE, SCENE_HEALTH, SECOND_SCENE } from '../../helpers';

export class UiScene extends Scene {
  private leftButton!: GameObjects.Image;
  private rightButton!: GameObjects.Image;
  private loadOilButton!: GameObjects.Image;
  private oilScore!: GameObjects.Image;
  public scoreText!: GameObjects.Text;
  private oil!: number;
  private healthScore!: GameObjects.Image;
  private healthText!: GameObjects.Text;
  private health!: number;
  private loadTimer!: any;
  constructor() {
    super('ui-scene');
  }

  create(): void {
    // this.scene.swapPosition('ui-scene', 'top-scene');
    this.loadTimer = 0;
    this.oil = 0;
    this.health = 3;
    this.oilScore = this.add.image(window.game.scale.width - 70, 40, 'oilScore');
    this.oilScore.scale = 0.5;
    this.scoreText = this.add.text(window.game.scale.width - 75, 25, this.oil.toString(), {
      font: '25px Bold Courier',
      color: '#0F6894',
    });
    this.healthScore = this.add.image(70, 40, 'healthScore');
    this.healthText = this.add.text(75, 25, this.health.toString(), {
      font: '25px Bold Courier',
      color: '#0F6894',
    });
    this.healthScore.setScale(0.5);

    this.loadOilButton = this.add.image(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'oilLoad',
    );

    this.loadOilButton.visible = false;
    this.loadOilButton.setScale(0.6);

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
    this.leftButton.setScale(0.7);

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
    this.rightButton.setScale(0.7);
  }

  public oilLoading(): void {
    this.time.addEvent({
      delay: 500,
      callback: () => {
        this.oil += 10;

        if (this.oil === 80) {
          console.log('GAME_OVER');

          window.windowProxy.post({
            finishGame3: JSON.stringify({
              win: true,
              lose: false,
              crashCount: 3 - SCENE_HEALTH[FIRST_SCENE],
              aimTries: 3 - SCENE_HEALTH[SECOND_SCENE],
            }),
          });
        }
      },
      callbackScope: this,
      repeat: 7,
    });
    this.loadOilButton.visible = false;
  }

  public activateLoadButton(): void {
    this.loadOilButton.visible = true;
    this.loadOilButton.setInteractive().on('pointerup', () => {
      this.oilLoading();
    });
  }

  public setHealth(value: number): void {
    this.health = value;
  }

  public sideSceneChange(): void {
    this.leftButton.destroy();
    this.rightButton.destroy();
  }

  update(): void {
    this.healthText.setText(this.health.toString());
    this.scoreText.setText(this.oil.toString());
  }

  protected getPlayer(): TopScene | DockingScene {
    const topScene = this.scene.get('top-scene');

    if (topScene.scene.isActive()) {
      return topScene as TopScene;
    } else {
      return this.scene.get('docking-scene') as DockingScene;
    }
  }
}

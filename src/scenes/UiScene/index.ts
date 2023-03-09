import { Direction, Player } from './../../entities/Player';
import { GameObjects, Scene, Types } from 'phaser';
import { TopScene } from '../TopScene';
import { DockingScene } from '../DockingScene';
import { SCENE_HEALTH, FIRST_SCENE, SECOND_SCENE } from '../../helpers/index';
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
  private popupBG!: GameObjects.Image;

  private restartValue: boolean = false;

  private endGamePopup!: GameObjects.Image;
  private endGameBtn!: GameObjects.Image;

  private soundOnBtn!: GameObjects.Image;
  private soundOffBtn!: GameObjects.Image;
  private backgroundSound!: any;

  private getDamagePopup!: GameObjects.Image;
  private getDamageContinue!: GameObjects.Image;
  private getDamageClose!: GameObjects.Image;

  constructor() {
    super('ui-scene');
  }

  create(): void {
    this.popupBG = this.add.image(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'popupBg',
    );
    this.popupBG.visible = false;
    this.popupBG.scale = 3;
    this.popupBG.setAlpha(0.7);
    this.oil = 0;
    this.health = 3;
    this.oilScore = this.add.image(window.game.scale.width - 70, 40, 'oilScore');
    this.oilScore.scale = 0.5;
    this.scoreText = this.add.text(window.game.scale.width - 75, 25, this.oil.toString(), {
      fontFamily: 'Arial',
      fontSize: '25px',
      color: '#0F6894',
    });
    this.healthScore = this.add.image(70, 40, 'healthScore');
    this.healthText = this.add.text(75, 25, this.health.toString(), {
      fontFamily: 'Arial',
      fontSize: '25px',
      color: '#0F6894',
    });
    this.healthScore.setScale(0.5);

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

    this.backgroundSound = this.sound.add('background');
    const musicConfig: Types.Sound.SoundConfig = {
      volume: 0.5,
      loop: true,
    };
    this.backgroundSound.play(musicConfig);

    this.soundOnBtn = this.add
      .image(this.oilScore.x - 100, this.oilScore.y, 'soundOn')
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerup', () => {
        this.soundOnBtn.visible = false;
        this.soundOffBtn.visible = true;
        window.game.sound.stopAll();
      });
    this.soundOnBtn.scale = 0.8;
    this.soundOffBtn = this.add
      .image(this.oilScore.x - 100, this.oilScore.y, 'soundOff')
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerup', () => {
        this.soundOnBtn.visible = true;
        this.soundOffBtn.visible = false;
        this.backgroundSound.play(musicConfig);
      });
    this.soundOffBtn.scale = 0.8;
    this.soundOffBtn.visible = false;
  }

  public hideButtons(): void {
    this.leftButton.visible = false;
    this.rightButton.visible = false;
  }

  protected endGameEvent(): void {
    this.popupBG.visible = true;
    this.popupBG.setDepth(50);
    this.endGamePopup = this.add
      .image(window.game.scale.width / 2, window.game.scale.height / 2, 'endPopup')
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerup', () => {
        window.windowProxy.post({
          finishGame3: JSON.stringify({
            win: true,
            lose: false,
            crashCount: 3 - SCENE_HEALTH[FIRST_SCENE],
            aimTries: 5 - SCENE_HEALTH[SECOND_SCENE],
          }),
        });
      });
    this.endGamePopup.setDepth(51);
  }

  protected getTop(): TopScene {
    return window.game.scene.getScene('top-scene') as TopScene;
  }

  public hideUI(): void {
    this.leftButton.visible = false;
    this.rightButton.visible = false;
    this.scoreText.visible = false;
    this.healthScore.visible = false;
    this.oilScore.visible = false;
    this.healthText.visible = false;
  }

  public showUI(): void {
    this.leftButton.visible = true;
    this.rightButton.visible = true;
    this.scoreText.visible = true;
    this.healthScore.visible = true;
    this.oilScore.visible = true;
    this.healthText.visible = true;
  }

  public gameLose() {
    if (!this.restartValue) {
      this.restartValue = true;
      window.windowProxy.post({
        finishGame3: JSON.stringify({
          win: false,
          lose: true,
          crashCount: 3 - SCENE_HEALTH[FIRST_SCENE],
          aimTries: 5 - SCENE_HEALTH[SECOND_SCENE],
        }),
      });
    }
  }

  protected destroyGetDamagePopup(): void {
    this.getDamagePopup.destroy();
    this.getDamageClose.destroy();
    this.getDamageContinue.destroy();
    this.popupBG.visible = false;
  }

  public getDamage(): void {
    this.popupBG.visible = true;
    this.popupBG.setDepth(50);
    const top = this.getTop();
    top.getDamage();
    this.getDamagePopup = this.add.image(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'docking-info',
    );
    this.getDamagePopup.setDepth(51);
    this.getDamageContinue = this.add
      .image(
        this.getDamagePopup.x,
        this.getDamagePopup.y + this.getDamagePopup.y / 5,
        'continueButton',
      )
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerdown', () => {
        top.continueGame();
        this.destroyGetDamagePopup();
      });
    this.getDamageContinue.setDepth(51);
    this.getDamageClose = this.add
      .image(this.getDamagePopup.x + 380, this.getDamagePopup.y - 170, 'crossButton')
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerdown', () => {
        top.continueGame();
        this.destroyGetDamagePopup();
      });
    this.getDamageClose.setDepth(51);
  }

  public oilLoading(): void {
    this.time.addEvent({
      delay: 500,
      callback: () => {
        this.oil += 10;
        if (this.oil === 80) {
          this.endGameEvent();
        }
      },
      callbackScope: this,
      repeat: 7,
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

// public activateLoadButton(): void {
//   this.loadOilButton.visible = true;
//   this.loadOilButton.setInteractive().on('pointerup', () => {
//     this.oilLoading();
//   });
// }

// public restartGame(sceneNumber: number): void {
//   this.hideUI();
//   if (!this.restartValue) {
//     this.restartValue = true;
//     console.log('restart');
//     if (sceneNumber === 1 || sceneNumber === 2) {
//       this.restartGamePopup = this.add
//         .image(window.game.scale.width / 2, window.game.scale.height / 2, 'gameOverPopup')
//         .setScrollFactor(0)
//         .setInteractive()
//         .on('pointerup', () => {
//           console.log('work');
//         });
//     } else {
//       this.restartValue = true;
//       this.restartGamePopup = this.add
//         .image(window.game.scale.width / 2, window.game.scale.height / 2, 'gameOverPopup')
//         .setScrollFactor(0)
//         .setInteractive()
//         .on('pointerup', () => {
//           console.log('work');
//           window.windowProxy.post({
//             finishGame3: JSON.stringify({
//               win: false,
//               lose: true,
//               crashCount: 3 - SCENE_HEALTH[FIRST_SCENE],
//               aimTries: 5 - SCENE_HEALTH[SECOND_SCENE],
//             }),
//           });
//         });
//     }
//   }
// }

//restart game with popup using ui scene
// public restartGame(sceneNumber: number): void {
//   this.hideUI();
//   if (!this.restartValue) {
//     this.restartValue = true;
//     console.log('restart');
//     if (sceneNumber === 1 || sceneNumber === 2) {
//       this.restartGamePopup = this.add
//         .image(window.game.scale.width / 2, window.game.scale.height / 2, 'gameOverPopup')
//         .setScrollFactor(0)
//         .setInteractive()
//         .on('pointerup', () => {
//           console.log('work');

//         });
//     } else {
//       this.restartValue = true;
//       this.restartGamePopup = this.add
//         .image(window.game.scale.width / 2, window.game.scale.height / 2, 'gameOverPopup')
//         .setScrollFactor(0)
//         .setInteractive()
//         .on('pointerup', () => {
//           console.log('work');
//           window.windowProxy.post({
//             finishGame3: JSON.stringify({
//               win: false,
//               lose: true,
//               crashCount: 3 - SCENE_HEALTH[FIRST_SCENE],
//               aimTries: 5 - SCENE_HEALTH[SECOND_SCENE],
//             }),
//           });
//         });
//     }
//   }
// }

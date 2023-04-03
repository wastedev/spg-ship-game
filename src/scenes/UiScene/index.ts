import { Direction, Player } from './../../entities/Player';
import { GameObjects, Scene, Types } from 'phaser';
import { TopScene } from '../TopScene';
import { DockingScene } from '../DockingScene';
import { SCENE_HEALTH, FIRST_SCENE, SECOND_SCENE } from '../../helpers/index';
export class UiScene extends Scene {
  private leftButton!: GameObjects.Image;
  private rightButton!: GameObjects.Image;
  private oilScore!: GameObjects.Image;
  public scoreText!: GameObjects.Text;
  private oil!: number;
  private healthScore!: GameObjects.Image;
  private healthText!: GameObjects.Text;
  private health!: number;
  private popupBG!: GameObjects.Image;

  private restartValue: boolean = false;

  private endGamePopup!: GameObjects.Image;
  private endGamePopupBtn!: GameObjects.Image;

  private soundOnBtn!: GameObjects.Image;
  private soundOffBtn!: GameObjects.Image;
  private backgroundSound!: any;

  private getDamagePopup!: GameObjects.Image;
  private getDamageContinue!: GameObjects.Image;
  private getDamageClose!: GameObjects.Image;

  private pauseGame!: GameObjects.Image;
  private continueGame!: GameObjects.Image;

  private activeScene: string = 'top-scene';

  constructor() {
    super('ui-scene');
  }

  public changeActiveScene(scene: number): void {
    switch (scene) {
      case 1:
        this.activeScene = 'top-scene';
        break;
      case 2:
        this.activeScene = 'docking-scene';
        break;
      case 3:
        this.activeScene = 'side-scene';
        break;
    }
  }

  private initPause(): void {
    this.pauseGame = this.add
      .image(window.game.scale.width - 250, 50, 'pauseGame')
      .on('pointerdown', () => {
        window.game.scene.pause(this.activeScene);
        this.pauseGame.visible = false;
        this.continueGame.visible = true;
      })
      .setInteractive({ cursor: 'pointer' })
      .setScrollFactor(0)
      .on('pointerout', () => {
        this.pauseGame.setScale(0.8);
      })
      .on('pointerover', () => {
        this.pauseGame.setScale(0.9);
      });
    this.pauseGame.scale = 0.8;
    this.pauseGame.setPosition(window.game.scale.width - 200 - this.pauseGame.width / 2, 50);
    this.pauseGame.setOrigin(0.5);

    this.continueGame = this.add
      .image(this.pauseGame.x, this.pauseGame.y, 'continueGame')
      .on('pointerdown', () => {
        window.game.scene.run(this.activeScene);
        this.continueGame.visible = false;
        this.pauseGame.visible = true;
      })
      .setInteractive({ cursor: 'pointer' })
      .setScrollFactor(0)
      .on('pointerout', () => {
        this.continueGame.setScale(0.8);
      })
      .on('pointerover', () => {
        this.continueGame.setScale(0.9);
      });
    this.continueGame.setOrigin(0.5);
    this.continueGame.scale = 0.8;
    this.continueGame.visible = false;
  }

  public stopScene(): void {
    this.scene.stop(this.activeScene);
  }

  public startScene(): void {
    this.scene.run(this.activeScene);
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

    this.healthScore = this.add.image(200, 50, 'healthScore');
    this.healthScore.setOrigin(0.5);
    this.healthScore.setPosition(200 + this.healthScore.width / 4, 50);

    this.healthText = this.add.text(
      this.healthScore.x + 10,
      this.healthScore.y,
      this.health.toString(),
      {
        fontFamily: 'Arial',
        fontSize: '25px',
        color: '#0F6894',
      },
    );

    this.oilScore = this.add.image(
      this.healthScore.x + this.healthScore.width / 2 - 8,
      50,
      'oilScore',
    );
    this.oilScore.setOrigin(0.5);
    this.scoreText = this.add.text(this.oilScore.x + 10, this.oilScore.y, this.oil.toString(), {
      fontFamily: 'Arial',
      fontSize: '25px',
      color: '#0F6894',
    });

    this.oilScore.setPosition(this.healthScore.x + 150, 50);
    this.scoreText.setPosition(this.oilScore.x + 10, this.oilScore.y);
    this.healthText.setOrigin(0.6);
    this.scoreText.setOrigin(0.6);

    this.rightButton = this.add
      .image(
        window.game.scale.width / 2 - window.game.scale.width / 4,
        window.game.scale.height / 2 + window.game.scale.height / 3,
        'rightButtonMove',
      )
      .setScrollFactor(0)
      .setInteractive({ cursor: 'pointer' })
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

    this.leftButton = this.add
      .image(
        window.game.scale.width / 2 + window.game.scale.width / 4,
        window.game.scale.height / 2 + window.game.scale.height / 3,
        'leftButtonMove',
      )
      .setScrollFactor(0)
      .setInteractive({ cursor: 'pointer' })
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

    this.backgroundSound = this.sound.add('background');
    const musicConfig: Types.Sound.SoundConfig = {
      volume: 0.5,
      loop: true,
    };
    this.backgroundSound.play(musicConfig);

    this.initPause();

    this.soundOnBtn = this.add
      .image(this.pauseGame.x - 70, this.pauseGame.y, 'soundOn')
      .setScrollFactor(0)
      .setInteractive({ cursor: 'pointer' })
      .on('pointerup', () => {
        this.soundOnBtn.visible = false;
        this.soundOffBtn.visible = true;
        window.game.sound.stopAll();
      })
      .on('pointerover', () => {
        this.soundOnBtn.setScale(0.9);
      })
      .on('pointerout', () => {
        this.soundOnBtn.setScale(0.8);
      });
    this.soundOnBtn.scale = 0.8;
    this.soundOffBtn = this.add
      .image(this.soundOnBtn.x, this.soundOnBtn.y, 'soundOff')
      .setScrollFactor(0)
      .setInteractive({ cursor: 'pointer' })
      .on('pointerup', () => {
        this.soundOnBtn.visible = true;
        this.soundOffBtn.visible = false;
        this.backgroundSound.play(musicConfig);
      })
      .on('pointerover', () => {
        this.soundOffBtn.setScale(0.9);
      })
      .on('pointerout', () => {
        this.soundOffBtn.setScale(0.8);
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
      .setInteractive();
    this.endGamePopup.setDepth(51);
    this.endGamePopupBtn = this.add
      .image(this.endGamePopup.x, this.endGamePopup.y - this.endGamePopup.y / 7, 'endBtn')
      .setInteractive({ cursor: 'pointer' })
      .setScrollFactor(0)
      .on('pointerup', () => {
        window.windowProxy.post({
          finishGame3: JSON.stringify({
            win: true,
            lose: false,
            crashCount: 3 - SCENE_HEALTH[FIRST_SCENE],
            aimTries: 5 - SCENE_HEALTH[SECOND_SCENE],
          }),
        });
      })
      .on('pointerover', () => {
        this.endGamePopupBtn.setTexture('endBtnHover');
      })
      .on('pointerout', () => {
        this.endGamePopupBtn.setTexture('endBtn');
      });
    this.endGamePopupBtn.setDepth(51);
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
      window.game.sound.stopAll();
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
      .setInteractive({ cursor: 'pointer' })
      .on('pointerdown', () => {
        top.continueGame();
        this.destroyGetDamagePopup();
      })
      .on('pointerover', () => {
        this.getDamageContinue.setTexture('continueButtonHover');
      })
      .on('pointerout', () => {
        this.getDamageContinue.setTexture('continueButton');
      });
    this.getDamageContinue.setDepth(51);
    this.getDamageClose = this.add
      .image(this.getDamagePopup.x + 380, this.getDamagePopup.y - 170, 'crossButton')
      .setScrollFactor(0)
      .setInteractive({ cursor: 'pointer' })
      .on('pointerdown', () => {
        top.continueGame();
        this.destroyGetDamagePopup();
      });
    this.getDamageClose.setDepth(51);
  }

  public oilLoading(): void {
    this.oilScore.setPosition(window.game.scale.width / 2, window.game.scale.height / 2);
    this.scoreText.setPosition(this.oilScore.x + 10, this.oilScore.y);
    let scoreSize = 25;
    this.time.addEvent({
      delay: 60,
      callback: () => {
        this.oil += 1;
        this.oilScore.scale += 0.005;
        this.scoreText.setFontSize((scoreSize += 0.099));
        if (this.oil === 80) {
          setTimeout(() => {
            this.oilScore.setPosition(this.healthScore.x + 150, 50);
            this.scoreText.setPosition(this.oilScore.x + 10, this.oilScore.y);
            this.oilScore.scale = 1;
            this.scoreText.setFontSize(25);
            this.endGameEvent();
          }, 500);
        }
      },
      callbackScope: this,
      repeat: 79,
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

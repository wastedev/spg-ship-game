import { Direction, Player } from './../../entities/Player';
import { GameObjects, Scene, Types } from 'phaser';
import { TopScene } from '../TopScene';
import { DockingScene } from '../DockingScene';
import { SCENE_HEALTH, FIRST_SCENE, SECOND_SCENE } from '../../helpers/index';
import { IS_MOBILE } from '../../constants/index';
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

  public checkInfoBarScale(): number {
    const width = window.game.scale.width;
    let scaleValue = 0;

    if (!IS_MOBILE) {
      if (width <= 1920 && width >= 1600) {
        scaleValue = 1.07;
      }
      if (width <= 1600 && width >= 1366) {
        scaleValue = 0.875;
      }
      if (width <= 1366 && width >= 1280) {
        scaleValue = 0.75;
      }
      if (width <= 1280) {
        scaleValue = 0.68;
      }
    } else {
      scaleValue = 1;
    }
    return scaleValue;
  }

  public checkMarginTopStats(scaleValue: number): number {
    let marginTop = 0;
    if (!IS_MOBILE) {
      if (scaleValue === 1.07) {
        marginTop = 8.6;
      } else if (scaleValue === 0.875) {
        //1600
        marginTop = 9.2;
      } else if (scaleValue === 0.75) {
        //1366
        marginTop = 9.1;
      } else {
        //1280
        marginTop = 9.2;
      }
    } else {
      marginTop = 8.9;
    }

    return marginTop;
  }

  public checkMarginRight(scaleValue: number): number {
    let marginRight = 0;
    if (!IS_MOBILE) {
      if (scaleValue === 1.07) {
        marginRight = 0.065;
      } else if (scaleValue === 0.875) {
        //1600
        marginRight = 0.056;
      } else if (scaleValue === 0.75) {
        //1366
        marginRight = 0.049;
      } else {
        //1280
        marginRight = 0.044;
      }
    } else {
      marginRight = 0.065;
    }

    return marginRight;
  }

  public checkFont(scaleValue: number, fontSize: GameObjects.Text): void {
    let size = 0;
    if (!IS_MOBILE) {
      if (scaleValue === 1.07) {
        size = 25;
        fontSize.setFontSize(size);
      } else if (scaleValue === 0.875) {
        //1600
        size = 19.2;
        fontSize.setFontSize(size);
      } else if (scaleValue === 0.75) {
        //1366
        size = 17;
        fontSize.setFontSize(size);
        fontSize.setFontStyle('bold');
      } else {
        //1280
        size = 16.5;
        fontSize.setFontSize(size);
        fontSize.setFontStyle('bold');
      }
    } else {
      size = 25;
      fontSize.setFontSize(size);
      fontSize.setFontStyle('bold');
    }
  }

  public checkInfoSpaceBetween(scaleValue: number): number {
    let spaceBetween = 0;
    if (!IS_MOBILE) {
      if (scaleValue === 1.07) {
        spaceBetween = 1.1;
      } else if (scaleValue === 0.875) {
        //1600
        spaceBetween = 1.3;
      } else if (scaleValue === 0.75) {
        //1366
        spaceBetween = 1.5;
      } else {
        //1280
        spaceBetween = 1.65;
      }
    } else {
      spaceBetween = 1.15;
    }
    return spaceBetween;
  }

  public initStatBar(): void {
    let scaleValue = this.checkInfoBarScale();
    let marginTop = this.checkMarginTopStats(scaleValue);
    let marginRight = this.checkMarginRight(scaleValue);
    let spaceBetween = this.checkInfoSpaceBetween(scaleValue);
    //OIL
    this.oilScore = this.add.image(0, 0, 'oilScore');
    this.oilScore.setOrigin(0.5);

    ///setscale
    this.oilScore.setScale(scaleValue);
    ///
    this.scoreText = this.add.text(this.oilScore.x + 10, this.oilScore.y, this.oil.toString(), {
      fontFamily: 'Arial',
      fontSize: '25px',
      color: '#0F6894',
    });

    this.checkFont(scaleValue, this.scoreText);

    //position of oil stat
    this.oilScore.setPosition(
      window.game.scale.width - window.game.scale.width * marginRight - this.oilScore.width / 2,
      window.game.scale.height / marginTop,
    );
    //settext
    this.scoreText.setPosition(this.oilScore.x + 10, this.oilScore.y);

    this.healthScore = this.add.image(0, 0, 'healthScore');
    this.healthScore.setOrigin(0.5);

    ///setscale
    this.healthScore.setScale(scaleValue);
    ///
    this.healthScore.setPosition(
      this.oilScore.x - this.oilScore.width / spaceBetween,
      window.game.scale.height / marginTop,
    );

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

    this.checkFont(scaleValue, this.healthText);

    //SOME SETTINGS
    this.healthText.setOrigin(0.6);
    this.scoreText.setOrigin(0.6);

    this.initSoundBtn();
    this.initPause();
  }

  private checkScaleValue(): number {
    const width = window.game.scale.width;
    let scaleValue = 0;

    if (!IS_MOBILE) {
      if (width <= 1920 && width >= 1600) {
        scaleValue = 0.9;
      }
      if (width <= 1600 && width >= 1366) {
        scaleValue = 0.78;
      }
      if (width <= 1366 && width >= 1280) {
        scaleValue = 0.66;
      }
      if (width <= 1280) {
        scaleValue = 0.61;
      }
    } else {
      scaleValue = 0.8;
    }

    return scaleValue;
  }

  private checkLeftMargin(scaleValue: number): number {
    let marginLeft = 0;

    if (!IS_MOBILE) {
      if (scaleValue === 0.9) {
        //fhd
        marginLeft = 0.093;
      } else if (scaleValue === 0.78) {
        //1600
        marginLeft = 0.089;
      } else if (scaleValue === 0.66) {
        //1366
        marginLeft = 0.0837;
      } else {
        //1280
        marginLeft = 0.08;
      }
    } else {
      marginLeft = 0.1;
    }

    return marginLeft;
  }

  private checkMarginTop(scaleValue: number): number {
    let marginTop = 0;
    if (!IS_MOBILE) {
      if (scaleValue === 0.9) {
        marginTop = 8.8;
      } else if (scaleValue === 0.78) {
        //1600
        marginTop = 9.2;
      } else if (scaleValue === 0.66) {
        //1366
        marginTop = 9.2;
      } else {
        //1280
        marginTop = 9.2;
      }
    } else {
      marginTop = 8.9;
    }
    return marginTop;
  }

  private checkSpaceBetween(scaleValue: number): number {
    let spaceBetween = 0;

    if (!IS_MOBILE) {
      if (scaleValue === 0.9) {
        spaceBetween = 1.25;
      } else if (scaleValue === 0.78) {
        //1600
        spaceBetween = 1.45;
      } else if (scaleValue === 0.66) {
        //1366
        spaceBetween = 1.6;
      } else {
        //1280
        spaceBetween = 1.8;
      }
    } else {
      spaceBetween = 1.25;
    }
    return spaceBetween;
  }

  private initSoundBtn(): void {
    let scaleValue = this.checkScaleValue();
    let marginLeft = this.checkLeftMargin(scaleValue);
    let marginTop = this.checkMarginTop(scaleValue);

    this.backgroundSound = this.sound.add('background');
    const musicConfig: Types.Sound.SoundConfig = {
      volume: 0.5,
      loop: true,
    };
    this.backgroundSound.play(musicConfig);

    this.soundOnBtn = this.add
      .image(0, 0, 'soundOn')
      .setScrollFactor(0)
      .setInteractive({ cursor: 'pointer' })
      .on('pointerup', () => {
        this.soundOnBtn.visible = false;
        this.soundOffBtn.visible = true;
        window.game.sound.stopAll();
      });

    this.soundOnBtn.scale = scaleValue;
    this.soundOnBtn
      .on('pointerover', () => {
        this.soundOnBtn.setScale((scaleValue += 0.1));
      })
      .on('pointerout', () => {
        this.soundOnBtn.setScale((scaleValue -= 0.1));
      });

    this.soundOnBtn.setPosition(
      window.game.scale.width * marginLeft + this.soundOnBtn.width / 2,
      window.game.scale.height / marginTop,
    );

    this.soundOffBtn = this.add
      .image(this.soundOnBtn.x, this.soundOnBtn.y, 'soundOff')
      .setScrollFactor(0)
      .setInteractive({ cursor: 'pointer' })
      .on('pointerup', () => {
        this.soundOnBtn.visible = true;
        this.soundOffBtn.visible = false;
        this.backgroundSound.play(musicConfig);
      });

    this.soundOffBtn.scale = scaleValue;

    this.soundOffBtn
      .on('pointerover', () => {
        this.soundOffBtn.setScale((scaleValue += 0.1));
      })
      .on('pointerout', () => {
        this.soundOffBtn.setScale((scaleValue -= 0.1));
      });

    this.soundOffBtn.visible = false;
  }

  private initPause(): void {
    let scaleValue = this.checkScaleValue();

    let marginTop = this.checkMarginTop(scaleValue);

    let spaceBetween = this.checkSpaceBetween(scaleValue);

    this.pauseGame = this.add
      .image(0, 0, 'pauseGame')
      .on('pointerdown', () => {
        window.game.scene.pause(this.activeScene);
        this.pauseGame.visible = false;
        this.continueGame.visible = true;
      })
      .setInteractive({ cursor: 'pointer' })
      .setScrollFactor(0);

    this.pauseGame.scale = scaleValue;

    this.pauseGame
      .on('pointerout', () => {
        this.pauseGame.setScale((scaleValue -= 0.1));
      })
      .on('pointerover', () => {
        this.pauseGame.setScale((scaleValue += 0.1));
      });

    this.pauseGame.setPosition(
      this.soundOnBtn.x + this.soundOnBtn.width / spaceBetween,
      window.game.scale.height / marginTop,
    );
    this.pauseGame.setOrigin(0.5);

    this.continueGame = this.add
      .image(this.pauseGame.x, this.pauseGame.y, 'continueGame')
      .on('pointerdown', () => {
        window.game.scene.run(this.activeScene);
        this.continueGame.visible = false;
        this.pauseGame.visible = true;
      })
      .setInteractive({ cursor: 'pointer' })
      .setScrollFactor(0);

    this.continueGame.scale = scaleValue;
    this.continueGame
      .on('pointerout', () => {
        this.continueGame.setScale((scaleValue -= 0.1));
      })
      .on('pointerover', () => {
        this.continueGame.setScale((scaleValue += 0.1));
      });
    this.continueGame.setOrigin(0.5);
    this.continueGame.visible = false;
  }

  public stopScene(): void {
    this.scene.stop(this.activeScene);
  }

  public startScene(): void {
    this.scene.run(this.activeScene);
  }

  private checkMoveButtonScale(): number {
    const width = window.game.scale.width;
    let scaleValue = 0;

    if (!IS_MOBILE) {
      if (width <= 1920 && width >= 1600) {
        scaleValue = 1;
      }
      if (width <= 1600 && width >= 1366) {
        scaleValue = 0.75;
      }
      if (width <= 1366 && width >= 1280) {
        scaleValue = 0.66;
      }
      if (width <= 1280) {
        scaleValue = 0.63;
      }
    } else {
      scaleValue = 1;
    }

    return scaleValue;
  }

  create(): void {
    let scaleValue = this.checkMoveButtonScale();

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
    this.rightButton.scale = scaleValue;

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

    this.leftButton.scale = scaleValue;

    this.initStatBar();
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
    let scaleValue = this.checkInfoBarScale();
    let marginRight = this.checkMarginRight(scaleValue);
    let marginTop = this.checkMarginTopStats(scaleValue);

    this.oilScore.setPosition(window.game.scale.width / 2, window.game.scale.height / 2);
    this.scoreText.setPosition(this.oilScore.x + 10, this.oilScore.y);
    this.checkFont(scaleValue, this.scoreText);

    let scoreSize = 25;
    this.time.addEvent({
      delay: 60,
      callback: () => {
        this.oil += 1;
        this.oilScore.scale += 0.005;
        this.scoreText.setFontSize((scoreSize += 0.099));
        if (this.oil === 70) {
          setTimeout(() => {
            this.oilScore.setPosition(
              window.game.scale.width -
                window.game.scale.width * marginRight -
                this.oilScore.width / 2,
              window.game.scale.height / marginTop,
            );
            this.scoreText.setPosition(this.oilScore.x + 10, this.oilScore.y);
            this.oilScore.scale = scaleValue;
            this.checkFont(scaleValue, this.scoreText);
            this.endGameEvent();
          }, 500);
        }
      },
      callbackScope: this,
      repeat: 69,
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

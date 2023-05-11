import { GameObjects, Scene } from 'phaser';
import { Player } from '../../entities/Player';
import { Enemy } from '../../entities/Enemy';
import { GAME_SPEEDS, MOVEMENT_SPEED, ROTATION_SPEED } from '../../constants';
import { UiScene } from '../UiScene';
import { FIRST_SCENE, SCENE_HEALTH, SECOND_SCENE } from '../../helpers';
import { IncomingMessage } from 'http';
import { getuid } from 'process';
import { IS_MOBILE } from '../../constants';

export class DockingScene extends Scene {
  public player!: Player;
  private icebergs: Enemy[] = [];
  private station!: Phaser.Physics.Matter.Image;
  private background!: GameObjects.Image;

  private goalRect500!: Phaser.Physics.Matter.Sprite;
  private goalRect80!: Phaser.Physics.Matter.Sprite;
  private goalRect500Pass: boolean = false;
  private goalRect500Inside: boolean = false;
  private goalRect80Inside: boolean = false;
  private goalRect500Text!: Phaser.GameObjects.Text;
  private goalRect80Text!: Phaser.GameObjects.Text;

  private goalStageMessage!: Phaser.Physics.Matter.Sprite;
  private continueButton!: GameObjects.Image;
  private closeButton!: GameObjects.Image;
  private popupBG!: GameObjects.Image;

  constructor() {
    super('docking-scene');
  }

  protected initEnemies(): void {
    for (let i = 1; i <= 2; i++) {
      this.icebergs.push(
        new Enemy(
          this.matter.world,
          (window.game.scale.width / 6) * 1.5 * i,
          window.game.scale.height / 5 + Math.floor(Math.random() * (window.game.scale.height / 2)),
          `icebergAnimation-${Math.floor(Math.random() * 3) + 1}`,
        ),
      );
    }
  }

  protected initRectArea(): void {
    this.goalRect500 = this.matter.add.sprite(
      window.game.scale.width / 2 - 300,
      window.game.scale.height / 2,
      'goal-distance',
    );
    this.goalRect500.setRectangle(10, 10);
    this.goalRect500.setDisplaySize(250, 50);
    this.goalRect500.setStatic(true);
    this.goalRect500.setSensor(true);

    this.goalRect500Text = this.add.text(this.goalRect500.x, this.goalRect500.y, '500', {
      fontSize: '25px',
      fontStyle: 'bold',
      color: 'white',
      fontFamily: 'Arial',
    });
    this.goalRect500Text.setOrigin(0.5);
    this.goalRect500Text.setDepth(0);

    this.goalRect80 = this.matter.add.sprite(
      this.station.x - 350,
      window.game.scale.height / 2,
      'goal-distance',
    );
    this.goalRect80.setDisplaySize(250, 50);
    this.goalRect80.setStatic(true);
    this.goalRect80.setSensor(true);

    this.goalRect80Text = this.add.text(this.goalRect80.x, this.goalRect80.y, '80', {
      fontSize: '25px',
      fontStyle: 'bold',
      color: 'white',
      fontFamily: 'Arial',
    });
    this.goalRect80Text.setOrigin(0.5);
    this.goalRect80Text.setDepth(1);

    this.goalRect80Text.visible = false;
    this.goalRect80.visible = false;
  }

  create() {
    //game start
    this.launchPlayer();
    //
    const ui = this.getUI();
    ui.changeActiveScene(2);
    //

    this.background = this.add.image(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'background-docking',
    );
    this.background.setOrigin(0.5);

    if (!IS_MOBILE) {
      let width = window.innerWidth;
      let height = window.innerHeight;
      this.background.setDisplaySize(width, height);
    } else {
      let width = window.innerWidth * window.devicePixelRatio;
      let height = window.innerHeight * window.devicePixelRatio;
      this.background.setDisplaySize(width, height);
    }

    this.player = new Player(
      this.matter.world,
      window.game.scale.width / 10,
      window.game.scale.height / 2,
      'player-top',
    );
    this.player.setDepth(2);

    this.station = this.matter.add.image(
      window.game.scale.width - 100,
      window.game.scale.height / 2 + 10,
      'station-top',
      undefined,
      { isStatic: true },
    );
    this.station.scale = window.game.scale.height / window.game.scale.width;
    this.station.setStatic(true);
    this.station.setRectangle(window.game.scale.width / 6, window.game.scale.height);
    this.station.setSensor(true);
    this.station.setDepth(30);
    this.popupBG = this.add.image(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'popupBg',
    );
    this.popupBG.scale = 3;
    this.station.setOnCollide((obj: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      if (obj.bodyA.gameObject?.texture.key === 'player-top') {
        const ui = this.getUI();
        this.stopPlayer();
        ui.gameLose();
      }
    });
    this.popupBG.setAlpha(0.7);
    this.popupBG.visible = false;

    //
    this.initRectArea();
    //
    this.initEnemies();
    //
  }

  public getUI(): UiScene {
    return this.scene.get('ui-scene') as UiScene;
  }

  protected checkPlayerState(): void {
    if (!this.goalRect500Pass) {
      if (this.player.x >= this.goalRect500.x + 60 && this.goalRect500.visible === true) {
        const ui = this.getUI();
        this.stopPlayer();
        ui.gameLose();
      }
    }
    if (this.player.x >= this.goalRect80.x + 60 && this.goalRect80.visible === true) {
      const ui = this.getUI();
      this.stopPlayer();
      ui.gameLose();
    }
  }

  public stopPlayer(): void {
    GAME_SPEEDS[MOVEMENT_SPEED] = 0;
    GAME_SPEEDS[ROTATION_SPEED] = 0;
  }

  public launchPlayer(): void {
    GAME_SPEEDS[MOVEMENT_SPEED] = 1;
    GAME_SPEEDS[ROTATION_SPEED] = 0.35;
  }

  private destroyGoalStageMessage(): void {
    this.goalStageMessage.destroy();
    this.continueButton.destroy();
    this.closeButton.destroy();
    this.popupBG.visible = false;
  }

  private loadTargetPopup(zone: number): void {
    const ui = this.getUI();
    ui.hideUI();
    this.popupBG.visible = true;
    if (zone === 500) {
      this.goalStageMessage = this.matter.add.sprite(
        window.game.scale.width / 2,
        window.game.scale.height / 2,
        '500meters',
      );
      this.goalStageMessage.setSensor(true);
      this.goalStageMessage.setDepth(51);
      this.continueButton = this.add
        .image(
          this.goalStageMessage.x,
          this.goalStageMessage.y + this.goalStageMessage.y / 5,
          'continueButton',
        )
        .setScrollFactor(0)
        .setInteractive({ cursor: 'pointer' })
        .on('pointerdown', () => {
          ui.showUI();
          this.goalRect500.destroy();
          this.goalRect500Pass = true;
          this.goalRect500Text.visible = false;
          this.launchPlayer();
          this.destroyGoalStageMessage();
          this.goalRect80Text.visible = true;
          this.goalRect80.visible = true;
        })
        .on('pointerover', () => {
          this.continueButton.setTexture('continueButtonHover');
        })
        .on('pointerout', () => {
          this.continueButton.setTexture('continueButton');
        });
      this.continueButton.setDepth(51);
      this.closeButton = this.add
        .image(this.goalStageMessage.x + 380, this.goalStageMessage.y - 170, 'crossButton')
        .setInteractive({ cursor: 'pointer' })
        .setScrollFactor(0)
        .on('pointerdown', () => {
          ui.showUI();
          this.goalRect500.destroy();
          this.goalRect500Pass = true;
          this.goalRect500Text.visible = false;
          this.launchPlayer();
          this.destroyGoalStageMessage();
          this.goalRect80Text.visible = true;
          this.goalRect80.visible = true;
        });
      this.closeButton.setDepth(51);
    } else {
      this.goalStageMessage = this.matter.add.sprite(
        window.game.scale.width / 2,
        window.game.scale.height / 2,
        '80meters',
      );
      this.goalStageMessage.setSensor(true);
      this.goalStageMessage.setDepth(51);
      this.continueButton = this.add
        .image(
          this.goalStageMessage.x,
          this.goalStageMessage.y + this.goalStageMessage.y / 5,
          'continueButton',
        )
        .setScrollFactor(0)
        .setInteractive({ cursor: 'pointer' })
        .on('pointerdown', () => {
          ui.showUI();
          this.destroyGoalStageMessage();
          setTimeout(() => {
            const ui = this.getUI();
            ui.changeActiveScene(3);
            this.scene.stop();
            this.scene.start('side-scene');
          }, 1000);
        })
        .on('pointerover', () => {
          this.continueButton.setTexture('continueButtonHover');
        })
        .on('pointerout', () => {
          this.continueButton.setTexture('continueButton');
        });
      this.continueButton.setDepth(51);
      this.closeButton = this.add
        .image(this.goalStageMessage.x + 380, this.goalStageMessage.y - 170, 'crossButton')
        .setInteractive({ cursor: 'pointer' })
        .setScrollFactor(0)
        .on('pointerdown', () => {
          ui.showUI();
          this.destroyGoalStageMessage();
          setTimeout(() => {
            this.scene.stop();
            this.scene.start('side-scene');
          }, 1000);
        });
      this.closeButton.setDepth(51);
    }
  }

  private check500Zone(): void {
    if (!this.goalRect500Inside) {
      if (
        this.player.x >= this.goalRect500?.x &&
        this.player.y >= this.goalRect500?.y - 10 &&
        this.player.y <= this.goalRect500?.y + 10
      ) {
        if (this.player.angle <= 3 && this.player.angle >= -3) {
          this.goalRect500Inside = true;
          this.stopPlayer();

          setTimeout(() => {
            this.goalRect500.visible = false;
          }, 1000);

          setTimeout(() => {
            this.goalRect500.visible = true;
          }, 2000);

          setTimeout(() => {
            this.stopPlayer();
            this.goalRect500.visible = false;
          }, 3000);

          setTimeout(() => {
            this.goalRect500.visible = true;
          }, 4000);

          setTimeout(() => {
            this.loadTargetPopup(500);
          }, 5000);
        }
      }
    }
  }

  private check80Zone(): void {
    if (!this.goalRect80Inside) {
      if (
        this.player.x >= this.goalRect80?.x &&
        this.player.y >= this.goalRect80?.y - 10 &&
        this.player.y <= this.goalRect80?.y + 10
      ) {
        if (this.player.angle <= 3 && this.player.angle >= -3) {
          this.goalRect80Inside = true;
          this.stopPlayer();

          setTimeout(() => {
            this.goalRect80.visible = false;
          }, 1000);

          setTimeout(() => {
            this.goalRect80.visible = true;
          }, 2000);

          setTimeout(() => {
            this.stopPlayer();
            this.goalRect80.visible = false;
          }, 3000);

          setTimeout(() => {
            this.goalRect80.visible = true;
          }, 4000);

          setTimeout(() => {
            this.loadTargetPopup(80);
          }, 5000);
        }
      }
    }
  }

  update(time: number, delta: number): void {
    this.player.update();
    const ui = this.getUI();
    ui.setHealth(this.player.getHealth());
    this.checkPlayerState();

    this.check500Zone();
    this.check80Zone();

    if (this.icebergs.every((iceberg) => iceberg instanceof Enemy)) {
      this.icebergs.forEach((item) => item.update());
    }
  }
}

import { GameObjects, Scene } from 'phaser';
import { Player } from '../../entities/Player';
import { GAME_SPEEDS, MOVEMENT_SPEED, ROTATION_SPEED } from '../../constants';
import { UiScene } from '../UiScene';

export class DockingScene extends Scene {
  public player!: Player;
  private station!: Phaser.Physics.Matter.Image;
  private background!: GameObjects.Image;

  private goalStage!: number;
  private goalStageRectangle!: Phaser.Physics.Matter.Sprite;
  private goalStageMessage!: Phaser.Physics.Matter.Sprite;
  constructor() {
    super('docking-scene');
  }

  create() {
    this.background = this.add.image(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'background-docking',
    );
    this.background.setOrigin(0.5);

    this.goalStage = 1000;
    this.player = new Player(
      this.matter.world,
      window.game.scale.width / 10,
      window.game.scale.height / 2,
      'player-top',
    );

    this.station = this.matter.add.image(
      window.game.scale.width - 100,
      window.game.scale.height / 2 + 10,
      'station-top',
      undefined,
      { isStatic: true },
    );
    this.station.scale = window.game.scale.height / window.game.scale.width;
    this.station.setRectangle(
      (this.station.width / 2) * this.station.scale - 20,
      window.game.scale.height,
    );
    this.station.setStatic(true);
  }

  protected getUI(): UiScene {
    return this.scene.get('ui-scene') as UiScene;
  }

  update(time: number, delta: number): void {
    this.player.update();
    if (this.goalStage > 500) {
      if (
        this.player.x >= this.goalStageRectangle?.x - 30 &&
        (this.player.y >= this.goalStageRectangle?.y - 30 ||
          this.player.y <= this.goalStageRectangle?.y + 30)
      ) {
        this.goalStage = 500;
      }
    }

    if (this.goalStage > 80) {
      if (
        this.player.x >= this.goalStageRectangle?.x + 30 &&
        (this.player.y >= this.goalStageRectangle?.y - 30 ||
          this.player.y <= this.goalStageRectangle?.y + 30)
      ) {
        this.goalStage = 80;
      }
    }

    if (this.goalStage < 80) {
      if (
        this.player.x >= this.goalStageRectangle?.x + 20 &&
        (this.player.y >= this.goalStageRectangle?.y - 30 ||
          this.player.y <= this.goalStageRectangle?.y + 30)
      ) {
        const ui = this.getUI();
        GAME_SPEEDS[MOVEMENT_SPEED] = 0;
        GAME_SPEEDS[ROTATION_SPEED] = 0;
        setTimeout(() => {
          ui.sideSceneChange();
          this.scene.start('side-scene');
        }, 2000);
      }
    }

    switch (this.goalStage) {
      case 1000:
        this.goalStageRectangle = this.matter.add.sprite(
          window.game.scale.width / 5,
          window.game.scale.height / 2,
          'goal-distance',
        );
        this.goalStageRectangle.setDisplaySize(500, 300);
        this.goalStageRectangle.setSensor(true);

        this.goalStageMessage = this.matter.add.sprite(
          this.goalStageRectangle.x,
          this.goalStageRectangle.y - 100,
          'goal-1000',
        );
        this.goalStageMessage.setScale(0.6);
        this.goalStageMessage.setStatic(true);
        this.goalStageMessage.setSensor(true);

        --this.goalStage;

        break;

      case 500:
        this.goalStageRectangle.setX(window.game.scale.width / 2);
        this.goalStageRectangle.setDisplaySize(300, 200);

        this.goalStageMessage.setTexture('goal-500');
        this.goalStageMessage.setX(this.goalStageRectangle.x);

        --this.goalStage;

        break;

      case 80:
        GAME_SPEEDS[MOVEMENT_SPEED] = 0.5;
        GAME_SPEEDS[ROTATION_SPEED] = 0.16;
        this.goalStageRectangle.setX(this.station.x - 350);
        this.goalStageRectangle.setDisplaySize(220, 50);

        this.goalStageMessage.setTexture('goal-80');
        this.goalStageMessage.setX(this.goalStageRectangle.x);

        --this.goalStage;
        break;
    }
  }
}

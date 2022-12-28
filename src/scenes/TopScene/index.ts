import { GAME_SPEEDS, MOVEMENT_SPEED, ROTATION_SPEED } from '../../constants';
import { Scene, GameObjects } from 'phaser';
import { Enemy, Player } from '../../entities';
import { UiScene } from '..';

export class TopScene extends Scene {
  public player!: Player;
  private station!: Phaser.Physics.Matter.Image;
  private goalZone!: Phaser.Physics.Matter.Sprite;

  private icebergs!: Enemy[];
  private topBarrier!: MatterJS.BodyType;
  private bottomBarrier!: MatterJS.BodyType;
  private backgroundIcebergs!: GameObjects.Image;

  private goalStage!: number;
  private goalStageRectangle!: Phaser.Physics.Matter.Sprite;
  private goalStageMessage!: Phaser.Physics.Matter.Sprite;

  constructor() {
    super('top-scene');
  }

  protected getUI(): UiScene {
    return this.scene.get('ui-scene') as UiScene;
  }

  create(): void {
    //UI CHANGES

    // CREATE PLAYER SPRITE
    this.player = new Player(
      this.matter.world,
      window.game.scale.width / 10,
      window.game.scale.height / 2,
      'player-top',
    );

    // CREATE BACKGROUND SPRITE
    this.backgroundIcebergs = this.add.sprite(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'background-icebergs-top',
    );
    this.backgroundIcebergs.displayWidth = window.game.scale.width + 20;
    this.backgroundIcebergs.displayHeight = window.game.scale.height;
    this.backgroundIcebergs.setDepth(-1);

    // CREATE STATION SPRITE
    this.station = this.matter.add.image(
      window.game.scale.width - 100,
      window.game.scale.height / 2 + 10,
      'station-top',
      undefined,
      { isStatic: true },
    );
    this.station.scale = window.game.scale.height / window.game.scale.width;
    this.station.visible = false;
    this.station.setRectangle(
      (this.station.width / 2) * this.station.scale - 20,
      window.game.scale.height,
    );
    this.station.setStatic(true);

    // INITIALIZE ENEMIES SPRITES
    this.initEnemies();
    this.initInvisibleHitboxes();

    // CREATE GOAL ZONE
    this.goalZone = this.matter.add.sprite(
      window.game.scale.width - window.game.scale.width / 4,
      window.game.scale.height / 2,
      'goal-zone',
    );
    this.goalZone.setScale(0.4);
    this.goalZone.displayWidth = 210;
    this.goalZone.setStatic(true);
    this.goalZone.setSensor(true);
    this.goalZone.setDepth(-1);

    this.goalZone.setOnCollide(() => {
      GAME_SPEEDS[MOVEMENT_SPEED] = 0.39;
      GAME_SPEEDS[ROTATION_SPEED] = 0.16;

      this.cameras.main.pan(this.player.x, this.player.y, 1500);
      this.cameras.main.zoomTo(1.5, 1500);
    });

    // CREATE CAMERA
    this.cameras.main.setBounds(0, 0, window.game.scale.width, window.game.scale.height);
    this.cameras.main.setZoom(1);
    this.cameras.main.centerOn(0, 0);
  }

  update(): void {
    this.player.update();
    const ui = this.getUI();
    ui.setHealth(this.player.getHealth());

    if (this.goalZone.body) {
      if (
        this.player.x >= this.goalZone?.x - 50 &&
        (this.player.y >= this.goalZone?.y - 30 || this.player.y <= this.goalZone?.y + 30)
      ) {
        this.goalZone.destroy();
        this.scene.start('docking-scene');
        this.scene.stop();
      }
    }

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
        ui.sideSceneChange();
        this.scene.start('side-scene');
      }
    }

    switch (this.goalStage) {
      case 1000:
        this.goalStageRectangle = this.matter.add.sprite(
          window.game.scale.width - window.game.scale.width / 4,
          window.game.scale.height / 2,
          'goal-distance',
        );
        this.goalStageRectangle.setDisplaySize(250, 100);
        this.goalStageRectangle.setSensor(true);

        this.goalStageMessage = this.matter.add.sprite(
          window.game.scale.width - window.game.scale.width / 4,
          window.game.scale.height / 2 - 50,
          'goal-1000',
        );
        this.goalStageMessage.setScale(0.3);
        this.goalStageMessage.setStatic(true);
        this.goalStageMessage.setSensor(true);

        --this.goalStage;

        GAME_SPEEDS[MOVEMENT_SPEED] = 0.18;
        GAME_SPEEDS[ROTATION_SPEED] = 0.08;

        break;

      case 500:
        this.goalStageRectangle.setX(this.goalStageRectangle.x + 20);
        this.goalStageRectangle.setDisplaySize(220, 70);

        this.goalStageMessage.setTexture('goal-500');
        this.goalStageMessage.setX(this.goalStageMessage.x + 20);

        --this.goalStage;

        break;

      case 80:
        this.goalStageRectangle.setX(this.goalStageRectangle.x + 30);
        this.goalStageRectangle.setDisplaySize(200, 50);

        this.goalStageMessage.setTexture('goal-80');
        this.goalStageMessage.setX(this.goalStageMessage.x + 30);

        --this.goalStage;
        break;
    }
  }

  initEnemies(): void {
    this.icebergs = new Array(7);

    for (let i = 1; i <= 3; i++) {
      this.icebergs.push(
        new Enemy(
          this.matter.world,
          (window.game.scale.width / 8) * 2 * (i / 1.16),
          window.game.scale.height / 4 + Math.floor(Math.random() * (window.game.scale.height / 2)),
          `iceberg-${Math.floor(Math.random() * 3) + 1}`,
        ),
      );
    }
  }

  initInvisibleHitboxes() {
    this.topBarrier = this.matter.add.rectangle(
      window.game.scale.width / 2,
      0 + window.game.scale.height / 6 / 2,
      window.game.scale.width,
      window.game.scale.height / 6,
    );
    this.topBarrier.isStatic = true;

    this.bottomBarrier = this.matter.add.rectangle(
      window.game.scale.width / 2,
      window.game.scale.height - window.game.scale.height / 6 / 2,
      window.game.scale.width,
      window.game.scale.height / 6,
    );
    this.bottomBarrier.isStatic = true;
  }
}

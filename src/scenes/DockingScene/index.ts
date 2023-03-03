import { GameObjects, Scene } from 'phaser';
import { Player } from '../../entities/Player';
import { Enemy } from '../../entities/Enemy';
import { GAME_SPEEDS, MOVEMENT_SPEED, ROTATION_SPEED } from '../../constants';
import { UiScene } from '../UiScene';
import { FIRST_SCENE, SCENE_HEALTH, SECOND_SCENE } from '../../helpers';
import { IncomingMessage } from 'http';
import { getuid } from 'process';

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

  private goalStageMessage!: Phaser.Physics.Matter.Sprite;
  private continueButton!: GameObjects.Image;
  private closeButton!: GameObjects.Image;
  private popupBG!: GameObjects.Image;

  constructor() {
    super('docking-scene');
  }

  protected initEnemies(): void {
    for (let i = 1; i <= 3; i++) {
      this.icebergs.push(
        new Enemy(
          this.matter.world,
          (window.game.scale.width / 6) * 1.5 * (i / 1.1),
          window.game.scale.height / 4 + Math.floor(Math.random() * (window.game.scale.height / 2)),
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

    this.goalRect80 = this.matter.add.sprite(
      this.station.x - 350,
      window.game.scale.height / 2,
      'goal-distance',
    );
    this.goalRect80.setDisplaySize(250, 50);
    this.goalRect80.setStatic(true);
    this.goalRect80.setSensor(true);

    this.goalRect80.visible = false;
  }

  create() {
    //game start
    this.launchPlayer();
    //

    //
    this.background = this.add.image(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'background-docking',
    );
    this.background.setOrigin(0.5);

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
    this.station.setRectangle(400, window.game.scale.height);
    this.station.setStatic(true);
    this.popupBG = this.add.image(
      window.game.scale.width / 2,
      window.game.scale.height / 2,
      'popupBg',
    );
    this.popupBG.scale = 3;
    this.station.setOnCollide((obj: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      const ui = this.getUI();
      this.stopPlayer();
      ui.gameLose();
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
      if (this.player.x >= this.goalRect500.x + 100 && this.goalRect500.visible === true) {
        const ui = this.getUI();
        this.stopPlayer();
        ui.gameLose();
      }
    }
  }

  public stopPlayer(): void {
    GAME_SPEEDS[MOVEMENT_SPEED] = 0;
    GAME_SPEEDS[ROTATION_SPEED] = 0;
  }

  public launchPlayer(): void {
    GAME_SPEEDS[MOVEMENT_SPEED] = 0.8;
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
        .setInteractive()
        .on('pointerdown', () => {
          ui.showUI();
          this.goalRect500.destroy();
          this.goalRect500Pass = true;
          this.launchPlayer();
          this.destroyGoalStageMessage();
          this.goalRect80.visible = true;
        });
      this.continueButton.setDepth(51);
      this.closeButton = this.add
        .image(this.goalStageMessage.x + 380, this.goalStageMessage.y - 170, 'crossButton')
        .setInteractive()
        .setScrollFactor(0)
        .on('pointerdown', () => {
          ui.showUI();
          this.goalRect500.destroy();
          this.goalRect500Pass = true;
          this.launchPlayer();
          this.destroyGoalStageMessage();
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
        .setInteractive()
        .on('pointerdown', () => {
          ui.showUI();
          this.destroyGoalStageMessage();
          setTimeout(() => {
            this.scene.stop();
            this.scene.start('side-scene');
          }, 1000);
        });
      this.continueButton.setDepth(51);
      this.closeButton = this.add
        .image(this.goalStageMessage.x + 380, this.goalStageMessage.y - 170, 'crossButton')
        .setInteractive()
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
        this.player.y >= this.goalRect500?.y - 20 &&
        this.player.y <= this.goalRect500?.y + 20
      ) {
        this.goalRect500Inside = true;
        console.log('inside');
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

  private check80Zone(): void {
    if (!this.goalRect80Inside) {
      if (
        this.player.x >= this.goalRect80?.x &&
        this.player.y >= this.goalRect80?.y - 20 &&
        this.player.y <= this.goalRect80?.y + 20
      ) {
        this.goalRect80Inside = true;
        console.log('inside');
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

// zoneKnock() {
//   GAME_SPEEDS[MOVEMENT_SPEED] = 0;
//   GAME_SPEEDS[ROTATION_SPEED] = 0;
//   console.log('врезался');
//   const ui = this.getUI();
//   ui.gameLose();
// }

// protected areaHitboxes(divider: number, width: number, zone: Phaser.Physics.Matter.Sprite) {
//   this.topBarrier = this.matter.add.rectangle(
//     zone.x,
//     zone.y - zone.y / divider,
//     zone.width / width,
//     window.game.scale.height / 2 - zone.y / 3,
//   );
//   this.topBarrier.isStatic = true;
//   this.topBarrier.isSensor = true;

//   this.bottomBarrier = this.matter.add.rectangle(
//     zone.x,
//     zone.y + zone.y / divider,
//     zone.width / width,
//     window.game.scale.height / 2 - zone.y / 3,
//   );
//   this.bottomBarrier.isStatic = true;
//   this.bottomBarrier.isSensor = true;
// }

//  this.areaHitboxes(2.3, 8, this.goalRect500);

// this.matter.overlap(this.player, [this.bottomBarrier, this.topBarrier], () => {
//   this.zoneKnock();
// });

///

// zonePing(pingDelay: number, state: number): void {
//   setTimeout(() => {
//     this.goalStageRectangle.visible = false;
//   }, pingDelay);
//   setTimeout(() => {
//     this.goalStageRectangle.visible = true;
//   }, pingDelay + 1000);
//   setTimeout(() => {
//     this.goalStageRectangle.visible = false;
//   }, pingDelay + 2000);
//   setTimeout(() => {
//     this.goalStageRectangle.visible = true;
//   }, pingDelay + 3000);
//   setTimeout(() => {
//     if (state === 500) {
//       this.goalStageRectangle.setX(window.game.scale.width / 2);
//       this.goalStageRectangle.setDisplaySize(300, 200);
//       this.areaHitboxes(1.9, 6.5);
//     } else if (state === 80) {
//       this.goalStageRectangle.setX(this.station.x - 350);
//       this.goalStageRectangle.setDisplaySize(220, 50);
//       this.areaHitboxes(2.5, 9);
//     }
//     GAME_SPEEDS[MOVEMENT_SPEED] = 0.8;
//     GAME_SPEEDS[ROTATION_SPEED] = 0.35;
//   }, pingDelay + 4000);
// }
///

// switch (this.goalStage) {
//   case 1000:
//     this.goalStageRectangle = this.matter.add.sprite(
//       window.game.scale.width / 5,
//       window.game.scale.height / 2,
//       'goal-distance',
//     );
//     this.goalStageRectangle.setDisplaySize(500, 300);
//     this.goalStageRectangle.setSensor(true);
//     this.areaHitboxes(1.65, 4);
//     --this.goalStage;
//     break;

//   case 500:
//     this.popupBG.visible = true;
//     this.goalStageMessage = this.matter.add.sprite(
//       window.game.scale.width / 2,
//       window.game.scale.height / 2,
//       '1000meters',
//     );
//     this.goalStageMessage.setScale(1);
//     this.goalStageMessage.setStatic(true);
//     this.goalStageMessage.setSensor(true);
//     this.continueButton = this.add
//       .image(
//         this.goalStageMessage.x,
//         this.goalStageMessage.y + this.goalStageMessage.y / 5,
//         'continueButton',
//       )
//       .setScrollFactor(0)
//       .setInteractive()
//       .on('pointerup', () => {
//         this.goalStageMessage.destroy();
//         this.continueButton.destroy();
//         this.closeButton.destroy();
//         this.zonePing(1000, 500);
//         this.popupBG.visible = false;
//       });
//     this.continueButton.setScale(1);
//     this.continueButton.setZ(2);
//     this.closeButton = this.add
//       .image(this.game.scale.width / 2 + 380, this.game.scale.height / 2 - 170, 'crossButton')
//       .setScrollFactor(0)
//       .setInteractive()
//       .on('pointerup', () => {
//         this.goalStageMessage.destroy();
//         this.continueButton.destroy();
//         this.closeButton.destroy();
//         this.zonePing(1000, 500);
//         this.popupBG.visible = false;
//       });
//     --this.goalStage;
//     break;

//   case 80:
//     GAME_SPEEDS[MOVEMENT_SPEED] = 0;
//     GAME_SPEEDS[ROTATION_SPEED] = 0;
//     this.goalStageMessage = this.matter.add.sprite(
//       window.game.scale.width / 2,
//       window.game.scale.height / 2,
//       '500meters',
//     );
//     this.popupBG.visible = true;
//     this.goalStageMessage.setScale(1);
//     this.goalStageMessage.setStatic(true);
//     this.goalStageMessage.setSensor(true);
//     this.continueButton = this.add
//       .image(
//         this.goalStageMessage.x,
//         this.goalStageMessage.y + this.goalStageMessage.y / 5,
//         'continueButton',
//       )
//       .setScrollFactor(0)
//       .setInteractive()
//       .on('pointerup', () => {
//         this.goalStageMessage.destroy();
//         this.continueButton.destroy();
//         this.closeButton.destroy();
//         this.zonePing(1000, 80);
//         this.popupBG.visible = false;
//       });
//     this.continueButton.setScale(1);
//     this.continueButton.setZ(2);
//     this.closeButton = this.add
//       .image(this.game.scale.width / 2 + 380, this.game.scale.height / 2 - 170, 'crossButton')
//       .setScrollFactor(0)
//       .setInteractive()
//       .on('pointerup', () => {
//         this.goalStageMessage.destroy();
//         this.continueButton.destroy();
//         this.closeButton.destroy();
//         this.zonePing(1000, 80);
//         this.popupBG.visible = false;
//       });
//     --this.goalStage;
//     break;
// }

// zonesStaging(): void {
//   if (this.goalStage > 500) {
//     if (
//       this.player.x >= this.goalStageRectangle?.x - 30 &&
//       (this.player.y >= this.goalStageRectangle?.y - 30 ||
//         this.player.y <= this.goalStageRectangle?.y + 30)
//     ) {
//       this.goalStage = 500;
//     }
//   }

//   if (this.goalStage > 80) {
//     if (
//       this.player.x >= this.goalStageRectangle?.x + 30 &&
//       (this.player.y >= this.goalStageRectangle?.y - 30 ||
//         this.player.y <= this.goalStageRectangle?.y + 30)
//     ) {
//       this.goalStage = 80;
//     }
//   }
//   if (this.goalStage === 79) {
//     if (this.player.x >= this.station.x - 350) {
//       const ui = this.getUI();
//       GAME_SPEEDS[MOVEMENT_SPEED] = 0;
//       GAME_SPEEDS[ROTATION_SPEED] = 0;
//       this.zonePing(1000, 0);
//       setTimeout(() => {
//         ui.sideSceneChange();
//         this.scene.stop();
//         this.scene.start('side-scene');
//       }, 5000);
//       this.goalStage--;
//     }
//   }

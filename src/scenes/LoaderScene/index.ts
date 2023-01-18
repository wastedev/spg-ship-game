import { Scene, Types } from 'phaser';

export class LoaderScene extends Scene {
  constructor() {
    super('loader-scene');
  }

  create() {
    console.log('loader test');
    this.scene.start('preload-scene');
  }
}

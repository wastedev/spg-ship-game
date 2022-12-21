import { Scene } from 'phaser';

export class UiScene extends Scene {
  constructor() {
    super('ui-scene');
  }

  create(): void {
    console.log('UiScene');
  }
}

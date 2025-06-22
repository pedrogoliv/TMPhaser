import { BaseLevelScene } from './base-level-scene.js';

export class Level1Scene extends BaseLevelScene {
  constructor() {
    super('Level1Scene');
  }

  init() {
    this.levelConfig = {
      enemyLimit: 9,
      scoutInterval: 3500,
      fighterInterval: 2211,
      nextLevel: 'Level2Scene',
      starThresholds: [1800, 1200, 800],
    };
  }

  create() {
    super.init(this.levelConfig);
    super.create();
  }
}

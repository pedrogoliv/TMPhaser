import { BaseLevelScene } from './base-level-scene.js';

export class Level5Scene extends BaseLevelScene {
  constructor() {
    super('Level5Scene');
  }

  init() {
    this.levelConfig = {
      modo: 'sniper',
      scoutInterval: 2000,
      fighterInterval: 3400,
      enemyLimit: 9999,
      killObjective: 10,
      bulletThresholds: [18, 30, 50],
      nextLevel: 'Level6Scene',
    };
  }

  create() {
    super.init(this.levelConfig);
    super.create();
  }
}

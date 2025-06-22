import { BaseLevelScene } from './base-level-scene.js';

export class Level6Scene extends BaseLevelScene {
  constructor() {
    super('Level6Scene');
  }

  init() {
    this.levelConfig = {
      modo: 'tempo-kill',
      scoutInterval: 2000,
      fighterInterval: 4000,
      enemyLimit: 9999,
      killObjective: 10,
      nextLevel: null,
      timeThresholds: [1, 40000, 70000], 
    };
  }

  create() {
    super.init(this.levelConfig);
    super.create();
  }
}

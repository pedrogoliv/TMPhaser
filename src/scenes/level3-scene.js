import { BaseLevelScene } from './base-level-scene.js';

export class Level3Scene extends BaseLevelScene {
  constructor() {
    super('Level3Scene');
  }

  init() {
    this.levelConfig = {
      modo: 'tempo',
      scoutInterval: 2500,
      fighterInterval: 4500,
      tempoLimite: 30000, 
      enemyLimit: 9999, 
      nextLevel: 'Level4Scene', 
      starKillThresholds: [10, 7, 3], 
    };
  }

  create() {
    super.init(this.levelConfig);
    super.create();

    this.time.delayedCall(this.levelConfig.tempoLimite, () => {
      this.onLevelComplete();
    });
  }
}

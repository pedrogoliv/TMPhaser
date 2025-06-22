import { BaseLevelScene } from './base-level-scene.js';

export class Level2Scene extends BaseLevelScene {
  constructor() {
    super('Level2Scene');
  }

  init() {
    this.levelConfig = {
      modo: 'tempo',
      enemyLimit: 50,
      scoutInterval: 3000,
      fighterInterval: 2211,
      nextLevel: 'Level3Scene',
      starThresholds: [1800, 1200, 800],
      tempoLimite: 30000,
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

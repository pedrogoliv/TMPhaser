import { BaseLevelScene } from './base-level-scene.js';

export class Level2Scene extends BaseLevelScene {
  constructor() {
    super('Level2Scene');
  }

  init() {
    this.levelConfig = {
      modo: 'tempo',
      enemyLimit: 999,
      scoutInterval: 2500,
      fighterInterval: 1511,
      nextLevel: 'Level3Scene',
      starThresholds: [1800, 1200, 800],
      tempoLimite: 45000,
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

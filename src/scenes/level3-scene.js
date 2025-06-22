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
      tempoLimite: 30000, // 30 segundos
      enemyLimit: 9999, // ilimitado até o tempo acabar
      nextLevel: 'Level4Scene', // ou 'Level4Scene' se tiver
      starKillThresholds: [10, 7, 3], // número de inimigos destruídos
    };
  }

  create() {
    super.init(this.levelConfig);
    super.create();

    // Terminar o nível ao fim do tempo limite
    this.time.delayedCall(this.levelConfig.tempoLimite, () => {
      this.onLevelComplete();
    });
  }
}

// @ts-nocheck
import { BaseLevelScene } from './base-level-scene.js';

export class Level6Scene extends BaseLevelScene {
  constructor() {
    super('Level6Scene');
  }

  init() {
    this.levelConfig = {
      modo: 'tempo-kill',
      scoutInterval: 2000,
      fighterInterval: 3000,
      enemyLimit: 9999,
      killObjective: 10,
      nextLevel: null,
      timeThresholds: [50000, 35000, 25000],
    };
  }

  create() {
    super.init(this.levelConfig);
    super.create();

    this.scene.launch('InstructionScene', {
      parentScene: this.scene.key,
      levelConfig: this.levelConfig,
      getDescricaoNivel: this.getDescricaoNivel.bind(this),
    });
    this.scene.pause(this.scene.key);
  }

  getDescricaoNivel(config) {
    const [three, two, one] = config.timeThresholds;
    return `Elimina ${config.killObjective} inimigos o mais rápido possível!\n\n` +
           `3 Estrelas: < ${three / 1000}s\n` +
           `2 Estrelas: < ${two / 1000}s\n` +
           `1 Estrela: < ${one / 1000}s`;
  }
}

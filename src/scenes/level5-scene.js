// @ts-nocheck
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

    this.scene.launch('InstructionScene', {
      parentScene: this.scene.key,
      levelConfig: this.levelConfig,
      getDescricaoNivel: this.getDescricaoNivel.bind(this),
    });
    this.scene.pause(this.scene.key);
  }

  getDescricaoNivel(config) {
    const [three, two, one] = config.bulletThresholds ?? [18, 30, 50];
    return `Elimina ${config.killObjective} inimigos com o mínimo de balas!\n\n` +
           `3 Estrelas: até ${three} balas\n` +
           `2 Estrelas: até ${two} balas\n` +
           `1 Estrela: até ${one} balas`;
  }
}

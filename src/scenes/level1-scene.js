// @ts-nocheck
import { BaseLevelScene } from './base-level-scene.js';

export class Level1Scene extends BaseLevelScene {
  constructor() {
    super('Level1Scene');
  }

  init() {
    this.levelConfig = {
      enemyLimit: 20,
      scoutInterval: 3500,
      fighterInterval: 2211,
      nextLevel: 'Level2Scene',
      starThresholds: [1800, 1200, 800],
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
    const [three, two, one] = config.starThresholds ?? [1800, 1200, 800];
    return `Faz o maior número de pontos possível!\n\n` +
           `3 Estrelas: ${three}+ pontos\n` +
           `2 Estrelas: ${two}+ pontos\n` +
           `1 Estrela: ${one}+ pontos`;
  }
}

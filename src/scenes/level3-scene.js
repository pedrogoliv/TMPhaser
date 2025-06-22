// @ts-nocheck
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

    this.scene.launch('InstructionScene', {
      parentScene: this.scene.key,
      levelConfig: this.levelConfig,
      getDescricaoNivel: this.getDescricaoNivel.bind(this),
    });
    this.scene.pause(this.scene.key);

    this.time.delayedCall(this.levelConfig.tempoLimite, () => {
      this.onLevelComplete();
    });
  }

  getDescricaoNivel(config) {
    const [three, two, one] = config.starKillThresholds ?? [10, 7, 3];
    return `Sobrevive e elimina o máximo que conseguires!\n\n` +
           `3 Estrelas: ${three}+ kills\n` +
           `2 Estrelas: ${two}+ kills\n` +
           `1 Estrela: ${one}+ kills`;
  }
}

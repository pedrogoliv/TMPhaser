// @ts-nocheck
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
      fighterInterval: 1500,
      nextLevel: 'Level3Scene',
      tempoLimite: 60000,
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

  getDescricaoNivel() {
    return `Sobrevive 60 segundos!\n\n` +
           `3 Estrelas: 3 vidas restantes\n` +
           `2 Estrelas: 2 vidas\n` +
           `1 Estrela: 1 vida`;
  }
}

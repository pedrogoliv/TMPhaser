// @ts-nocheck
import { BaseLevelScene } from './base-level-scene.js';

export class Level4Scene extends BaseLevelScene {
  constructor() {
    super('Level4Scene');
  }

  init() {
    this.levelConfig = {
      modo: 'sem-armas',
      scoutInterval: 1000,
      fighterInterval: 1250,
      tempoLimite: 30000,
      enemyLimit: 9999,
      nextLevel: 'Level5Scene',
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

    if (this.player?.weaponComponent) {
      this.player.weaponComponent.disableWeapon?.();
    }

    this.time.delayedCall(this.levelConfig.tempoLimite, () => {
      this.onLevelComplete();
    });
  }

  getDescricaoNivel() {
    return `Sobrevive 30 segundos sem armas!\n\n` +
           `3 Estrelas: 3 vidas restantes\n` +
           `2 Estrelas: 2 vidas\n` +
           `1 Estrela: 1 vida`;
  }
}

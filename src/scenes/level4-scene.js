import { BaseLevelScene } from './base-level-scene.js';

export class Level4Scene extends BaseLevelScene {
  constructor() {
    super('Level4Scene');
  }

  init() {
    this.levelConfig = {
      modo: 'sem-armas',
      scoutInterval: 1000,
      fighterInterval: 1500,
      tempoLimite: 30000, 
      enemyLimit: 9999,
      nextLevel: 'Level5Scene',
    };
  }

  create() {
    super.init(this.levelConfig);
    super.create();

    if (this.player?.weaponComponent) {
      this.player.weaponComponent.disableWeapon?.();
    }

    this.time.delayedCall(this.levelConfig.tempoLimite, () => {
      this.onLevelComplete();
    });
  }
}

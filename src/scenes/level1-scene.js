import { BaseLevelScene } from './base-level-scene.js';

export class Level1Scene extends BaseLevelScene {
  constructor() {
    super('Level1Scene');
  }

  init() {
    this.levelConfig = {
      enemyLimit: 9,
      scoutInterval: 3500,
      fighterInterval: 2211,
      nextLevel: 'Level2Scene'
    };
  }

  create() {
    super.init(this.levelConfig); // <-- passa a config para o BaseLevelScene
    super.create();               // <-- depois chama o create
  }
}

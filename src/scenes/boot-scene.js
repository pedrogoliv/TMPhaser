import Phaser from '../lib/phaser.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this.load.json('animations_json', 'assets/data/animations.json'); // Carrega o arquivo JSON de animações
  }

  create() {
    console.log('BootScene carregada'); // Log para verificar se a cena foi carregada corretamente
    this.scene.start('PreloadScene'); // Inicia a cena de preload após o carregamento dos assets
}
}

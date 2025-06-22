import Phaser from '../lib/phaser.js';

export class MapScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MapScene' });
  }

  preload() {
    this.load.image('map_bg', 'assets/images/menu/BG.png');
    this.load.image('lvl1', 'assets/images/map/lvl1.png');
    this.load.image('lvl2', 'assets/images/map/lvl2.png');
    this.load.image('lvl3', 'assets/images/map/lvl3.png');
    this.load.image('map_header', 'assets/images/map/Header.png');
    this.load.image('backward_btn', 'assets/images/map/Backward_BTN.png');
    this.load.image('lvlblock', 'assets/images/map/lvlblock.png');
  }

  create() {
    const { width, height } = this.scale;

    // Fundo
    this.add.image(width / 2, height / 2, 'map_bg')
      .setOrigin(0.5)
      .setDisplaySize(width, height);

    // Cabeçalho
    this.add.image(width / 2, 170, 'map_header')
      .setScale(0.06)
      .setOrigin(0.5);

    // Ver níveis desbloqueados
    const unlockedLevels = JSON.parse(localStorage.getItem('unlockedLevels')) || [1];

    // Posicionamento
    const spacing = 100;
    const startX = width / 2 - spacing;
    const startY = height / 2;
    
    const levels = [1, 2, 3];

    levels.forEach((level, index) => {
      const x = startX + spacing * index;
      const isUnlocked = unlockedLevels.includes(level);
      const texture = isUnlocked ? `lvl${level}` : 'lvlblock';

      const btn = this.add.image(x, startY, texture)
        .setScale(0.07)
        .setOrigin(0.5);

      if (isUnlocked) {
        btn.setInteractive();
        btn.on('pointerdown', () => {
          this.scene.start(`Level${level}Scene`);
        });
      }
    });

    // Botão Voltar
    this.add.image(50, 50, 'backward_btn')
      .setInteractive()
      .setScale(0.2)
      .setOrigin(0.5)
      .on('pointerdown', () => this.scene.start('MenuScene'));
  }
}

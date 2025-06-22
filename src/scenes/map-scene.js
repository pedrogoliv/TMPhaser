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
    this.load.image('lvl4', 'assets/images/map/lvl4.png');
    this.load.image('lvl5', 'assets/images/map/lvl5.png');
    this.load.image('lvl6', 'assets/images/map/lvl6.png');
    this.load.image('map_header', 'assets/images/map/Header.png');
    this.load.image('backward_btn', 'assets/images/map/Backward_BTN.png');
    this.load.image('lvlblock', 'assets/images/map/lvlblock.png');
  }

  create() {
    const { width, height } = this.scale;

    this.add.image(width / 2, height / 2, 'map_bg')
      .setOrigin(0.5)
      .setDisplaySize(width, height);

    this.add.image(width / 2, 120, 'map_header')
      .setScale(0.06)
      .setOrigin(0.5);

    const unlockedLevels = JSON.parse(localStorage.getItem('unlockedLevels')) || [1];

    const levels = [1, 2, 3, 4, 5, 6];
    const spacingX = 90;
    const spacingY = 100;
    const startX = width / 2 - spacingX;
    const startY = height / 2;

    levels.forEach((level, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3); 

      const x = startX + col * spacingX;
      const y = startY + row * spacingY;

      const isUnlocked = unlockedLevels.includes(level);
      const texture = isUnlocked ? `lvl${level}` : 'lvlblock';

      const btn = this.add.image(x, y, texture)
        .setScale(0.07)
        .setOrigin(0.5);

      if (isUnlocked) {
        btn.setInteractive({ useHandCursor: true });
        btn.on('pointerdown', () => {
          this.scene.start(`Level${level}Scene`);
        });
      }
    });

    this.add.image(50, 50, 'backward_btn')
      .setInteractive({ useHandCursor: true })
      .setScale(0.2)
      .setOrigin(0.5)
      .on('pointerdown', () => this.scene.start('MenuScene'));
  }
}

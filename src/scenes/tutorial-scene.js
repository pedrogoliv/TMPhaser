import Phaser from '../lib/phaser.js';

export class TutorialScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TutorialScene' });
  }

  create() {
    const { width, height } = this.scale;
    const centerX = width / 2;
    const topY = height / 2 - 100;

    // Fundo escuro
    this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0);

    // Mover: título
    this.add.text(centerX, topY, 'Mover:', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Mover: teclas
    this.add.text(centerX, topY + 30, '← / →   ou   A / D', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#ffcc00',
    }).setOrigin(0.5);

    // Disparar: título
    this.add.text(centerX, topY + 80, 'Disparar:', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Disparar: teclas
    this.add.text(centerX, topY + 110, 'Espaço  ou  Botão esquerdo do rato', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#66ccff',
    }).setOrigin(0.5);

    // Instrução de iniciar
    this.add.text(centerX, topY + 170, 'Pressiona ESPAÇO ou clique para começar', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#cccccc',
    }).setOrigin(0.5);

    // Iniciar com ESPAÇO ou clique do rato
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });

    this.input.once('pointerdown', () => {
      this.scene.start('GameScene');
    });
  }
}

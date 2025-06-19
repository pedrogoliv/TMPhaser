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

    const baseStyle = {
      fontFamily: 'Arial',
      fontSize: '20px',
      resolution: 2, // força melhor render
    };

    const labelStyle = {
      ...baseStyle,
      color: '#ffffff',
    };

    const moveKeyStyle = {
      ...baseStyle,
      fontSize: '22px',
      color: '#ffcc00',
    };

    const shootKeyStyle = {
      ...baseStyle,
      fontSize: '22px',
      color: '#66ccff',
    };

    const infoStyle = {
      ...baseStyle,
      fontSize: '16px',
      color: '#cccccc',
    };

    // Mover
    this.add.text(centerX, topY, 'Mover:', labelStyle).setOrigin(0.5).setPipeline('TextureTintPipeline');
    this.add.text(centerX, topY + 30, '← / →   ou   A / D', moveKeyStyle).setOrigin(0.5).setPipeline('TextureTintPipeline');

    // Disparar
    this.add.text(centerX, topY + 80, 'Disparar:', labelStyle).setOrigin(0.5).setPipeline('TextureTintPipeline');
    this.add.text(centerX, topY + 110, 'Espaço ou Botão esquerdo do rato', shootKeyStyle).setOrigin(0.5).setPipeline('TextureTintPipeline');

    // Instrução para começar
    this.add.text(centerX, topY + 170, 'Pressiona ESPAÇO para começar', infoStyle)
      .setOrigin(0.5)
      .setPipeline('TextureTintPipeline');

    // Iniciar com ESPAÇO ou clique
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });

  }
}

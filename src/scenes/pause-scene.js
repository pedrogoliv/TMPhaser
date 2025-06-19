import Phaser from '../lib/phaser.js';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene' });
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Fundo escurecido
    const overlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.6);
    overlay.setOrigin(0).setDepth(10);

    // Texto "EM PAUSA"
    const title = this.add.text(centerX, centerY - 80, 'EM PAUSA', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '30px',
      color: '#ff2f66',
    })
      .setOrigin(0.5)
      .setAlpha(0)
      .setScale(0.4)
      .setDepth(10);

    this.tweens.add({
      targets: title,
      alpha: 1,
      scale: 1,
      duration: 500,
      ease: 'Back.Out',
    });

    // Estilo dos botões
    const buttonStyle = {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { left: 12, right: 12, top: 6, bottom: 6 },
      fixedWidth: 320,
      align: 'center',
    };

    // Botão RESUMIR
    const resumeBtn = this.add.text(centerX, centerY + 10, 'RESUMIR', buttonStyle)
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(10);

    resumeBtn.on('pointerdown', () => {
      // Retomar música se estiver pausada
      const music = this.sound.get('music');
      if (music?.isPaused) music.resume();

      this.scene.stop(); // fecha PauseScene
      this.scene.resume('GameScene'); // retoma lógica
    });

    resumeBtn.on('pointerover', () => resumeBtn.setStyle({ backgroundColor: '#ff2f66', color: '#000000' }));
    resumeBtn.on('pointerout', () => resumeBtn.setStyle({ backgroundColor: '#000000', color: '#ffffff' }));

    // Botão MENU
    const menuBtn = this.add.text(centerX, centerY + 60, 'MENU', buttonStyle)
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(10);

    menuBtn.on('pointerdown', () => {
      this.sound.stopAll(); // Garante música desligada
      this.scene.stop('GameScene');
      this.scene.start('MenuScene');
    });

    menuBtn.on('pointerover', () => menuBtn.setStyle({ backgroundColor: '#ff2f66', color: '#000000' }));
    menuBtn.on('pointerout', () => menuBtn.setStyle({ backgroundColor: '#000000', color: '#ffffff' }));
  }
}

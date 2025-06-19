import Phaser from '../lib/phaser.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    this.load.image('header', 'assets/images/menu/Header.png');
    this.load.image('start_btn', 'assets/images/menu/Start_BTN.png');
    this.load.image('exit_btn', 'assets/images/menu/Exit_BTN.png');
    this.load.image('settings_btn', 'assets/images/menu/Settings_BTN.png');

    
  }

  create() {
    const { width, height } = this.scale;

    // Header (título com imagem) → mais pequeno e mais abaixo
    this.add.image(width / 2, height / 2 - 100, 'header')
      .setScale(0.10)
      .setOrigin(0.5);

    // Botão Start → mais pequeno e mais junto ao fundo
    const startBtn = this.add.image(width / 2, height - 120, 'start_btn')
      .setInteractive()
      .setScale(0.4);

    startBtn.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // Botão Exit → mesmo junto ao fundo, com pequeno espaço
    const exitBtn = this.add.image(width / 2, height - 60, 'exit_btn')
      .setInteractive()
      .setScale(0.4);

    exitBtn.on('pointerdown', () => {
      alert('Obrigado por jogar!');
    });

    // Botão Settings no canto superior direito (fica igual)
    const settingsBtn = this.add.image(width - 40, 40, 'settings_btn')
      .setInteractive()
      .setScale(0.18);

    settingsBtn.on('pointerdown', () => {
      alert('Definições (ainda por implementar)');
    });


  }

  
}

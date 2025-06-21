import Phaser from '../lib/phaser.js';

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VictoryScene' });
  }

  preload() {
    this.load.image('Window', 'assets/images/victory/Window.png');
    this.load.image('Header', 'assets/images/victory/Header.png');

    this.load.image('Replay_BTN', 'assets/images/victory/Replay_BTN.png');
    this.load.image('Play_BTN', 'assets/images/victory/Play_BTN.png');
    this.load.image('Close_BTN', 'assets/images/victory/Close_BTN.png');

    this.load.image('Star_01', 'assets/images/victory/Star_01.png');
    this.load.image('Star_02', 'assets/images/victory/Star_02.png');
    this.load.image('Star_03', 'assets/images/victory/Star_03.png');
  }

  init(data) {
    this.score = data.score;
    this.nextLevel = data.nextLevel;
    this.previousScene = data.previousScene ?? 'Level1Scene';
    this.baseScene = data.baseScene ?? 'BaseLevelScene';
    this.stars = data.stars ?? ['Star_01', 'Star_01', 'Star_01'];
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Fundo escurecido (simulação de blur)
    const blurOverlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.4);
    blurOverlay.setOrigin(0);

    // Janela principal
    this.add.image(centerX, centerY, 'Window').setOrigin(0.5).setScale(0.35);

    // Cabeçalho com “YOU WIN!”
    this.add.image(centerX, centerY - 163, 'Header').setOrigin(0.5).setScale(0.5);

    // Estrelas (centradas)
    const starSpacing = 90;
    for (let i = 0; i < 3; i++) {
      const starKey = this.stars[i];
      this.add.image(centerX + (i - 1) * starSpacing, centerY - 40, starKey)
        .setOrigin(0.5)
        .setScale(0.30);
    }

    // Botões (mais abaixo)
    const buttonY = centerY + 110;
    const buttonSpacing = 100;
    const buttonScale = 0.35;

    this.add.image(centerX - buttonSpacing, buttonY, 'Replay_BTN')
      .setOrigin(0.5)
      .setScale(buttonScale)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.restartLevel());

    this.add.image(centerX, buttonY, 'Play_BTN')
      .setOrigin(0.5)
      .setScale(buttonScale)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.goToNextLevel());

    this.add.image(centerX + buttonSpacing, buttonY, 'Close_BTN')
      .setOrigin(0.5)
      .setScale(buttonScale)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('MenuScene'));
  }

  restartLevel() {
    this.scene.stop();
    this.scene.stop(this.previousScene);
    this.scene.start(this.previousScene);
  }

  goToNextLevel() {
    if (this.nextLevel) {
      this.scene.stop(this.baseScene);
      this.scene.start(this.nextLevel);
    }
  }
}

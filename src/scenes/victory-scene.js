import Phaser from '../lib/phaser.js';

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VictoryScene' });
  }

  preload() {
    this.load.image('Window', 'assets/images/victory/Window.png');
    this.load.image('YouWin', 'assets/images/victory/YouWin.png');
    this.load.image('YouLose', 'assets/images/victory/YouLose.png');

    this.load.image('Replay_BTN', 'assets/images/victory/Replay_BTN.png');
    this.load.image('Play_BTN', 'assets/images/victory/Play_BTN.png');
    this.load.image('Close_BTN', 'assets/images/victory/Close_BTN.png');

    this.load.image('Star_01', 'assets/images/victory/Star_01.png');
    this.load.image('Star_02', 'assets/images/victory/Star_02.png');
    this.load.image('Star_03', 'assets/images/victory/Star_03.png');
  }

  init(data) {
    this.score = data.score ?? 0;
    this.nextLevel = data.nextLevel;
    this.previousScene = data.previousScene ?? 'Level1Scene';
    this.baseScene = data.baseScene ?? 'BaseLevelScene';

    this.stars = (data.stars ?? []).slice(0, 3);
    while (this.stars.length < 3) {
      this.stars.push('Star_01');
    }
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    const venceu = !(this.stars.every(s => s === 'Star_01') || 
                (this.stars[0] === 'Star_02' && this.stars[1] === 'Star_01' && this.stars[2] === 'Star_01'));

    if (venceu && this.nextLevel) {
      const unlockedLevels = JSON.parse(localStorage.getItem('unlockedLevels')) || [1];
      const nextLevelNum = parseInt(this.nextLevel.replace(/\D/g, ''));
      if (!unlockedLevels.includes(nextLevelNum)) {
        unlockedLevels.push(nextLevelNum);
        localStorage.setItem('unlockedLevels', JSON.stringify(unlockedLevels));
      }
    }

    // Fundo escurecido
    const blur = this.add.graphics();
    blur.fillStyle(0x000000, 0.6);
    blur.fillRect(0, 0, this.scale.width, this.scale.height);

    // Janela
    this.add.image(centerX, centerY, 'Window').setOrigin(0.5).setScale(0.35);

    // Texto YOU WIN ou YOU LOSE
    const texto = venceu ? 'YouWin' : 'YouLose';
    this.add.image(centerX, centerY - 160, texto).setOrigin(0.5).setScale(0.65);

    // Estrelas
    const starSpacing = 90;
    for (let i = 0; i < 3; i++) {
      const starKey = venceu ? this.stars[i] : 'Star_01';
      this.add.image(centerX + (i - 1) * starSpacing, centerY - 30, starKey)
        .setOrigin(0.5)
        .setScale(0.30);
    }

    // Botões
    const buttonY = centerY + 100;
    const buttonSpacing = 100;
    const buttonScale = 0.35;

    // Replay
    this.add.image(centerX - buttonSpacing, buttonY, 'Replay_BTN')
      .setOrigin(0.5)
      .setScale(buttonScale)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.restartLevel());

    // Play: só se venceu
    if (venceu) {
      this.add.image(centerX, buttonY, 'Play_BTN')
        .setOrigin(0.5)
        .setScale(buttonScale)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.goToNextLevel());
    }

    // Menu
    this.add.image(centerX + buttonSpacing, buttonY, 'Close_BTN')
      .setOrigin(0.5)
      .setScale(buttonScale)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.stop(this.previousScene);
        this.scene.stop(this.baseScene);
        this.scene.stop();
        this.scene.start('MenuScene');
      });
  }

  restartLevel() {
    this.scene.stop();
    this.scene.stop(this.previousScene);
    this.scene.start(this.previousScene);
  }

  goToNextLevel() {
    if (this.nextLevel) {
      this.scene.stop(this.baseScene);

      const unlockedLevels = JSON.parse(localStorage.getItem('unlockedLevels')) || [1];
      if (!unlockedLevels.includes(parseInt(this.nextLevel.replace(/\D/g, '')))) {
        unlockedLevels.push(parseInt(this.nextLevel.replace(/\D/g, '')));
        localStorage.setItem('unlockedLevels', JSON.stringify(unlockedLevels));
      }

      this.scene.start(this.nextLevel);
    }
  }
}

import { getHighScores } from '../utils/highscore-utils.js';

export class HighScoreScene extends Phaser.Scene {
  constructor() {
    super('HighScoreScene');
  }

  preload() {
    this.load.image('ratingHeader', 'assets/images/score/Header.png');
    this.load.image('ratingWindow', 'assets/images/score/Window.png'); 
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x000000, 0.4).setOrigin(0);

    const window = this.add.image(width / 2, height / 2, 'ratingWindow').setScale(0.25).setOrigin(0.5);

    this.add.image(width / 2, height / 2 - 155, 'ratingHeader').setScale(0.40).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 110, 'TOP 5 SCORES', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '16px',
      color: '#ffffff',
    }).setOrigin(0.5);

    const scores = getHighScores();

    if (scores.length === 0) {
      this.add.text(width / 2, height / 2, 'Sem registos ainda!', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '12px',
        color: '#ffffff',
      }).setOrigin(0.5);
    } else {
      scores.forEach((entry, index) => {
        this.add.text(width / 2, height / 2 - 70 + index * 40, `${index + 1}. ${entry.name.padEnd(10)} ${entry.score}`, {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '12px',
          color: '#ffffff',
        }).setOrigin(0.5);
      });
    }
  }
}

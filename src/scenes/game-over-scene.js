import { saveHighScore } from '../utils/highscore-utils.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.score = data.score ?? 0;
  }

create() {
  const { width, height } = this.scale;

  this.input.keyboard.enabled = false;
  this.input.keyboard.manager.enabled = false;


  this.add.rectangle(0, 0, width, height, 0x000000, 0.75).setOrigin(0);

  this.add.text(width / 2, height / 3, 'GAME OVER', {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '40px',
    color: '#ff2f66',
  }).setOrigin(0.5);

  this.add.text(width / 2, height / 2.1, `Score: ${this.score}`, {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '16px',
    color: '#ffffff',
  }).setOrigin(0.5);

  const canvas = this.sys.game.canvas;
  const rect = canvas.getBoundingClientRect();

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'O teu nome';
  input.maxLength = 10;
  input.style.position = 'absolute';
  input.style.zIndex = '1000';
  input.style.width = '150px';
  input.style.fontSize = '16px';

  const inputX = rect.left + rect.width / 2 - 75;
  const inputY = rect.top + rect.height / 2 + 80;

  input.style.left = `${inputX}px`;
  input.style.top = `${inputY}px`;

  document.body.appendChild(input);
  input.focus();

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const name = input.value.trim().substring(0, 10);
      if (name) {
        saveHighScore(name, this.score);
        input.remove();
        this.scene.start('MenuScene');
      }
    }
  });

  this.events.once('shutdown', () => {
    input.remove();
    this.input.keyboard.enabled = true;
    this.input.keyboard.manager.enabled = true;
  });
}


}

import Phaser from './lib/phaser.js';
import { GameScene } from './scenes/game-scene.js';

const game = new Phaser.Game({
  type: Phaser.CANVAS,
  roundPixels: true,
  pixelArt: true,
  scale: {
    parent: 'game-container',
    width: 450,
    height: 640,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
  },
  backgroundColor: '#000000',
  physics: {
    default: 'arcade', // fazer com que o jogo funcione com a física "arcade", por exemplo desliga a gravidade
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: true,
    },
  },
});

game.scene.add('GameScene', GameScene);
game.scene.start('GameScene');

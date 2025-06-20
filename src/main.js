import Phaser from './lib/phaser.js';
import { MenuScene } from './scenes/menu-scene.js';
import { BootScene } from './scenes/boot-scene.js';
import { GameScene } from './scenes/game-scene.js';
import { PreloadScene } from './scenes/preload-scene.js';
import { PauseScene } from './scenes/pause-scene.js';
import { TutorialScene } from './scenes/tutorial-scene.js';
import { Level1Scene } from './scenes/level1-scene.js';
import { VictoryScene } from './scenes/victory-scene.js';

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
      debug: false,
    },
  },
});

game.scene.add('MenuScene', MenuScene);
game.scene.add('BootScene', BootScene);
game.scene.add('PreloadScene', PreloadScene);
game.scene.add('TutorialScene', TutorialScene);
game.scene.add('GameScene', GameScene);
game.scene.add('PauseScene', PauseScene);
game.scene.add('Level1Scene', Level1Scene);
game.scene.add('VictoryScene', VictoryScene);
game.scene.start('BootScene');

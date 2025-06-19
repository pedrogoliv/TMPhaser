import Phaser from '../lib/phaser.js';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

preload() {
  this.load.pack('asset_pack', 'assets/data/assets.json');

  this.load.audio('explosion', 'assets/audio/ansimuz/explosion.wav');
  this.load.audio('hit', 'assets/audio/ansimuz/hit.wav');
  this.load.audio('shot', 'assets/audio/ansimuz/shot_1.wav');
  this.load.audio('shot2', 'assets/audio/ansimuz/shot_2.wav');
  this.load.audio('music', 'assets/audio/ansimuz/space_asteroids.wav');
}


  create() {
    this.#createAnimations();
    this.scene.start('MenuScene');
  }

  #createAnimations() {
    const data = this.cache.json.get('animations_json');
    data.forEach((animation) => {
      const frames = animation.frames
        ? this.anims.generateFrameNumbers(animation.assetKey, { frames: animation.frames })
        : this.anims.generateFrameNumbers(animation.assetKey);
      this.anims.create({
        key: animation.key,
        frames: frames,
        frameRate: animation.frameRate,
        repeat: animation.repeat,
      });
    });
  }
}

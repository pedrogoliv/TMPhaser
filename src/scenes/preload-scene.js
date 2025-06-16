import Phaser from '../lib/phaser.js';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.pack('asset_pack', 'assets/data/assets.json'); // dar load ao asset pack que esta no json antes de criar cena
  }

  create() {
    console.log('PreloadScene carregada'); // log para verificar se a cena foi carregada corretamente
    this.#createAnimations(); // chama o método para criar as animações a partir do JSON carregado
    this.scene.start('GameScene'); // inicia a cena do jogo após o carregamento dos assets
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


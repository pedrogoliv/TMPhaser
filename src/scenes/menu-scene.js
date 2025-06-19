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

    this.load.image('settings_bg', 'assets/images/settings/settings_bg.png');
    this.load.image('settings_header', 'assets/images/settings/settings_header.png');
    this.load.image('music_label', 'assets/images/settings/Music.png');
    this.load.image('sound_label', 'assets/images/settings/Sound.png');
  }

  create() {
    const { width, height } = this.scale;

    // Cabeçalho e botões principais
    this.add.image(width / 2, height / 2 - 100, 'header').setScale(0.25).setOrigin(0.5);

    this.add.image(width / 2, height - 120, 'start_btn')
      .setInteractive()
      .setScale(0.4)
      .on('pointerdown', () => this.scene.start('GameScene'));

    this.add.image(width / 2, height - 60, 'exit_btn')
      .setInteractive()
      .setScale(0.4)
      .on('pointerdown', () => alert('Obrigado por jogar!'));

    const settingsBtn = this.add.image(width - 40, 40, 'settings_btn')
      .setInteractive()
      .setScale(0.18);

    // Overlay escuro
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.5)
      .setOrigin(0)
      .setDepth(1)
      .setVisible(false);

    // Popup de definições
    const settingsPopup = this.add.container(width / 2, height / 2 + 10).setDepth(2);

    const bg = this.add.image(0, 0, 'settings_bg').setScale(0.06);
    const header = this.add.image(0, -100, 'settings_header').setScale(0.30);

    let currentMusicVol = this.registry.get('musicVolume') ?? 0.6;
    let currentFxVol = this.registry.get('fxVolume') ?? 0.6;

    // Label Music
    const musicLabel = this.add.image(0, -45, 'music_label').setScale(0.4).setOrigin(0.5);
    const musicSlider = this.add.rectangle(0, -25, 100, 6, 0x8888ff).setOrigin(0.5).setInteractive();
    const musicThumb = this.add.circle(-50 + (currentMusicVol * 100), -25, 6, 0xffffff).setInteractive();

    const moveMusicThumb = (pointer) => {
      const localX = Phaser.Math.Clamp(pointer.x - (width / 2) - musicSlider.x + 50, 0, 100);
      musicThumb.x = musicSlider.x - 50 + localX;
      const newVolume = +(localX / 100).toFixed(2);
      this.registry.set('musicVolume', newVolume);

      const music = this.sound.get('music');
      if (music instanceof Phaser.Sound.WebAudioSound) {
        music.setVolume(newVolume);
      }
      this.registry.set('musicVolume', newVolume);
    };

    musicThumb.on('pointerdown', () => {
      this.input.on('pointermove', moveMusicThumb);
      this.input.once('pointerup', () => this.input.off('pointermove', moveMusicThumb));
    });

    // Label Sound
    const fxLabel = this.add.image(0, 20, 'sound_label').setScale(0.4).setOrigin(0.5);
    const fxSlider = this.add.rectangle(0, 40, 100, 6, 0xff8888).setOrigin(0.5).setInteractive();
    const fxThumb = this.add.circle(-50 + (currentFxVol * 100), 40, 6, 0xffffff).setInteractive();

    const moveFXThumb = (pointer) => {
      const localX = Phaser.Math.Clamp(pointer.x - (width / 2) - fxSlider.x + 50, 0, 100);
      fxThumb.x = fxSlider.x - 50 + localX;
      const newVolume = +(localX / 100).toFixed(2);
      this.registry.set('fxVolume', newVolume);
    };

    fxThumb.on('pointerdown', () => {
      this.input.on('pointermove', moveFXThumb);
      this.input.once('pointerup', () => this.input.off('pointermove', moveFXThumb));
    });

    settingsPopup.add([
      bg, header,
      musicLabel, musicSlider, musicThumb,
      fxLabel, fxSlider, fxThumb
    ]);

    settingsPopup.setVisible(false);

    settingsBtn.on('pointerdown', () => {
      settingsPopup.setVisible(true);
      overlay.setVisible(true);
    });

    this.input.keyboard.on('keydown-ESC', () => {
      if (settingsPopup.visible) {
        settingsPopup.setVisible(false);
        overlay.setVisible(false);
      }
    });
  }
}

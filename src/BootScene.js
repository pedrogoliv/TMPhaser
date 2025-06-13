export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("player", "assets/player.png");
    this.load.image("alien", "assets/alien.png");
    this.load.image("bullet", "assets/bullet.png");

    this.load.spritesheet("explosao", "assets/explosao.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  create() {
    this.anims.create({
      key: "explodir",
      frames: this.anims.generateFrameNumbers("explosao"),
      frameRate: 15,
      repeat: 0,
      hideOnComplete: true,
    });

    this.scene.start("MenuScene");
  }
}

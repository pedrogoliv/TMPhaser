export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    const { width, height } = this.sys.game.config;

    this.add.text(width / 2, height / 2 - 40, "SPACE SHOOTER", {
      font: "32px Arial",
      fill: "#ffffff",
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 10, "Press SPACE to Start", {
      font: "20px Arial",
      fill: "#ffffff",
    }).setOrigin(0.5);

    this.input.keyboard.on("keydown-SPACE", () => {
      this.scene.start("GameScene");
    });
  }
}

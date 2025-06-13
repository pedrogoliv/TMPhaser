export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    const { width, height } = this.sys.game.config;

    this.background = this.add.tileSprite(0, 0, width, height, "background").setOrigin(0);

    this.player = this.physics.add.sprite(width / 2, height - 50, "player");
    this.player.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.bullets = this.physics.add.group();
    this.enemies = this.physics.add.group();

    this.time.addEvent({
      delay: 1000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);

    this.input.keyboard.on("keydown-SPACE", this.shoot, this);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    this.background.tilePositionY -= 1;
  }

  shoot() {
    const bullet = this.bullets.create(this.player.x, this.player.y - 20, "bullet");
    bullet.setVelocityY(-300);
  }

  spawnEnemy() {
    const x = Phaser.Math.Between(50, 430);
    const enemy = this.enemies.create(x, 0, "alien");
    enemy.setVelocityY(100);
  }

  hitEnemy(bullet, enemy) {
    bullet.destroy();

    enemy.setTexture("explosao");
    enemy.play("explodir");

    this.time.delayedCall(300, () => enemy.destroy());
  }
}

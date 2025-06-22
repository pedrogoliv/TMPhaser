export class ShieldPowerUp extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'shield');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setVelocityY(60);
    this.setDepth(1);
    this.setScale(1); // ajusta se ficar muito grande
    this.play('shield_powerup');
  }
}

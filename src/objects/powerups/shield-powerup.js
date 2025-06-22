export class ShieldPowerUp extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'shield');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setVelocityY(60);
    this.setDepth(1);
    this.setScale(1);
    this.play('shield_powerup');
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.y > this.scene.scale.height + 50) {
      this.destroy();
    }
  }
}

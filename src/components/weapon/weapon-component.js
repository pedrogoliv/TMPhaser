import { CUSTOM_EVENTS } from '../events/event-bus-component.js';

export class WeaponComponent {
  #gameObject;
  #inputComponent;
  #bulletGroup;
  #fireBulletInterval;
  #bulletConfig;
  #eventBusComponent;
  #disabled = false;
  #isPlayerWeapon;
  #originalBulletConfig;
  #isZapperMode = false;

  constructor(gameObject, inputComponent, bulletConfig, eventBusComponent, options = {}) {
    this.#gameObject = gameObject;
    this.#inputComponent = inputComponent;
    this.#bulletConfig = bulletConfig;
    this.#eventBusComponent = eventBusComponent;
    this.#fireBulletInterval = 0;
    this.#isPlayerWeapon = options.isPlayerWeapon ?? false;
    this.#originalBulletConfig = { ...bulletConfig };

    this.#bulletGroup = this.#gameObject.scene.physics.add.group({
      name: `bullets-${Phaser.Math.RND.uuid()}`,
      enable: false,
    });

    this.#bulletGroup.createMultiple({
      key: 'bullet',
      quantity: this.#bulletConfig.maxCount,
      active: false,
      visible: false,
    });

    this.#gameObject.scene.physics.world.on(Phaser.Physics.Arcade.Events.WORLD_STEP, this.worldStep, this);
    this.#gameObject.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.#gameObject.scene.physics.world.off(Phaser.Physics.Arcade.Events.WORLD_STEP, this.worldStep, this);
    });
  }

  get bulletGroup() {
    return this.#bulletGroup;
  }

  disableWeapon() {
    this.#disabled = true;
  }

  enableWeapon() {
    this.#disabled = false;
  }

  update(dt) {
    if (this.#disabled) return;

    this.#fireBulletInterval -= dt;
    if (this.#fireBulletInterval > 0) return;

    if (this.#inputComponent.shootIsDown) {
      if (this.#isZapperMode) {
        this.#fireZapperLaser();
        this.#isZapperMode = false;
        this.#disabled = true; // desativa disparo até laser sumir
      } else {
        this.#fireNormalBullet();
        this.#fireBulletInterval = this.#bulletConfig.interval;
        this.#eventBusComponent.emit(CUSTOM_EVENTS.SHIP_SHOOT);
        if (this.#isPlayerWeapon) {
          this.#eventBusComponent.emit('BULLET_FIRED');
        }
      }
    }
  }

  #fireNormalBullet() {
    const bullet = this.#bulletGroup.getFirstDead();
    if (!bullet) return;

    const x = this.#gameObject.x;
    const y = this.#gameObject.y + this.#bulletConfig.yOffset;

    bullet.enableBody(true, x, y, true, true);
    bullet.body.velocity.y -= this.#bulletConfig.speed;
    bullet.setState(this.#bulletConfig.lifespan);
    bullet.play('bullet');
    bullet.setScale(0.8);
    bullet.body.setSize(14, 18);
    bullet.setFlipY(this.#bulletConfig.flipY);
  }

  #fireZapperLaser() {
    const scene = this.#gameObject.scene;
    const laserTextureHeight = scene.textures.get('zapper').getSourceImage().height;

    scene.sound.play('zapper', { volume: 0.2 });

    const laser = scene.add.sprite(this.#gameObject.x, this.#gameObject.y, 'zapper');
    laser.setOrigin(0.5, 1);
    laser.setScale(1, 0.01);
    laser.setAlpha(1);
    laser.play('zapper_powerup');

    scene.physics.add.existing(laser);
    laser.body.setAllowGravity(false);
    laser.body.setImmovable(true);

    const scaleY = (scene.scale.height + 50) / laserTextureHeight;

    scene.tweens.add({
      targets: laser,
      scaleY: scaleY,
      duration: 500,
      ease: 'Sine.easeOut'
    });

    scene.physics.add.overlap(laser, scene.children.list, (laser, obj) => {
      if (obj.colliderComponent && obj !== this.#gameObject) {
        obj.colliderComponent.collideWithEnemyProjectile?.();
      }
    });

    const followTimer = scene.time.addEvent({
      delay: 16,
      loop: true,
      callback: () => {
        if (!laser.active) return;
        laser.x = this.#gameObject.x;
        laser.y = this.#gameObject.y - 5;
      }
    });

    const totalLaserTime = this.#bulletConfig.lifespan * 1000;
    const fadeOutDuration = 200;
    const visibleDuration = totalLaserTime - fadeOutDuration;

    scene.time.delayedCall(visibleDuration, () => {
      scene.tweens.add({
        targets: laser,
        scaleY: 0.01,
        duration: fadeOutDuration,
        ease: 'Sine.easeIn',
        onComplete: () => {
          laser.destroy();
          followTimer.remove();

          // Volta ao config original AGORA
          this.#bulletConfig = { ...this.#originalBulletConfig };
          this.#isZapperMode = false;

          this.#fireBulletInterval = this.#bulletConfig.interval;
          this.#disabled = false;
        }

      });
    });
  }

  worldStep(delta) {
    this.#bulletGroup.getChildren().forEach((bullet) => {
      if (!bullet.active) return;
      bullet.state -= delta;
      if (bullet.state <= 0) {
        bullet.disableBody(true, true);
      }
    });
  }

  destroyBullet(bullet) {
    bullet.setState(0);
  }

  activateZapperMode(zapperConfig, duration = 5000) {
    this.#isZapperMode = true;
    this.#bulletConfig = { ...zapperConfig };

  }
}

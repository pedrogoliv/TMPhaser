import { ColliderComponent } from '../components/collider/collider-component.js';
import { CUSTOM_EVENTS } from '../components/events/event-bus-component.js';
import { HealthComponent } from '../components/health/health-component.js';
import { KeyboardInputComponent } from '../components/input/keyboard-input-component.js';
import { HorizontalMovementComponent } from '../components/movement/horizontal-movement-component.js';
import { WeaponComponent } from '../components/weapon/weapon-component.js';
import * as CONFIG from '../config.js';

export class Player extends Phaser.GameObjects.Container {
  #keyboardInputComponent;
  #weaponComponent;
  #horizontalMovementComponent;
  #healthComponent;
  #colliderComponent;
  #eventBusComponent;
  #shipSprite;
  #shipEngineSprite;
  #shipEngineThrusterSprite;
  #shieldSprite;
  #invulneravel = false;
  #primeiroSpawn = true;

  constructor(scene, eventBusComponent) {
    super(scene, scene.scale.width / 2, scene.scale.height - 32, []);
    this.#eventBusComponent = eventBusComponent;

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.setSize(24, 24);
    this.body.setOffset(-12, -12);
    this.body.setCollideWorldBounds(true);
    this.setDepth(2);

    this.#shipSprite = scene.add.sprite(0, 0, 'ship');
    this.#shipEngineSprite = scene.add.sprite(0, 0, 'ship_engine');
    this.#shipEngineThrusterSprite = scene.add.sprite(0, 0, 'ship_engine_thruster');
    this.#shipEngineThrusterSprite.play('ship_engine_thruster');
    this.add([this.#shipEngineThrusterSprite, this.#shipEngineSprite, this.#shipSprite]);

    this.#keyboardInputComponent = new KeyboardInputComponent(this.scene);
    this.#horizontalMovementComponent = new HorizontalMovementComponent(
      this,
      this.#keyboardInputComponent,
      CONFIG.PLAYER_MOVEMENT_HORIZONTAL_VELOCITY
    );
    this.#weaponComponent = new WeaponComponent(
      this,
      this.#keyboardInputComponent,
      {
        speed: CONFIG.PLAYER_BULLET_SPEED,
        interval: CONFIG.PLAYER_BULLET_INTERVAL,
        lifespan: CONFIG.PLAYER_BULLET_LIFESPAN,
        maxCount: CONFIG.PLAYER_BULLET_MAX_COUNT,
        yOffset: -20,
        flipY: false,
      },
      this.#eventBusComponent
    );
    this.#healthComponent = new HealthComponent(CONFIG.PLAYER_HEALTH);
    this.#colliderComponent = new ColliderComponent(this.#healthComponent, this.#eventBusComponent, this);


    this.#hide();
    this.#eventBusComponent.on(CUSTOM_EVENTS.PLAYER_SPAWN, this.#spawn, this);

    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.once(
      Phaser.GameObjects.Events.DESTROY,
      () => {
        this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
      },
      this
    );
  }

  get colliderComponent() {
    return this.#colliderComponent;
  }

  get healthComponent() {
    return this.#healthComponent;
  }

  get weaponGameObjectGroup() {
    return this.#weaponComponent.bulletGroup;
  }

  get weaponComponent() {
    return this.#weaponComponent;
  }

  get invulneravel() {
    return this.#invulneravel;
  }

  update(ts, dt) {
    if (!this.active) {
      return;
    }

    if (this.#healthComponent.isDead) {
      this.#hide();
      this.setVisible(true);
      this.#shipSprite.play({ key: 'explosion' });
      this.#eventBusComponent.emit(CUSTOM_EVENTS.PLAYER_DESTROYED);
      return;
    }

    this.#shipSprite.setFrame((CONFIG.PLAYER_HEALTH - this.#healthComponent.life).toString(10));
    this.#keyboardInputComponent.update();
    this.#horizontalMovementComponent.update();
    this.#weaponComponent.update(dt);

    if (this.#shieldSprite && this.#invulneravel) {
      this.#shieldSprite.setPosition(this.x, this.y);
    }
  }

  #hide() {
    this.setActive(false);
    this.setVisible(false);
    this.#shipEngineSprite.setVisible(false);
    this.#shipEngineThrusterSprite.setVisible(false);
    this.#keyboardInputComponent.lockInput = true;

    if (this.#shieldSprite) {
      this.#shieldSprite.destroy();
      this.#shieldSprite = null;
    }
  }

  #spawn() {
    this.setActive(true);
    this.setVisible(true);
    this.#shipEngineSprite.setVisible(true);
    this.#shipEngineThrusterSprite.setVisible(true);
    this.#shipSprite.setTexture('ship', 0);
    this.#healthComponent.reset();
    this.setPosition(this.scene.scale.width / 2, this.scene.scale.height - 32);
    this.#keyboardInputComponent.lockInput = false;

    if (this.#primeiroSpawn) {
      this.#primeiroSpawn = false;
    } else {
      this.#invulneravel = true;
      this.setAlpha(0.5);

      this.#shieldSprite = this.scene.add.sprite(this.x, this.y, 'invincibility');
      this.#shieldSprite.setDepth(5);
      this.#shieldSprite.setScale(1.4);
      this.#shieldSprite.play('invincible_shield');

      this.scene.time.delayedCall(2000, () => {
        this.#invulneravel = false;
        this.setAlpha(1);
        if (this.#shieldSprite) {
          this.#shieldSprite.destroy();
          this.#shieldSprite = null;
        }
      });
    }
  }
}

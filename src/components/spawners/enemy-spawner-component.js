import Phaser from '../../lib/phaser.js';
import { CUSTOM_EVENTS } from '../events/event-bus-component.js';

export class EnemySpawnerComponent {
  #scene;
  #spawnInterval;
  #spawnAt;
  #group;
  #disableSpawning;

  constructor(scene, enemyClass, spawnConfig, eventBusComponent) {
    this.#scene = scene;

    this.#group = this.#scene.add.group({
      name: `${this.constructor.name}-${Phaser.Math.RND.uuid()}`,
      classType: enemyClass,
      runChildUpdate: true,
      createCallback: (enemy) => {
        enemy.init(eventBusComponent);
      },
      maxSize: 20
    });

    this.#spawnInterval = spawnConfig.interval;
    this.#spawnAt = spawnConfig.spawnAt;
    this.#disableSpawning = false;

    this.#scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.#scene.physics.world.on(Phaser.Physics.Arcade.Events.WORLD_STEP, this.worldStep, this);
    this.#scene.events.once(
      Phaser.Scenes.Events.DESTROY,
      () => {
        this.#scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
        this.#scene.physics.world.off(Phaser.Physics.Arcade.Events.WORLD_STEP, this.worldStep, this);
      },
      this
    );

    eventBusComponent.on(CUSTOM_EVENTS.GAME_OVER, () => {
      this.#disableSpawning = true;
    });
  }

  get phaserGroup() {
    return this.#group;
  }

  update(ts, dt) {
    if (this.#disableSpawning) return;

    this.#spawnAt -= dt;
    if (this.#spawnAt > 0) return;

    const x = Phaser.Math.RND.between(30, this.#scene.scale.width - 30);
    const enemy = this.#group.get(x, -20);
    enemy.reset();

    this.#spawnAt = this.#spawnInterval;
  }

  worldStep(delta) {
    this.#group.getChildren().forEach((enemy) => {
      if (!enemy.active) return;

      if (enemy.y > this.#scene.scale.height + 50) {
        enemy.setActive(false);
        enemy.setVisible(false);
      }
    });
  }

  increaseDifficulty() {
    const newInterval = Math.max(1000, this.#spawnInterval - 200);
    if (newInterval !== this.#spawnInterval) {
      this.#spawnInterval = newInterval;
      this.#spawnAt = Math.min(this.#spawnAt, this.#spawnInterval);
    }
  }
}

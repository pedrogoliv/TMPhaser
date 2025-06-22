// @ts-nocheck
import { CUSTOM_EVENTS } from '../../components/events/event-bus-component.js';
import * as CONFIG from '../../config.js';

export class Lives extends Phaser.GameObjects.Container {
  #lives;
  #eventBusComponent;

  constructor(scene, eventBusComponent) {
    super(scene, 5, scene.scale.height - 30, []);
    this.#eventBusComponent = eventBusComponent;
    this.#lives = CONFIG.PLAYER_LIVES;
    this.scene.add.existing(this);

    for (let i = 0; i < this.#lives; i += 1) {
      const ship = scene.add
        .image(i * 20, 0, 'ship')
        .setScale(0.6)
        .setOrigin(0);
      this.add(ship);
    }

    this.scene.add.text(0, 0, '', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '1px',
    }).setAlpha(0); 

    this.#eventBusComponent.on(CUSTOM_EVENTS.PLAYER_DESTROYED, () => {
      this.#lives -= 1;
      this.getAt(this.#lives).destroy();

      if (this.#lives > 0) {
        scene.time.delayedCall(1500, () => {
          this.#eventBusComponent.emit(CUSTOM_EVENTS.PLAYER_SPAWN);
        });
        return;
      }

    const score = this.scene.scoreValue ?? 0;
    this.scene.scene.start('GameOverScene', { score });


      this.#eventBusComponent.emit(CUSTOM_EVENTS.GAME_OVER);
    });

    this.#eventBusComponent.emit(CUSTOM_EVENTS.PLAYER_SPAWN);
  }
}

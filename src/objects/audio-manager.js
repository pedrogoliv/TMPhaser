import { CUSTOM_EVENTS } from '../components/events/event-bus-component.js';

export class AudioManager {
  #scene;
  #eventBusComponent;
  #backgroundMusic;

  constructor(scene, eventBusComponent) {
    this.#scene = scene;
    this.#eventBusComponent = eventBusComponent;

    // Guardar referência à música
    this.#backgroundMusic = this.#scene.sound.add('music', {
      volume: 0.6,
      loop: true,
    });
    this.#backgroundMusic.play();

    // Ouvir eventos
    this.#eventBusComponent.on(CUSTOM_EVENTS.ENEMY_DESTROYED, () => {
      this.#scene.sound.play('explosion', { volume: 0.6 });
    });

    this.#eventBusComponent.on(CUSTOM_EVENTS.PLAYER_DESTROYED, () => {
      this.#scene.sound.play('explosion', { volume: 0.6 });
    });

    this.#eventBusComponent.on(CUSTOM_EVENTS.SHIP_HIT, () => {
      this.#scene.sound.play('hit', { volume: 0.6 });
    });

    this.#eventBusComponent.on(CUSTOM_EVENTS.SHIP_SHOOT, () => {
      this.#scene.sound.play('shot', { volume: 0.05 });
    });

    const allEvents = [
      CUSTOM_EVENTS.ENEMY_INIT,
      CUSTOM_EVENTS.ENEMY_DESTROYED,
      CUSTOM_EVENTS.PLAYER_SPAWN,
      CUSTOM_EVENTS.PLAYER_DESTROYED,
      CUSTOM_EVENTS.GAME_OVER,
      CUSTOM_EVENTS.SHIP_HIT,
      CUSTOM_EVENTS.SHIP_SHOOT,
    ];

    allEvents.forEach((eventName) => {
      this.#eventBusComponent.on(eventName, () => {
        console.log('🎧 AudioManager recebeu evento:', eventName);
      });
    });

    // OUVE quando a cena for encerrada
    this.#scene.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.#backgroundMusic.stop();
    });

    // Extra: limpa o som se a cena for completamente destruída
    this.#scene.events.on(Phaser.Scenes.Events.DESTROY, () => {
      this.#backgroundMusic.destroy();
    });
  }
}

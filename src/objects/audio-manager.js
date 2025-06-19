import { CUSTOM_EVENTS } from '../components/events/event-bus-component.js';

export class AudioManager {
  #scene;
  #eventBusComponent;
  #backgroundMusic;

  constructor(scene, eventBusComponent) {
    this.#scene = scene;
    this.#eventBusComponent = eventBusComponent;

    // Volume inicial da música
    const musicVol = this.#scene.registry.get('musicVolume') ?? 0.6;

    // Música de fundo
    this.#backgroundMusic = this.#scene.sound.add('music', {
      volume: musicVol,
      loop: true,
    });
    this.#backgroundMusic.play();

    // Efeitos sonoros com volume separado
    const getFXVolume = () => this.#scene.registry.get('fxVolume') ?? 0.6;

    this.#eventBusComponent.on(CUSTOM_EVENTS.ENEMY_DESTROYED, () => {
      this.#scene.sound.play('explosion', { volume: getFXVolume() });
    });

    this.#eventBusComponent.on(CUSTOM_EVENTS.PLAYER_DESTROYED, () => {
      this.#scene.sound.play('explosion', { volume: getFXVolume() });
    });

    this.#eventBusComponent.on(CUSTOM_EVENTS.SHIP_HIT, () => {
      this.#scene.sound.play('hit', { volume: getFXVolume() });
    });

    this.#eventBusComponent.on(CUSTOM_EVENTS.SHIP_SHOOT, () => {
      this.#scene.sound.play('shot', { volume: getFXVolume() * 0.1 });
    });

    // Debug opcional
    const allEvents = [
      CUSTOM_EVENTS.ENEMY_INIT,
      CUSTOM_EVENTS.ENEMY_DESTROYED,
      CUSTOM_EVENTS.PLAYER_SPAWN,
      CUSTOM_EVENTS.PLAYER_DESTROYED,
      CUSTOM_EVENTS.GAME_OVER,
      CUSTOM_EVENTS.SHIP_HIT,
      CUSTOM_EVENTS.SHIP_SHOOT,
    ];

    // Limpar som ao sair da cena
    this.#scene.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.#backgroundMusic.stop();
    });

    this.#scene.events.on(Phaser.Scenes.Events.DESTROY, () => {
      this.#backgroundMusic.destroy();
    });
  }
}

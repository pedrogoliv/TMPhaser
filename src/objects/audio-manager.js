import { CUSTOM_EVENTS } from '../components/events/event-bus-component.js';

export class AudioManager {
  #scene;
  #eventBusComponent;

  constructor(scene, eventBusComponent) {
    this.#scene = scene;
    this.#eventBusComponent = eventBusComponent;

    // Reproduzir música de fundo (nome correto: 'music')
    this.#scene.sound.play('music', {
      volume: 0.6,
      loop: true,
    });

    // Som ao destruir inimigo
    this.#eventBusComponent.on(CUSTOM_EVENTS.ENEMY_DESTROYED, () => {
      this.#playSound('explosion', 0.6);
    });

    // Som ao destruir jogador
    this.#eventBusComponent.on(CUSTOM_EVENTS.PLAYER_DESTROYED, () => {
      this.#playSound('explosion', 0.6);
    });

    // Som ao ser atingido
    this.#eventBusComponent.on(CUSTOM_EVENTS.SHIP_HIT, () => {
      this.#playSound('hit', 0.6);
    });

    // Som ao disparar
    this.#eventBusComponent.on(CUSTOM_EVENTS.SHIP_SHOOT, () => {
      this.#playSound('shot', 0.05);
    });
  }

  #playSound(key, volume = 1) {
    const sound = this.#scene.sound.get(key);
    if (sound) {
      sound.play({ volume });
    } else {
      console.warn(`⚠️ Som "${key}" não encontrado.`);
    }
  }
}

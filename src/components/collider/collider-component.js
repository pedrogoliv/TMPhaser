import { CUSTOM_EVENTS } from '../events/event-bus-component.js';

export class ColliderComponent {
  #healthComponent;
  #eventBusComponent;

constructor(healthComponent, eventBusComponent, owner = null) {
  this.#healthComponent = healthComponent;
  this.#eventBusComponent = eventBusComponent;
  this.owner = owner; // pode ser o player, por exemplo
}


collideWithEnemyShip() {
  if (this.#healthComponent.isDead || (this.owner?.invulneravel)) {
    return;
  }
  this.#healthComponent.die();
}

collideWithEnemyProjectile() {
  if (this.#healthComponent.isDead || (this.owner?.invulneravel)) {
    return;
  }
  this.#healthComponent.hit();
  this.#eventBusComponent.emit(CUSTOM_EVENTS.SHIP_HIT);
}

}

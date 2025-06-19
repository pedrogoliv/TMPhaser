import { InputComponent } from './input-component.js';

export class KeyboardInputComponent extends InputComponent {
  #cursorKeys;
  #inputLocked;
  #aKey;
  #dKey;
  #pointer; // rato

  constructor(scene) {
    super();
    this.#cursorKeys = scene.input.keyboard.createCursorKeys();
    this.#aKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.#dKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.#pointer = scene.input.activePointer;
    this.#inputLocked = false;
  }

  set lockInput(val) {
    this.#inputLocked = val;
  }

  update() {
    if (this.#inputLocked) {
      this.reset();
      return;
    }

    // Movimento: setas OU A/D
    this._up = this.#cursorKeys.up.isDown;
    this._down = this.#cursorKeys.down.isDown;
    this._left = this.#cursorKeys.left.isDown || this.#aKey.isDown;
    this._right = this.#cursorKeys.right.isDown || this.#dKey.isDown;

    // Disparo: Espaço OU Clique esquerdo
    this._shoot = this.#cursorKeys.space.isDown || this.#pointer.isDown;
  }
}

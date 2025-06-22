export class TimerUI extends Phaser.GameObjects.Text {
  #tempo;
  #timerEvent;
  #countUp;

  constructor(scene, tempoTotalMs = null, countUp = false) {
    super(scene, scene.scale.width / 2, 35, '', {
      fontSize: '25px',
      fontStyle: 'bold',
      color: '#ffffff',
    });

    this.scene.add.existing(this);
    this.setOrigin(0.5);

    this.#countUp = countUp;

    if (countUp) {
      this.#tempo = 0;
      this.setText('0');

      this.#timerEvent = scene.time.addEvent({
        delay: 1000,
        loop: true,
        callback: () => {
          this.#tempo += 1;
          this.setText(this.#tempo.toString());
        }
      });
    } else {
      this.#tempo = Math.ceil(tempoTotalMs / 1000);
      this.setText(this.#tempo.toString());

      this.#timerEvent = scene.time.addEvent({
        delay: 1000,
        repeat: this.#tempo - 1,
        callback: () => {
          this.#tempo -= 1;
          this.setText(this.#tempo.toString());
        }
      });
    }
  }

  destroy() {
    this.#timerEvent?.remove();
    super.destroy();
  }
}

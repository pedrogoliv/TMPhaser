export class TimerUI extends Phaser.GameObjects.Text {
  #tempoRestante;
  #timerEvent;

  constructor(scene, tempoTotalMs) {
    super(scene, scene.scale.width / 2, 35, '', {
      fontSize: '25px',
      fontStyle: 'bold',
      color: '#ffffff',
    });

    this.scene.add.existing(this);
    this.setOrigin(0.5);

    this.#tempoRestante = Math.ceil(tempoTotalMs / 1000);
    this.setText(this.#tempoRestante.toString());

    // Atualiza o texto a cada segundo
    this.#timerEvent = scene.time.addEvent({
      delay: 1000,
      repeat: this.#tempoRestante - 1,
      callback: () => {
        this.#tempoRestante -= 1;
        this.setText(this.#tempoRestante.toString());
      }
    });
  }

  destroy() {
    this.#timerEvent?.remove();
    super.destroy();
  }
}

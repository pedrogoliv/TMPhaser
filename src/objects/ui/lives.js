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

    // Criar ícones das vidas
    for (let i = 0; i < this.#lives; i += 1) {
      const ship = scene.add
        .image(i * 20, 0, 'ship')
        .setScale(0.6)
        .setOrigin(0);
      this.add(ship);
    }

    //  Forçar carregamento da fonte "Press Start 2P"
    this.scene.add.text(0, 0, '', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '1px',
    }).setAlpha(0); // invisível

    this.#eventBusComponent.on(CUSTOM_EVENTS.PLAYER_DESTROYED, () => {
      this.#lives -= 1;
      this.getAt(this.#lives).destroy();

      if (this.#lives > 0) {
        scene.time.delayedCall(1500, () => {
          this.#eventBusComponent.emit(CUSTOM_EVENTS.PLAYER_SPAWN);
        });
        return;
      }

      // GAME OVER UI
      const centerX = this.scene.scale.width / 2;
      const centerY = this.scene.scale.height / 2;

      const overlay = this.scene.add.rectangle(0, 0, this.scene.scale.width, this.scene.scale.height, 0x000000, 0.6);
      overlay.setOrigin(0);

      const gameOverText = this.scene.add
        .text(centerX, centerY - 60, 'GAME OVER', {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '40px',
          color: '#ff2f66',
        })
        .setOrigin(0.5)
        .setAlpha(0)
        .setScale(0.4);

      this.scene.tweens.add({
        targets: gameOverText,
        alpha: 1,
        scale: 1,
        duration: 500,
        ease: 'Back.Out',
      });

      const buttonStyle = {
          fontFamily: '"Press Start 2P", monospace',
        fontSize: '14px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { left: 12, right: 12, top: 6, bottom: 6 },
        fixedWidth: 320,
        align: 'center',
      };

      // Botão "JOGAR NOVAMENTE"
      const retryBtn = this.scene.add.text(centerX, centerY + 20, 'JOGAR NOVAMENTE', buttonStyle)
        .setOrigin(0.5)
        .setInteractive();

      retryBtn.on('pointerdown', () => this.scene.scene.restart());
      retryBtn.on('pointerover', () => retryBtn.setStyle({ backgroundColor: '#ff2f66', color: '#000000' }));
      retryBtn.on('pointerout', () => retryBtn.setStyle({ backgroundColor: '#000000', color: '#ffffff' }));

      // Botão "VOLTAR PARA O MENU"
      const menuBtn = this.scene.add.text(centerX, centerY + 70, 'VOLTAR PARA O MENU', buttonStyle)
        .setOrigin(0.5)
        .setInteractive();

      menuBtn.on('pointerdown', () => this.scene.scene.start('MenuScene'));
      menuBtn.on('pointerover', () => menuBtn.setStyle({ backgroundColor: '#ff2f66', color: '#000000' }));
      menuBtn.on('pointerout', () => menuBtn.setStyle({ backgroundColor: '#000000', color: '#ffffff' }));

      this.#eventBusComponent.emit(CUSTOM_EVENTS.GAME_OVER);
    });

    this.#eventBusComponent.emit(CUSTOM_EVENTS.PLAYER_SPAWN);
  }
}

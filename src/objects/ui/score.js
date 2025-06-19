import { CUSTOM_EVENTS } from '../../components/events/event-bus-component.js';
import * as CONFIG from '../../config.js';

const ENEMY_SCORES = {
  scout: CONFIG.ENEMY_SCOUT_SCORE,
  fighter: CONFIG.ENEMY_FIGHTER_SCORE
};


export class Score extends Phaser.GameObjects.Text {
    #eventBusComponent;
    #score;

    constructor(scene, eventBusComponent) {
        super(scene, scene.scale.width / 2, 35, '0', {
            fontSize: '25px',
            fontStyle: 'bold',
            color: '#ffffff',
        });

        this.scene.add.existing(this);
        this.#eventBusComponent = eventBusComponent;
        this.#score = 0;
        this.setOrigin(0.5);

        this.#eventBusComponent.on(CUSTOM_EVENTS.ENEMY_DESTROYED, (enemy) => {


            const key = enemy.shipAssetKey;
            const scoreValue = ENEMY_SCORES[key] ?? 0;


            this.#score += scoreValue;
            this.setText(this.#score.toString());
        });

    }
}

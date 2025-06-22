// @ts-nocheck
import Phaser from '../lib/phaser.js';
import { Player } from '../objects/player.js';
import { EnemySpawnerComponent } from '../components/spawners/enemy-spawner-component.js';
import { ScoutEnemy } from '../objects/enemies/scout-enemy.js';
import { FighterEnemy } from '../objects/enemies/fighter-enemy.js';
import { Score } from '../objects/ui/score.js';
import { Lives } from '../objects/ui/lives.js';
import { AudioManager } from '../objects/audio-manager.js';
import { EnemyDestroyedComponent } from '../components/spawners/enemy-destroyed-component.js';
import { CUSTOM_EVENTS, EventBusComponent } from '../components/events/event-bus-component.js';
import { TimerUI } from '../objects/ui/timer.js';
import * as CONFIG from '../config.js';

export class BaseLevelScene extends Phaser.Scene {
  constructor(key) {
    super({ key });
  }

  init(data) {
    this.levelConfig = data;
    this.modo = data.modo ?? 'inimigos'; // <--- ADICIONAR ISTO!
    this.scoreValue = 0;
    this.totalEnemiesToSpawn = data.enemyLimit ?? 20;
    this.spawnedEnemies = 0;
    this.destroyedEnemies = 0;
    this.finalCheckTimer = null;
  }


  create() {
    this.add.sprite(0, 0, 'bg1').setOrigin(0, 1).setAlpha(0.7).setAngle(90).setScale(1, 1.25).play('bg1');
    this.add.sprite(0, 0, 'bg2').setOrigin(0, 1).setAlpha(0.7).setAngle(90).setScale(1, 1.25).play('bg2');
    this.add.sprite(0, 0, 'bg3').setOrigin(0, 1).setAlpha(0.7).setAngle(90).setScale(1, 1.25).play('bg3');

    this.eventBus = new EventBusComponent();
    this.audioManager = new AudioManager(this, this.eventBus);
    this.player = new Player(this, this.eventBus);

    this.scoutSpawner = new EnemySpawnerComponent(this, ScoutEnemy, {
      interval: this.levelConfig.scoutInterval ?? 3000,
      spawnAt: 1000,
    }, this.eventBus);

    this.fighterSpawner = new EnemySpawnerComponent(this, FighterEnemy, {
      interval: this.levelConfig.fighterInterval ?? 6000,
      spawnAt: 5000,
    }, this.eventBus);

    new EnemyDestroyedComponent(this, this.eventBus);

    this.physics.add.overlap(this.player, this.scoutSpawner.phaserGroup, (player, enemy) => {
      if (!player.active || !enemy.active) return;
      player.colliderComponent.collideWithEnemyShip();
      enemy.colliderComponent.collideWithEnemyShip();
    });

    this.physics.add.overlap(this.player, this.fighterSpawner.phaserGroup, (player, enemy) => {
      if (!player.active || !enemy.active) return;
      player.colliderComponent.collideWithEnemyShip();
      enemy.colliderComponent.collideWithEnemyShip();
    });

    this.eventBus.on(CUSTOM_EVENTS.ENEMY_INIT, (enemyObj) => {
      if (this.spawnedEnemies >= this.totalEnemiesToSpawn) return;

      this.spawnedEnemies++;
      if (this.spawnedEnemies >= this.totalEnemiesToSpawn) {
        this.scoutSpawner.stop();
        this.fighterSpawner.stop();

        this.finalCheckTimer = this.time.delayedCall(5000, () => {
          if (this.noEnemiesRemaining()) {
            this.onLevelComplete();
          }
        });
      }

      if (enemyObj.constructor.name === 'FighterEnemy') {
        this.physics.add.overlap(this.player, enemyObj.weaponGameObjectGroup, (player, proj) => {
          if (!player.active || !proj.active) return;
          enemyObj.weaponComponent.destroyBullet(proj);
          player.colliderComponent.collideWithEnemyProjectile();
        });
      }
    });

    this.physics.add.overlap(this.scoutSpawner.phaserGroup, this.player.weaponGameObjectGroup, (enemy, proj) => {
      if (!enemy.active || !proj.active) return;
      this.player.weaponComponent.destroyBullet(proj);
      enemy.colliderComponent.collideWithEnemyProjectile();
    });

    this.physics.add.overlap(this.fighterSpawner.phaserGroup, this.player.weaponGameObjectGroup, (enemy, proj) => {
      if (!enemy.active || !proj.active) return;
      this.player.weaponComponent.destroyBullet(proj);
      enemy.colliderComponent.collideWithEnemyProjectile();
    });

    if (this.modo === 'tempo') {
      new TimerUI(this, this.levelConfig.tempoLimite);
    } else {
      new Score(this, this.eventBus);
    }

    new Lives(this, this.eventBus);

    this.eventBus.on(CUSTOM_EVENTS.ENEMY_DESTROYED, (enemy) => {
      const key = enemy.shipAssetKey;
      const scoreMap = {
        scout: CONFIG.ENEMY_SCOUT_SCORE,
        fighter: CONFIG.ENEMY_FIGHTER_SCORE
      };
      this.scoreValue += scoreMap[key] ?? 0;
      this.destroyedEnemies++;
    });

    this.input.keyboard.on('keydown-ESC', () => this.togglePause());
    this.input.keyboard.on('keydown-P', () => this.togglePause());
  }

  noEnemiesRemaining() {
    return this.scoutSpawner.phaserGroup?.countActive(true) === 0 &&
           this.fighterSpawner.phaserGroup?.countActive(true) === 0;
  }

  togglePause() {
    if (!this.scene.isPaused()) {
      this.audioManager?.pause?.();
      this.scene.launch('PauseScene');
      this.scene.pause();
    }
  }

  getStarRating(score) {
    if (this.modo === 'tempo') {
      const vidas = this.player?.vidasRestantes ?? 0;
      console.log('[⭐️ Estrelas por vidas restantes]', vidas);
      if (vidas === 3) return ['Star_03', 'Star_03', 'Star_03'];
      if (vidas === 2) return ['Star_03', 'Star_03', 'Star_02'];
      if (vidas === 1) return ['Star_03', 'Star_02', 'Star_01'];
      return ['Star_01', 'Star_01', 'Star_01'];
    }

    const thresholds = this.levelConfig.starThresholds ?? [1800, 1200, 800];
    if (score >= thresholds[0]) return ['Star_03', 'Star_03', 'Star_03'];
    if (score >= thresholds[1]) return ['Star_03', 'Star_03', 'Star_02'];
    if (score >= thresholds[2]) return ['Star_03', 'Star_02', 'Star_01'];
    return ['Star_01', 'Star_01', 'Star_01'];
  }


  onLevelComplete() {
    this.scoutSpawner?.destroy();
    this.fighterSpawner?.destroy();
    this.scene.launch('VictoryScene', {
      score: this.scoreValue,
      nextLevel: this.levelConfig.nextLevel,
      previousScene: this.scene.key,
      baseScene: this.scene.key,
      stars: this.getStarRating(this.scoreValue),
    });
    this.scene.pause();
    this.audioManager?.stop?.();
  }
}

// @ts-nocheck

import { EnemySpawnerComponent } from '../components/spawners/enemy-spawner-component.js';
import Phaser from '../lib/phaser.js';
import { FighterEnemy } from '../objects/enemies/fighter-enemy.js';
import { ScoutEnemy } from '../objects/enemies/scout-enemy.js';
import { Player } from '../objects/player.js';
import * as CONFIG from '../config.js';
import { CUSTOM_EVENTS, EventBusComponent } from '../components/events/event-bus-component.js';
import { EnemyDestroyedComponent } from '../components/spawners/enemy-destroyed-component.js';
import { Score } from '../objects/ui/score.js';
import { Lives } from '../objects/ui/lives.js';
import { AudioManager } from '../objects/audio-manager.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.pack('asset_pack', 'assets/data/assets.json');
  }

  create() {
    this.add.sprite(0, 0, 'bg1', 0).setOrigin(0, 1).setAlpha(0.7).setAngle(90).setScale(1, 1.25).play('bg1');
    this.add.sprite(0, 0, 'bg2', 0).setOrigin(0, 1).setAlpha(0.7).setAngle(90).setScale(1, 1.25).play('bg2');
    this.add.sprite(0, 0, 'bg3', 0).setOrigin(0, 1).setAlpha(0.7).setAngle(90).setScale(1, 1.25).play('bg3');

    const eventBusComponent = new EventBusComponent();

    const audioManager = new AudioManager(this, eventBusComponent);
    this.music = this.sound.get('music');

    const player = new Player(this, eventBusComponent);

    const scoutSpawner = new EnemySpawnerComponent(
      this,
      ScoutEnemy,
      {
        interval: CONFIG.ENEMY_SCOUT_GROUP_SPAWN_INTERVAL,
        spawnAt: CONFIG.ENEMY_SCOUT_GROUP_SPAWN_START,
      },
      eventBusComponent
    );

    const fighterSpawner = new EnemySpawnerComponent(
      this,
      FighterEnemy,
      {
        interval: CONFIG.ENEMY_FIGHTER_GROUP_SPAWN_INTERVAL,
        spawnAt: CONFIG.ENEMY_FIGHTER_GROUP_SPAWN_START,
      },
      eventBusComponent
    );

    new EnemyDestroyedComponent(this, eventBusComponent);

    this.physics.add.overlap(player, scoutSpawner.phaserGroup, (playerGameObject, enemyGameObject) => {
      if (!playerGameObject.active || !enemyGameObject.active) return;
      playerGameObject.colliderComponent.collideWithEnemyShip();
      enemyGameObject.colliderComponent.collideWithEnemyShip();
    });

    this.physics.add.overlap(player, fighterSpawner.phaserGroup, (playerGameObject, enemyGameObject) => {
      if (!playerGameObject.active || !enemyGameObject.active) return;
      playerGameObject.colliderComponent.collideWithEnemyShip();
      enemyGameObject.colliderComponent.collideWithEnemyShip();
    });

    eventBusComponent.on(CUSTOM_EVENTS.ENEMY_INIT, (gameObject) => {
      if (gameObject.constructor.name !== 'FighterEnemy') return;

      this.physics.add.overlap(player, gameObject.weaponGameObjectGroup, (playerGameObject, projectileGameObject) => {
        if (!playerGameObject.active || !projectileGameObject.active) return;
        gameObject.weaponComponent.destroyBullet(projectileGameObject);
        playerGameObject.colliderComponent.collideWithEnemyProjectile();
      });
    });

    this.physics.add.overlap(scoutSpawner.phaserGroup, player.weaponGameObjectGroup, (enemyGameObject, projectileGameObject) => {
      if (!enemyGameObject.active || !projectileGameObject.active) return;
      player.weaponComponent.destroyBullet(projectileGameObject);
      enemyGameObject.colliderComponent.collideWithEnemyProjectile();
    });

    this.physics.add.overlap(fighterSpawner.phaserGroup, player.weaponGameObjectGroup, (enemyGameObject, projectileGameObject) => {
      if (!enemyGameObject.active || !projectileGameObject.active) return;
      player.weaponComponent.destroyBullet(projectileGameObject);
      enemyGameObject.colliderComponent.collideWithEnemyProjectile();
    });

    new Score(this, eventBusComponent);
    new Lives(this, eventBusComponent);

    this.currentDifficulty = 0;
    this.scoreValue = 0;

    eventBusComponent.on(CUSTOM_EVENTS.ENEMY_DESTROYED, (enemy) => {
      const key = enemy.shipAssetKey;
      const scoreMap = {
        scout: CONFIG.ENEMY_SCOUT_SCORE,
        fighter: CONFIG.ENEMY_FIGHTER_SCORE
      };

      this.scoreValue += scoreMap[key] ?? 0;

      const nextThreshold = (this.currentDifficulty + 1) * 1000;

      if (this.scoreValue >= nextThreshold) {
        scoutSpawner.increaseDifficulty();
        fighterSpawner.increaseDifficulty();
        this.currentDifficulty++;
      }
    });

    // Pausa
    this.isPaused = false;
    this.input.keyboard.on('keydown-ESC', () => this.togglePauseMenu());
    this.input.keyboard.on('keydown-P', () => this.togglePauseMenu());
  }

  togglePauseMenu() {
    if (!this.scene.isPaused()) {
      this.music?.pause();
      this.scene.launch('PauseScene');
      this.scene.pause();
    }
  }

  pauseGame() {
    this.scene.launch('PauseScene');
    this.scene.pause();
    this.music?.pause();
  }
}

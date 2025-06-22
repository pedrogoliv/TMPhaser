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
import { ShieldPowerUp } from '../objects/powerups/shield-powerup.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.pack('asset_pack', 'assets/data/assets.json');
  }

  create() {
    this.add.sprite(0, 0, 'bg1').setOrigin(0, 1).setAlpha(0.7).setAngle(90).setScale(1, 1.25).play('bg1');
    this.add.sprite(0, 0, 'bg2').setOrigin(0, 1).setAlpha(0.7).setAngle(90).setScale(1, 1.25).play('bg2');
    this.add.sprite(0, 0, 'bg3').setOrigin(0, 1).setAlpha(0.7).setAngle(90).setScale(1, 1.25).play('bg3');

    const eventBusComponent = new EventBusComponent();
    const audioManager = new AudioManager(this, eventBusComponent);
    this.music = this.sound.get('music');
    this.player = new Player(this, eventBusComponent);

    

    const scoutSpawner = new EnemySpawnerComponent(this, ScoutEnemy, {
      interval: CONFIG.ENEMY_SCOUT_GROUP_SPAWN_INTERVAL,
      spawnAt: CONFIG.ENEMY_SCOUT_GROUP_SPAWN_START,
    }, eventBusComponent);

    const fighterSpawner = new EnemySpawnerComponent(this, FighterEnemy, {
      interval: CONFIG.ENEMY_FIGHTER_GROUP_SPAWN_INTERVAL,
      spawnAt: CONFIG.ENEMY_FIGHTER_GROUP_SPAWN_START,
    }, eventBusComponent);

    new EnemyDestroyedComponent(this, eventBusComponent);

    this.physics.add.overlap(this.player, scoutSpawner.phaserGroup, (player, enemy) => {
      if (!player.active || !enemy.active) return;
      player.colliderComponent.collideWithEnemyShip();
      enemy.colliderComponent.collideWithEnemyShip();
    });

    this.physics.add.overlap(this.player, fighterSpawner.phaserGroup, (player, enemy) => {
      if (!player.active || !enemy.active) return;
      player.colliderComponent.collideWithEnemyShip();
      enemy.colliderComponent.collideWithEnemyShip();
    });

    eventBusComponent.on(CUSTOM_EVENTS.ENEMY_INIT, (enemy) => {
      if (enemy.constructor.name !== 'FighterEnemy') return;

      this.physics.add.overlap(this.player, enemy.weaponGameObjectGroup, (player, projectile) => {
        if (!player.active || !projectile.active) return;
        enemy.weaponComponent.destroyBullet(projectile);
        player.colliderComponent.collideWithEnemyProjectile();
      });
    });

    this.physics.add.overlap(scoutSpawner.phaserGroup, this.player.weaponGameObjectGroup, (enemy, bullet) => {
      if (!enemy.active || !bullet.active) return;
      this.player.weaponComponent.destroyBullet(bullet);
      enemy.colliderComponent.collideWithEnemyProjectile();
    });

    this.physics.add.overlap(fighterSpawner.phaserGroup, this.player.weaponGameObjectGroup, (enemy, bullet) => {
      if (!enemy.active || !bullet.active) return;
      this.player.weaponComponent.destroyBullet(bullet);
      enemy.colliderComponent.collideWithEnemyProjectile();
    });

    new Score(this, eventBusComponent);
    new Lives(this, eventBusComponent);

    // Timer
    this.timer = 0;
    this.timerText = this.add.text(this.scale.width - 10, this.scale.height - 10, '0s', {
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(1, 1);

    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.timer++;
        this.timerText.setText(`${this.timer}s`);
      }
    });

    this.shieldDropEvent = this.time.addEvent({
      delay: 30000,
      loop: true,
      callback: () => {
        if (Math.random() < 0.5) return;
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const shield = new ShieldPowerUp(this, x, -20).setScale(1);
        this.physics.add.overlap(shield, this.player, () => {
          shield.destroy();
          this.player.activateShield(true);
        });
      }
    });

    eventBusComponent.on(CUSTOM_EVENTS.PLAYER_DESTROYED, () => {
      if (this.shieldDropEvent) {
        this.shieldDropEvent.remove(false);
        this.shieldDropEvent = null;
      }
    });


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

      const dropChance = 0.05;
      if (Math.random() < dropChance) {
        const shield = new ShieldPowerUp(this, enemy.x, enemy.y).setScale(1);
        this.physics.add.overlap(this.player, shield, () => {
          shield.destroy();
          this.player.activateShield(true);
        });
      }
    });

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

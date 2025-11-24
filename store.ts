import { create } from 'zustand';
import { GameState, PlayerState, Enemy, FloatingText, GAME_CONFIG, EnemyType } from './types';
import { v4 as uuidv4 } from 'uuid';

const genId = () => Math.random().toString(36).substr(2, 9);

interface GameStore {
  gameState: GameState;
  score: number;
  
  player: PlayerState;
  enemies: Enemy[];
  texts: FloatingText[];
  
  inputVector: { x: number; z: number };
  lastSpawnTime: number;
  spawnRate: number;

  setGameState: (state: GameState) => void;
  setInputVector: (x: number, z: number) => void;
  playerAttack: () => void;
  resetGame: () => void;
  gameTick: (delta: number, totalTime: number) => void;
}

const INITIAL_PLAYER: PlayerState = {
  position: { x: 0, z: 0 },
  health: 100,
  maxHealth: 100,
  xp: 0,
  maxXp: 100,
  level: 1,
  damage: 20,
  rotation: 0,
  isAttacking: false,
  attackCooldown: 0,
};

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: GameState.MENU,
  score: 0,
  
  player: { ...INITIAL_PLAYER },
  enemies: [],
  texts: [],
  
  inputVector: { x: 0, z: 0 },
  lastSpawnTime: 0,
  spawnRate: 1.5,

  setGameState: (state) => set({ gameState: state }),
  setInputVector: (x, z) => set({ inputVector: { x, z } }),

  resetGame: () => {
    set({
      gameState: GameState.PLAYING,
      score: 0,
      player: { ...INITIAL_PLAYER },
      enemies: [],
      texts: [],
      inputVector: { x: 0, z: 0 },
      lastSpawnTime: 0,
      spawnRate: 1.5,
    });
  },

  playerAttack: () => {
    const { gameState, player, enemies, texts } = get();
    if (gameState !== GameState.PLAYING || player.attackCooldown > 0) return;

    const newPlayer = { ...player, isAttacking: true, attackCooldown: GAME_CONFIG.ATTACK_COOLDOWN };
    const newTexts = [...texts];
    const newEnemies = enemies.map(e => {
      const dx = e.position.x - player.position.x;
      const dz = e.position.z - player.position.z;
      const dist = Math.sqrt(dx*dx + dz*dz);

      if (dist < GAME_CONFIG.ATTACK_RANGE) {
        const angleToEnemy = Math.atan2(dx, dz);
        let angleDiff = angleToEnemy - player.rotation;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        if (Math.abs(angleDiff) < GAME_CONFIG.ATTACK_ANGLE / 2) {
          const isCrit = Math.random() > 0.7;
          const dmg = isCrit ? Math.floor(player.damage * 1.8) : player.damage;
          
          e.health -= dmg;
          e.isHit = 0.15;
          
          newTexts.push({
            id: genId(),
            position: { x: e.position.x, z: e.position.z },
            text: dmg.toString(),
            color: isCrit ? '#ff00c1' : '#00f3ff', // Neon Pink / Cyan
            life: 0.8,
            velocityY: 3,
          });

          return e;
        }
      }
      return e;
    });

    set({ player: newPlayer, enemies: newEnemies, texts: newTexts });
    
    setTimeout(() => {
        set(state => ({ player: { ...state.player, isAttacking: false } }));
    }, 150);
  },

  gameTick: (delta, totalTime) => {
    const state = get();
    if (state.gameState !== GameState.PLAYING) return;

    const { player, inputVector, enemies, texts, lastSpawnTime, spawnRate, score } = state;

    // --- Player Movement ---
    let newPlayerPos = { ...player.position };
    let newRotation = player.rotation;
    
    if (inputVector.x !== 0 || inputVector.z !== 0) {
      const length = Math.sqrt(inputVector.x ** 2 + inputVector.z ** 2);
      const nx = inputVector.x / length;
      const nz = inputVector.z / length;
      
      newPlayerPos.x += nx * GAME_CONFIG.PLAYER_SPEED * delta;
      newPlayerPos.z += nz * GAME_CONFIG.PLAYER_SPEED * delta;

      const limit = GAME_CONFIG.ARENA_SIZE / 2 - 0.5;
      newPlayerPos.x = Math.max(-limit, Math.min(limit, newPlayerPos.x));
      newPlayerPos.z = Math.max(-limit, Math.min(limit, newPlayerPos.z));

      newRotation = Math.atan2(inputVector.x, inputVector.z);
    }

    let newAttackCooldown = Math.max(0, player.attackCooldown - delta);

    // --- Enemy Spawning ---
    let newEnemies = [...enemies];
    let newSpawnTime = lastSpawnTime;
    
    // Ramp up difficulty
    const adjustedSpawnRate = Math.max(0.5, spawnRate - (player.level * 0.1));
    
    if (totalTime - lastSpawnTime > adjustedSpawnRate) {
      newSpawnTime = totalTime;
      
      const angle = Math.random() * Math.PI * 2;
      const radius = GAME_CONFIG.ARENA_SIZE / 2 + 1;
      
      const rand = Math.random();
      let type: EnemyType = 'DRONE';
      let hp = 30 + (player.level * 5);
      let dmg = 5 + Math.floor(player.level/2);
      let spd = 3;

      // Cyberpunk enemy types
      if (player.level > 2 && rand > 0.5) {
        type = 'CYBORG';
        hp = 60 + (player.level * 8);
        spd = 2.5;
        dmg = 10 + player.level;
      }
      if (player.level > 5 && rand > 0.85) {
        type = 'MECH';
        hp = 200 + (player.level * 20);
        spd = 1.2;
        dmg = 25 + (player.level * 2);
      }

      newEnemies.push({
        id: genId(),
        position: { x: Math.cos(angle)*radius, z: Math.sin(angle)*radius },
        type,
        health: hp,
        maxHealth: hp,
        speed: spd,
        damage: dmg,
        attackCooldown: 0,
        isHit: 0
      });
    }

    // --- Enemy AI & Physics ---
    let playerHp = player.health;
    let playerXp = player.xp;
    let playerLevel = player.level;
    let playerMaxHp = player.maxHealth;
    let playerMaxXp = player.maxXp;
    let playerDamage = player.damage;
    let enemiesToRemove = new Set<string>();
    let newTexts = [...texts];

    newEnemies = newEnemies.map(e => {
        e.isHit = Math.max(0, e.isHit - delta);
        e.attackCooldown = Math.max(0, e.attackCooldown - delta);

        if (e.health <= 0) {
            enemiesToRemove.add(e.id);
            const xpGain = e.type === 'MECH' ? 100 : e.type === 'CYBORG' ? 35 : 15;
            playerXp += xpGain;
            newTexts.push({
                id: genId(),
                position: {x: e.position.x, z: e.position.z},
                text: `+${xpGain} DATA`,
                color: '#4ade80',
                life: 1.2,
                velocityY: 1
            });
            return e;
        }

        const dx = newPlayerPos.x - e.position.x;
        const dz = newPlayerPos.z - e.position.z;
        const dist = Math.sqrt(dx*dx + dz*dz);

        const attackRange = e.type === 'MECH' ? 2.0 : 1.2;

        if (dist < attackRange) {
            if (e.attackCooldown <= 0) {
                playerHp -= e.damage;
                e.attackCooldown = 1.0; 
                newTexts.push({
                    id: genId(),
                    position: {x: newPlayerPos.x, z: newPlayerPos.z},
                    text: `WARN -${e.damage}`,
                    color: '#ef4444',
                    life: 0.8,
                    velocityY: 2
                });
            }
        } else {
            e.position.x += (dx/dist) * e.speed * delta;
            e.position.z += (dz/dist) * e.speed * delta;
        }
        
        // Separation
        newEnemies.forEach(other => {
            if (e === other) return;
            const odx = e.position.x - other.position.x;
            const odz = e.position.z - other.position.z;
            const odist = Math.sqrt(odx*odx + odz*odz);
            if (odist < 1.0 && odist > 0) {
                e.position.x += (odx/odist) * 3 * delta;
                e.position.z += (odz/odist) * 3 * delta;
            }
        });

        return e;
    });

    // Level Up
    if (playerXp >= playerMaxXp) {
        playerXp -= playerMaxXp;
        playerLevel++;
        playerMaxXp = Math.floor(playerMaxXp * 1.4);
        playerMaxHp += 25;
        playerHp = playerMaxHp; 
        playerDamage += 8;
        
        newTexts.push({
            id: genId(),
            position: {x: newPlayerPos.x, z: newPlayerPos.z},
            text: `SYSTEM UPGRADE`,
            color: '#facc15',
            life: 2.0,
            velocityY: 1.5
        });
    }

    if (playerHp <= 0) {
        set({ gameState: GameState.GAME_OVER });
    }

    // --- Floating Text ---
    newTexts = newTexts.filter(t => t.life > 0).map(t => ({
        ...t,
        position: { ...t.position, x: t.position.x, z: t.position.z },
        velocityY: t.velocityY * 0.9,
        life: t.life - delta
    }));

    set({
      player: { 
        ...player, 
        position: newPlayerPos, 
        rotation: newRotation,
        health: playerHp,
        maxHealth: playerMaxHp,
        xp: playerXp,
        maxXp: playerMaxXp,
        level: playerLevel,
        damage: playerDamage,
        attackCooldown: newAttackCooldown
      },
      enemies: newEnemies.filter(e => !enemiesToRemove.has(e.id)),
      texts: newTexts,
      lastSpawnTime: newSpawnTime,
      score: score + enemiesToRemove.size
    });
  }
}));
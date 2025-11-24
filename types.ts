export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

export type Position = {
  x: number;
  z: number;
};

export type PlayerState = {
  position: Position;
  health: number;
  maxHealth: number;
  xp: number;
  maxXp: number;
  level: number;
  damage: number;
  rotation: number;
  isAttacking: boolean;
  attackCooldown: number;
};

export type EnemyType = 'DRONE' | 'CYBORG' | 'MECH';

export type Enemy = {
  id: string;
  position: Position;
  type: EnemyType;
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
  attackCooldown: number;
  isHit: number;
};

export type FloatingText = {
  id: string;
  position: Position;
  text: string;
  color: string;
  life: number;
  velocityY: number;
};

export const GAME_CONFIG = {
  PLAYER_SPEED: 8,
  ATTACK_RANGE: 3.0,
  ATTACK_ANGLE: Math.PI / 1.5, // Wider slash
  ATTACK_COOLDOWN: 0.25, // Faster attacks
  ARENA_SIZE: 28,
};
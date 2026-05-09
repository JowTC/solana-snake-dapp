// Grid dimensions
export const GRID_COLS = 20;
export const GRID_ROWS = 20;

// Tick speed in ms (lower = faster)
export const TICK_MS_EASY = 200;
export const TICK_MS_NORMAL = 140;
export const TICK_MS_HARD = 90;

// Score per food eaten
export const SCORE_PER_FOOD = 10;
// Bonus for eating quickly (within 5 ticks)
export const SPEED_BONUS = 5;

// Colors — retro Nokia LCD palette
export const COLORS = {
  background: '#0a0a0a',
  gridLine: '#111111',
  snakeHead: '#00ff88',
  snakeBody: '#00cc66',
  snakeTail: '#009944',
  food: '#ff4444',
  foodGlow: '#ff000044',
  wall: '#1a1a2e',
  text: '#00ff88',
  textDim: '#336644',
  ui: '#0d1117',
  uiBorder: '#00ff8844',
  danger: '#ff4444',
  gold: '#ffd700',
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

export const DIFFICULTY_TICK: Record<Difficulty, number> = {
  EASY: TICK_MS_EASY,
  NORMAL: TICK_MS_NORMAL,
  HARD: TICK_MS_HARD,
};

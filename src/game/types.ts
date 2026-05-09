import { Direction, Difficulty } from './constants';

export interface Cell {
  x: number;
  y: number;
}

export interface GameState {
  snake: Cell[];          // index 0 = head
  food: Cell;
  direction: Direction;
  nextDirection: Direction; // buffered input
  score: number;
  highScore: number;
  ticksSinceFood: number;
  isRunning: boolean;
  isGameOver: boolean;
  difficulty: Difficulty;
  walletConnected: boolean;
  walletAddress: string | null;
}

export type GameAction =
  | { type: 'TICK' }
  | { type: 'CHANGE_DIRECTION'; direction: Direction }
  | { type: 'RESTART' }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'SET_HIGH_SCORE'; score: number }
  | { type: 'SET_WALLET'; address: string | null };

import { Cell, GameState, GameAction } from './types';
import {
  GRID_COLS,
  GRID_ROWS,
  SCORE_PER_FOOD,
  SPEED_BONUS,
  Direction,
  Difficulty,
} from './constants';

// ─── helpers ────────────────────────────────────────────────────────────────

export function cellsEqual(a: Cell, b: Cell): boolean {
  return a.x === b.x && a.y === b.y;
}

export function randomFood(snake: Cell[]): Cell {
  let food: Cell;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_COLS),
      y: Math.floor(Math.random() * GRID_ROWS),
    };
  } while (snake.some((c) => cellsEqual(c, food)));
  return food;
}

function nextHead(head: Cell, dir: Direction): Cell {
  switch (dir) {
    case 'UP':    return { x: head.x,     y: head.y - 1 };
    case 'DOWN':  return { x: head.x,     y: head.y + 1 };
    case 'LEFT':  return { x: head.x - 1, y: head.y };
    case 'RIGHT': return { x: head.x + 1, y: head.y };
  }
}

function isOpposite(a: Direction, b: Direction): boolean {
  return (
    (a === 'UP'    && b === 'DOWN')  ||
    (a === 'DOWN'  && b === 'UP')    ||
    (a === 'LEFT'  && b === 'RIGHT') ||
    (a === 'RIGHT' && b === 'LEFT')
  );
}

function isOutOfBounds(cell: Cell): boolean {
  return cell.x < 0 || cell.x >= GRID_COLS || cell.y < 0 || cell.y >= GRID_ROWS;
}

function hitsBody(head: Cell, snake: Cell[]): boolean {
  // skip the tail (it will move away this tick unless we just ate)
  return snake.slice(0, -1).some((c) => cellsEqual(c, head));
}

// ─── initial state ───────────────────────────────────────────────────────────

export function makeInitialState(
  difficulty: Difficulty = 'NORMAL',
  highScore = 0,
  walletAddress: string | null = null,
): GameState {
  const snake: Cell[] = [
    { x: 10, y: 10 },
    { x: 9,  y: 10 },
    { x: 8,  y: 10 },
  ];
  return {
    snake,
    food: randomFood(snake),
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    score: 0,
    highScore,
    ticksSinceFood: 0,
    isRunning: true,
    isGameOver: false,
    difficulty,
    walletConnected: walletAddress !== null,
    walletAddress,
  };
}

// ─── reducer ─────────────────────────────────────────────────────────────────

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'CHANGE_DIRECTION': {
      const { direction } = action;
      // Ignore reversal
      if (isOpposite(direction, state.direction)) return state;
      return { ...state, nextDirection: direction };
    }

    case 'TICK': {
      if (!state.isRunning || state.isGameOver) return state;

      const dir = state.nextDirection;
      const head = nextHead(state.snake[0], dir);

      // Collision checks
      if (isOutOfBounds(head) || hitsBody(head, state.snake)) {
        return {
          ...state,
          isRunning: false,
          isGameOver: true,
          highScore: Math.max(state.score, state.highScore),
        };
      }

      const ateFood = cellsEqual(head, state.food);
      const newSnake = ateFood
        ? [head, ...state.snake]           // grow
        : [head, ...state.snake.slice(0, -1)]; // move

      const bonus = ateFood && state.ticksSinceFood <= 5 ? SPEED_BONUS : 0;
      const newScore = ateFood ? state.score + SCORE_PER_FOOD + bonus : state.score;

      return {
        ...state,
        snake: newSnake,
        food: ateFood ? randomFood(newSnake) : state.food,
        direction: dir,
        score: newScore,
        highScore: Math.max(newScore, state.highScore),
        ticksSinceFood: ateFood ? 0 : state.ticksSinceFood + 1,
      };
    }

    case 'RESTART': {
      return makeInitialState(state.difficulty, state.highScore, state.walletAddress);
    }

    case 'SET_DIFFICULTY': {
      return { ...state, difficulty: action.difficulty };
    }

    case 'SET_HIGH_SCORE': {
      return { ...state, highScore: action.score };
    }

    case 'SET_WALLET': {
      return {
        ...state,
        walletAddress: action.address,
        walletConnected: action.address !== null,
      };
    }

    default:
      return state;
  }
}

import { useReducer, useEffect, useRef, useCallback } from 'react';
import { gameReducer, makeInitialState } from '../game/engine';
import { GameState, GameAction } from '../game/types';
import { Direction, Difficulty, DIFFICULTY_TICK } from '../game/constants';

export function useGameLoop(initialDifficulty: Difficulty = 'NORMAL', highScore = 0) {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    () => makeInitialState(initialDifficulty, highScore),
  );

  const stateRef = useRef<GameState>(state);
  stateRef.current = state;

  // Tick loop
  useEffect(() => {
    if (state.isGameOver) return;

    const tickMs = DIFFICULTY_TICK[state.difficulty];
    const id = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, tickMs);

    return () => clearInterval(id);
  }, [state.isGameOver, state.difficulty]);

  const changeDirection = useCallback((dir: Direction) => {
    dispatch({ type: 'CHANGE_DIRECTION', direction: dir });
  }, []);

  const restart = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    dispatch({ type: 'SET_DIFFICULTY', difficulty });
  }, []);

  const setWallet = useCallback((address: string | null) => {
    dispatch({ type: 'SET_WALLET', address });
  }, []);

  return { state, changeDirection, restart, setDifficulty, setWallet };
}

import React, { useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  PanResponder,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useGameLoop } from '../hooks/useGameLoop';
import { useHighScore } from '../hooks/useHighScore';
import { useWallet } from '../hooks/useWallet';
import { GameBoard } from '../components/GameBoard';
import { DPad } from '../components/DPad';
import { ScoreBar } from '../components/ScoreBar';
import { GameOverlay } from '../components/GameOverlay';
import { WalletButton } from '../components/WalletButton';
import { GRID_COLS, GRID_ROWS, COLORS, Direction, Difficulty } from '../game/constants';

// Minimum pixels the finger must travel before we treat it as a swipe
const SWIPE_THRESHOLD = 30;

export function GameScreen() {
  const { width, height } = useWindowDimensions();
  const { highScore, saveHighScore, loaded } = useHighScore();

  const { state, changeDirection, restart, setDifficulty, setWallet } = useGameLoop(
    'NORMAL',
    highScore,
  );

  const { address, connecting, connect, disconnect } = useWallet();

  useEffect(() => { setWallet(address); }, [address, setWallet]);

  useEffect(() => {
    if (state.isGameOver) saveHighScore(state.score);
  }, [state.isGameOver, state.score, saveHighScore]);

  // Cell size — reserve space for score bar (~60px) + wallet row (~48px) + dpad (~220px) + padding
  const boardAreaHeight = height - 60 - 48 - 220 - 32;
  const cellByWidth = Math.floor((width - 32) / GRID_COLS);
  const cellByHeight = Math.floor(boardAreaHeight / GRID_ROWS);
  const cellSize = Math.max(8, Math.min(cellByWidth, cellByHeight));

  // Keep a stable ref so the PanResponder closure always calls the latest version
  const changeDirectionRef = useRef(changeDirection);
  changeDirectionRef.current = changeDirection;

  // Swipe gesture — attached only to the board view, not the D-pad
  // onMoveShouldSetPanResponder fires only after the finger moves, so
  // D-pad button taps are never intercepted.
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_e, gs) =>
        Math.abs(gs.dx) > SWIPE_THRESHOLD || Math.abs(gs.dy) > SWIPE_THRESHOLD,

      onPanResponderRelease: (_e, gs) => {
        const { dx, dy } = gs;
        if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;

        let dir: Direction;
        if (Math.abs(dx) > Math.abs(dy)) {
          dir = dx > 0 ? 'RIGHT' : 'LEFT';
        } else {
          dir = dy > 0 ? 'DOWN' : 'UP';
        }
        changeDirectionRef.current(dir);
      },
    }),
  ).current;

  const handleChangeDifficulty = useCallback(
    (d: Difficulty) => { setDifficulty(d); restart(); },
    [setDifficulty, restart],
  );

  const isNewRecord = state.isGameOver && state.score > 0 && state.score >= state.highScore;

  if (!loaded) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScoreBar
        score={state.score}
        highScore={state.highScore}
        walletAddress={state.walletAddress}
      />

      <View style={styles.walletRow}>
        <WalletButton
          address={address}
          connecting={connecting}
          onConnect={connect}
          onDisconnect={disconnect}
        />
      </View>

      {/* Board — swipe zone is ONLY here, not over the D-pad */}
      <View style={styles.boardWrapper}>
        <View {...panResponder.panHandlers}>
          <GameBoard snake={state.snake} food={state.food} cellSize={cellSize} />
        </View>

        {state.isGameOver && (
          <GameOverlay
            score={state.score}
            highScore={state.highScore}
            isNewRecord={isNewRecord}
            difficulty={state.difficulty}
            onRestart={restart}
            onChangeDifficulty={handleChangeDifficulty}
          />
        )}
      </View>

      {/* D-Pad — completely outside the swipe zone */}
      <View style={styles.dpadWrapper}>
        <DPad onPress={changeDirection} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  walletRow: {
    paddingVertical: 8,
  },
  boardWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dpadWrapper: {
    paddingBottom: 16,
  },
});

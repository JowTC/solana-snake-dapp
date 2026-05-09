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

const SWIPE_THRESHOLD = 20;

export function GameScreen() {
  const { width, height } = useWindowDimensions();
  const { highScore, saveHighScore, loaded } = useHighScore();

  const { state, changeDirection, restart, setDifficulty, setWallet } = useGameLoop(
    'NORMAL',
    highScore,
  );

  const { address, connecting, connect, disconnect } = useWallet();

  // Sync wallet address into game state
  useEffect(() => {
    setWallet(address);
  }, [address, setWallet]);

  // Save high score when game ends
  useEffect(() => {
    if (state.isGameOver) {
      saveHighScore(state.score);
    }
  }, [state.isGameOver, state.score, saveHighScore]);

  // Calculate cell size to fit the board on screen
  // Reserve space for score bar (~60px) + dpad (~220px) + padding
  const boardAreaHeight = height - 60 - 220 - 32;
  const cellByWidth = Math.floor((width - 32) / GRID_COLS);
  const cellByHeight = Math.floor(boardAreaHeight / GRID_ROWS);
  const cellSize = Math.max(8, Math.min(cellByWidth, cellByHeight));

  // Swipe gesture
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        swipeStart.current = {
          x: e.nativeEvent.pageX,
          y: e.nativeEvent.pageY,
        };
      },
      onPanResponderRelease: (e) => {
        if (!swipeStart.current) return;
        const dx = e.nativeEvent.pageX - swipeStart.current.x;
        const dy = e.nativeEvent.pageY - swipeStart.current.y;
        swipeStart.current = null;

        if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;

        let dir: Direction;
        if (Math.abs(dx) > Math.abs(dy)) {
          dir = dx > 0 ? 'RIGHT' : 'LEFT';
        } else {
          dir = dy > 0 ? 'DOWN' : 'UP';
        }
        changeDirection(dir);
      },
    }),
  ).current;

  const handleChangeDifficulty = useCallback(
    (d: Difficulty) => {
      setDifficulty(d);
      restart();
    },
    [setDifficulty, restart],
  );

  const isNewRecord = state.isGameOver && state.score > 0 && state.score >= state.highScore;

  if (!loaded) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Score bar */}
      <ScoreBar
        score={state.score}
        highScore={state.highScore}
        walletAddress={state.walletAddress}
      />

      {/* Wallet button */}
      <View style={styles.walletRow}>
        <WalletButton
          address={address}
          connecting={connecting}
          onConnect={connect}
          onDisconnect={disconnect}
        />
      </View>

      {/* Board + swipe zone */}
      <View style={styles.boardWrapper} {...panResponder.panHandlers}>
        <GameBoard snake={state.snake} food={state.food} cellSize={cellSize} />

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

      {/* D-Pad */}
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

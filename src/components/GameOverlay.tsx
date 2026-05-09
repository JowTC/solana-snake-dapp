import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, Difficulty } from '../game/constants';

interface Props {
  score: number;
  highScore: number;
  isNewRecord: boolean;
  difficulty: Difficulty;
  onRestart: () => void;
  onChangeDifficulty: (d: Difficulty) => void;
}

const DIFFICULTIES: Difficulty[] = ['EASY', 'NORMAL', 'HARD'];

export function GameOverlay({
  score,
  highScore,
  isNewRecord,
  difficulty,
  onRestart,
  onChangeDifficulty,
}: Props) {
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>GAME OVER</Text>

        {isNewRecord && (
          <Text style={styles.newRecord}>🏆 NEW RECORD!</Text>
        )}

        <Text style={styles.scoreLabel}>SCORE</Text>
        <Text style={styles.scoreValue}>{score}</Text>

        <Text style={styles.bestLabel}>BEST: {highScore}</Text>

        <View style={styles.diffRow}>
          {DIFFICULTIES.map((d) => (
            <TouchableOpacity
              key={d}
              style={[
                styles.diffBtn,
                d === difficulty && styles.diffBtnActive,
              ]}
              onPress={() => onChangeDifficulty(d)}
              accessibilityRole="button"
              accessibilityLabel={`Set difficulty ${d}`}
            >
              <Text
                style={[
                  styles.diffText,
                  d === difficulty && styles.diffTextActive,
                ]}
              >
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.restartBtn}
          onPress={onRestart}
          accessibilityRole="button"
          accessibilityLabel="Play again"
        >
          <Text style={styles.restartText}>▶  PLAY AGAIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000cc',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  card: {
    backgroundColor: COLORS.ui,
    borderWidth: 1,
    borderColor: COLORS.uiBorder,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    minWidth: 260,
  },
  title: {
    color: COLORS.danger,
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 4,
    marginBottom: 8,
  },
  newRecord: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scoreLabel: {
    color: COLORS.textDim,
    fontSize: 11,
    letterSpacing: 3,
    marginTop: 8,
  },
  scoreValue: {
    color: COLORS.text,
    fontSize: 48,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  bestLabel: {
    color: COLORS.gold,
    fontSize: 14,
    marginBottom: 20,
  },
  diffRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  diffBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.uiBorder,
    borderRadius: 6,
  },
  diffBtnActive: {
    backgroundColor: COLORS.snakeHead + '33',
    borderColor: COLORS.snakeHead,
  },
  diffText: {
    color: COLORS.textDim,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  diffTextActive: {
    color: COLORS.text,
  },
  restartBtn: {
    backgroundColor: COLORS.snakeHead,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  restartText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

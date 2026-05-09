import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../game/constants';

interface Props {
  score: number;
  highScore: number;
  walletAddress: string | null;
}

export function ScoreBar({ score, highScore, walletAddress }: Props) {
  const shortAddr = walletAddress
    ? `${walletAddress.slice(0, 4)}…${walletAddress.slice(-4)}`
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.label}>SCORE</Text>
        <Text style={styles.value}>{score}</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>BEST</Text>
        <Text style={[styles.value, { color: COLORS.gold }]}>{highScore}</Text>
      </View>
      {shortAddr && (
        <View style={styles.item}>
          <Text style={styles.label}>WALLET</Text>
          <Text style={[styles.value, { fontSize: 10 }]}>{shortAddr}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.ui,
    borderBottomWidth: 1,
    borderColor: COLORS.uiBorder,
  },
  item: {
    alignItems: 'center',
  },
  label: {
    color: COLORS.textDim,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '600',
  },
  value: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
});

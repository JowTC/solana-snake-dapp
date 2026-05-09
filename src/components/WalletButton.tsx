import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../game/constants';

interface Props {
  address: string | null;
  connecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WalletButton({ address, connecting, onConnect, onDisconnect }: Props) {
  if (connecting) {
    return (
      <TouchableOpacity style={styles.btn} disabled>
        <ActivityIndicator size="small" color={COLORS.text} />
      </TouchableOpacity>
    );
  }

  if (address) {
    const short = `${address.slice(0, 4)}…${address.slice(-4)}`;
    return (
      <TouchableOpacity
        style={[styles.btn, styles.connected]}
        onPress={onDisconnect}
        accessibilityRole="button"
        accessibilityLabel="Disconnect wallet"
      >
        <Text style={styles.text}>◉ {short}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={onConnect}
      accessibilityRole="button"
      accessibilityLabel="Connect Solana wallet"
    >
      <Text style={styles.text}>Connect Wallet</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.uiBorder,
    borderRadius: 20,
    backgroundColor: COLORS.ui,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
  },
  connected: {
    borderColor: COLORS.snakeHead,
    backgroundColor: COLORS.snakeHead + '22',
  },
  text: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
});

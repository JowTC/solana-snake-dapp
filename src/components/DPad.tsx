import React, { useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Direction, COLORS } from '../game/constants';

interface Props {
  onPress: (dir: Direction) => void;
}

const DEBOUNCE_MS = 80; // ignore taps faster than one tick

export function DPad({ onPress }: Props) {
  const lastPress = useRef(0);

  const handlePress = (dir: Direction) => {
    const now = Date.now();
    if (now - lastPress.current < DEBOUNCE_MS) return;
    lastPress.current = now;
    onPress(dir);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <DPadButton label="▲" onPress={() => handlePress('UP')} />
      </View>
      <View style={styles.row}>
        <DPadButton label="◀" onPress={() => handlePress('LEFT')} />
        <View style={styles.center} />
        <DPadButton label="▶" onPress={() => handlePress('RIGHT')} />
      </View>
      <View style={styles.row}>
        <DPadButton label="▼" onPress={() => handlePress('DOWN')} />
      </View>
    </View>
  );
}

function DPadButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.5}
      accessibilityRole="button"
      accessibilityLabel={`Move ${label}`}
    >
      <Text style={styles.arrow}>{label}</Text>
    </TouchableOpacity>
  );
}

const BTN = 64;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: BTN,
    height: BTN,
    backgroundColor: COLORS.ui,
    borderWidth: 1,
    borderColor: COLORS.uiBorder,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  arrow: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: 'bold',
  },
  center: {
    width: BTN,
    height: BTN,
    margin: 4,
  },
});

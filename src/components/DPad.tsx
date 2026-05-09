import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Direction, COLORS } from '../game/constants';

interface Props {
  onPress: (dir: Direction) => void;
}

export function DPad({ onPress }: Props) {
  return (
    <View style={styles.container}>
      {/* UP */}
      <View style={styles.row}>
        <DPadButton label="▲" onPress={() => onPress('UP')} />
      </View>
      {/* LEFT / CENTER / RIGHT */}
      <View style={styles.row}>
        <DPadButton label="◀" onPress={() => onPress('LEFT')} />
        <View style={styles.center} />
        <DPadButton label="▶" onPress={() => onPress('RIGHT')} />
      </View>
      {/* DOWN */}
      <View style={styles.row}>
        <DPadButton label="▼" onPress={() => onPress('DOWN')} />
      </View>
    </View>
  );
}

function DPadButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.6}
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

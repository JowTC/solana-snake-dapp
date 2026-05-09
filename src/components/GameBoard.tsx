import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Cell } from '../game/types';
import { GRID_COLS, GRID_ROWS, COLORS } from '../game/constants';
import { cellsEqual } from '../game/engine';

interface Props {
  snake: Cell[];
  food: Cell;
  cellSize: number;
}

export function GameBoard({ snake, food, cellSize }: Props) {
  const head = snake[0];

  // Build a Set for O(1) lookup
  const snakeSet = useMemo(() => {
    const s = new Set<string>();
    snake.forEach((c) => s.add(`${c.x},${c.y}`));
    return s;
  }, [snake]);

  const cells = useMemo(() => {
    const result: React.ReactElement[] = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const key = `${col},${row}`;
        const isHead = head.x === col && head.y === row;
        const isSnake = snakeSet.has(key);
        const isFood = food.x === col && food.y === row;

        let bg = 'transparent';
        if (isHead) bg = COLORS.snakeHead;
        else if (isSnake) {
          // Gradient-like: tail is darker
          const idx = snake.findIndex((c) => c.x === col && c.y === row);
          const ratio = idx / snake.length;
          bg = ratio < 0.4 ? COLORS.snakeBody : COLORS.snakeTail;
        } else if (isFood) bg = COLORS.food;

        result.push(
          <View
            key={key}
            style={[
              styles.cell,
              {
                width: cellSize,
                height: cellSize,
                backgroundColor: bg,
                borderRadius: isHead ? cellSize * 0.3 : isFood ? cellSize * 0.5 : 2,
                // Food glow effect
                shadowColor: isFood ? COLORS.food : isHead ? COLORS.snakeHead : 'transparent',
                shadowOpacity: isFood || isHead ? 0.8 : 0,
                shadowRadius: isFood ? 6 : 3,
                elevation: isFood ? 4 : isHead ? 2 : 0,
              },
            ]}
          />,
        );
      }
    }
    return result;
  }, [snake, food, head, snakeSet, cellSize]);

  return (
    <View
      style={[
        styles.board,
        {
          width: cellSize * GRID_COLS,
          height: cellSize * GRID_ROWS,
        },
      ]}
    >
      {cells}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.uiBorder,
    borderRadius: 4,
    overflow: 'hidden',
  },
  cell: {
    margin: 0.5,
  },
});

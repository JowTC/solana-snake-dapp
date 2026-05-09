import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Cell } from '../game/types';
import { GRID_COLS, GRID_ROWS, COLORS } from '../game/constants';

interface Props {
  snake: Cell[];
  food: Cell;
  cellSize: number;
}

export function GameBoard({ snake, food, cellSize }: Props) {
  const boardWidth = cellSize * GRID_COLS;
  const boardHeight = cellSize * GRID_ROWS;

  // Build lookup maps for O(1) access
  const snakeMap = useMemo(() => {
    const m = new Map<string, number>();
    snake.forEach((c, i) => m.set(`${c.x},${c.y}`, i));
    return m;
  }, [snake]);

  const cells = useMemo(() => {
    const result: React.ReactElement[] = [];

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const key = `${col},${row}`;
        const snakeIndex = snakeMap.get(key);
        const isSnake = snakeIndex !== undefined;
        const isHead = snakeIndex === 0;
        const isFood = food.x === col && food.y === row;

        if (!isSnake && !isFood) continue; // skip empty cells entirely

        let bg = 'transparent';
        if (isHead) bg = COLORS.snakeHead;
        else if (isSnake) {
          const ratio = snakeIndex! / snake.length;
          bg = ratio < 0.4 ? COLORS.snakeBody : COLORS.snakeTail;
        } else if (isFood) {
          bg = COLORS.food;
        }

        const padding = 1; // gap between cells
        result.push(
          <View
            key={key}
            style={{
              position: 'absolute',
              left: col * cellSize + padding,
              top: row * cellSize + padding,
              width: cellSize - padding * 2,
              height: cellSize - padding * 2,
              backgroundColor: bg,
              borderRadius: isHead
                ? (cellSize - padding * 2) * 0.3
                : isFood
                ? (cellSize - padding * 2) * 0.5
                : 2,
              // Glow
              shadowColor: isFood ? COLORS.food : isHead ? COLORS.snakeHead : undefined,
              shadowOpacity: isFood || isHead ? 0.9 : 0,
              shadowRadius: isFood ? 6 : 3,
              elevation: isFood ? 4 : isHead ? 2 : 0,
            }}
          />,
        );
      }
    }
    return result;
  }, [snake, food, snakeMap, cellSize]);

  return (
    <View
      style={[
        styles.board,
        { width: boardWidth, height: boardHeight },
      ]}
    >
      {cells}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.uiBorder,
    borderRadius: 4,
    overflow: 'hidden',
  },
});

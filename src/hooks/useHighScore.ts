import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HIGH_SCORE_KEY = '@solana_snake_high_score';

export function useHighScore() {
  const [highScore, setHighScoreState] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(HIGH_SCORE_KEY)
      .then((val) => {
        if (val !== null) setHighScoreState(parseInt(val, 10));
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const saveHighScore = async (score: number) => {
    if (score > highScore) {
      setHighScoreState(score);
      await AsyncStorage.setItem(HIGH_SCORE_KEY, String(score));
    }
  };

  return { highScore, saveHighScore, loaded };
}

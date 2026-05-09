// Polyfills — must be first, before any other imports
// Required by @solana/web3.js on React Native (Expo SDK 49+)
// See: https://docs.solanamobile.com/react-native/expo#step-3---update-appjs-with-polyfills

import { getRandomValues as expoCryptoGetRandomValues } from 'expo-crypto';
import { Buffer } from 'buffer';

global.Buffer = Buffer;

// Polyfill window.crypto.getRandomValues
class Crypto {
  getRandomValues = expoCryptoGetRandomValues;
}

const webCrypto = typeof crypto !== 'undefined' ? crypto : new Crypto();

(() => {
  if (typeof crypto === 'undefined') {
    Object.defineProperty(window, 'crypto', {
      configurable: true,
      enumerable: true,
      get: () => webCrypto,
    });
  }
})();

// Expo Router entrypoint — must be last
import 'expo-router/entry';

# 🐍 Solana Snake dApp

A retro Snake game built with **Expo + React Native** for the **Solana dApp Store**.  
Connects to any MWA-compatible Solana wallet (Phantom, Solflare, etc.) on Android.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Expo SDK 52 / React Native 0.76 |
| Routing | Expo Router v4 |
| Wallet | Mobile Wallet Adapter (MWA) v2 |
| Chain | Solana (`@solana/web3.js` v1) |
| Storage | AsyncStorage (local high score) |
| Build | EAS Build |

---

## Project structure

```
app/
  _layout.tsx        # polyfills + root navigator
  index.tsx          # entry → GameScreen
src/
  game/
    constants.ts     # grid size, colors, tick speeds
    types.ts         # Cell, GameState, GameAction
    engine.ts        # pure reducer + helpers
  hooks/
    useGameLoop.ts   # tick loop + dispatch
    useHighScore.ts  # AsyncStorage persistence
    useWallet.ts     # MWA connect/disconnect
  components/
    GameBoard.tsx    # grid renderer
    DPad.tsx         # on-screen directional pad
    ScoreBar.tsx     # score / best / wallet address
    GameOverlay.tsx  # game-over modal
    WalletButton.tsx # connect / disconnect button
  screens/
    GameScreen.tsx   # main screen, swipe + dpad
```

---

## Getting started

### 1. Prerequisites

- Node 20+
- Android Studio + Android SDK (API 26+)
- Physical Android device **or** emulator with Google Play (for wallet app)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [EAS CLI](https://docs.expo.dev/eas/) — `npm install -g eas-cli`

### 2. Install dependencies

```bash
yarn install
# or: npm install  (see note below)
```

> ⚠️ If you see `TS2307: Cannot find module @solana-mobile/mobile-wallet-adapter-protocol`,  
> use **yarn** instead of npm — known upstream issue.

### 3. Run on device / emulator

```bash
# Development build (first time — installs the custom dev client)
eas build --platform android --profile development --local

# After the dev client is installed, start the dev server
npx expo start --dev-client
```

### 4. Build release APK for Solana dApp Store

```bash
eas build --platform android --profile dapp-store
```

Verify signing:
```bash
apksigner verify --print-certs app-release.apk
```

---

## Solana dApp Store submission checklist

- [ ] EAS project ID set in `app.json` → `extra.eas.projectId`
- [ ] Release APK signed with a **separate key** from Google Play (if dual-publishing)
- [ ] `assets/icon.png` — 512×512 px
- [ ] `assets/splash.png` — 1242×2436 px
- [ ] At least 4 screenshots at 1080p
- [ ] Publisher account + KYC at [publish.solanamobile.com](https://publish.solanamobile.com/)
- [ ] ~0.2 SOL in publisher wallet for listing fees
- [ ] Read [Publisher Policy](https://docs.solanamobile.com/dapp-store/publisher-policy)

---

## Gameplay

| Feature | Detail |
|---|---|
| Grid | 20 × 20 |
| Controls | On-screen D-pad **or** swipe anywhere on the board |
| Difficulties | Easy (200 ms/tick) · Normal (140 ms) · Hard (90 ms) |
| Scoring | 10 pts per food · +5 speed bonus if eaten within 5 ticks |
| High score | Persisted locally via AsyncStorage |
| Wallet | Optional — connect to show your address; required for future on-chain features |

---

## Roadmap

- [ ] On-chain leaderboard (Anchor program)
- [ ] Signed score attestation via MWA `signMessage`
- [ ] Cosmetic skins as compressed NFTs
- [ ] Solana Pay QR for in-app purchases

# Cloud Build & GitHub Setup Guide

This project uses **EAS Build** (Expo's cloud build service) for all Android APK builds.  
No Android Studio or local SDK needed on CI — everything runs in Expo's cloud.

---

## 1. Create the GitHub repository

```bash
# In this project folder
git init          # already done if you cloned
git add .
git commit -m "feat: initial Solana Snake dApp"

# Create repo on GitHub (requires GitHub CLI)
gh repo create solana-snake-dapp --public --source=. --remote=origin --push

# Or manually: go to github.com/new, then:
git remote add origin https://github.com/YOUR_USERNAME/solana-snake-dapp.git
git push -u origin main
```

---

## 2. Create an Expo account & EAS project

1. Sign up at **[expo.dev](https://expo.dev)** (free tier is enough)
2. Install EAS CLI locally once:
   ```bash
   npm install -g eas-cli
   eas login
   ```
3. Link this project to EAS:
   ```bash
   eas init
   ```
   This writes your real `projectId` into `app.json` automatically.  
   Commit the updated `app.json`.

---

## 3. Add the EXPO_TOKEN secret to GitHub

EAS needs your Expo token to trigger cloud builds from GitHub Actions.

1. Go to **[expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens)**
2. Create a new token → copy it
3. In your GitHub repo → **Settings → Secrets and variables → Actions**
4. Click **New repository secret**:
   - Name: `EXPO_TOKEN`
   - Value: *(paste your token)*

That's the only secret needed. EAS manages the Android signing keystore itself.

---

## 4. Branch strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code. Merging here + tagging triggers a release APK. |
| `develop` | Integration branch. PRs here trigger a preview APK build. |
| `feature/*` | Your day-to-day work branches. |

```bash
# Start a feature
git checkout -b feature/on-chain-leaderboard

# When done, open a PR to develop
gh pr create --base develop --title "feat: on-chain leaderboard"
```

---

## 5. CI/CD workflows at a glance

| File | Trigger | What it does |
|---|---|---|
| `ci.yml` | Every push / PR | TypeScript check + ESLint |
| `build-preview.yml` | PR opened/updated to `main` | EAS preview APK (internal test) |
| `build-release.yml` | Push tag `v*.*.*` | EAS dApp Store APK + GitHub Release |
| `build-dev.yml` | Manual (`workflow_dispatch`) | Rebuilds dev client (after native dep changes) |

---

## 6. Release a new version

```bash
# Bump version in package.json / app.json if needed, then:
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions will:
1. Update `versionCode` automatically from the tag
2. Trigger `eas build --profile dapp-store` in Expo's cloud
3. Create a GitHub Release entry

Download the signed APK from **[expo.dev](https://expo.dev) → your project → Builds**.

---

## 7. Verify the APK before submitting to Solana dApp Store

```bash
# Download the APK from Expo dashboard, then:
apksigner verify --print-certs solana-snake.apk
```

Then submit at **[publish.solanamobile.com](https://publish.solanamobile.com/)**.

---

## 8. Recommended GitHub branch protection rules

Go to **Settings → Branches → Add rule** for `main`:

- [x] Require a pull request before merging
- [x] Require status checks to pass: `Lint & Type Check`
- [x] Require branches to be up to date before merging
- [x] Do not allow bypassing the above settings

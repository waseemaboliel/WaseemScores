# WaseemScores

A full-featured soccer scores app (like 365Scores) built with React Native + Expo, covering 150+ leagues worldwide using the ESPN public API.

## Tech Stack

- **Framework**: React Native + Expo SDK 56
- **Language**: TypeScript
- **React**: 19.2.3
- **React Native**: 0.85.3

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | v22+ (via nvm) | `nvm install 22 && nvm use 22` |
| Xcode | 26+ | Mac App Store |
| Watchman | Latest | `brew install watchman` |
| CocoaPods | 1.16+ | `brew install cocoapods` |

## Quick Start

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/WaseemScores.git
cd WaseemScores

# Switch to the correct Node version
nvm use 22

# Install dependencies
npm install

# Run on iOS Simulator (first time takes 3-5 min to build native code)
npx expo run:ios

# After the first build, you can use the faster dev server:
npx expo start
# Then press 'i' to open in iOS Simulator
```

## Running the App

### iOS Simulator (Recommended for Development)

```bash
# First time — builds native iOS app (slow, ~3-5 min)
npx expo run:ios

# Subsequent runs — uses cached build (fast, ~5 sec)
npx expo start
# Press 'i' to open in simulator
```

### Physical iPhone

```bash
# Option 1: Via Expo Go app (same WiFi)
npx expo start
# Scan the QR code with your iPhone camera → opens in Expo Go

# Option 2: Via USB cable (native build)
npx expo run:ios --device
```

### Web Browser (Quick UI Testing)

```bash
npx expo start --web
```

## Project Structure

```
WaseemScores/
├── App.tsx                 # App entry point
├── index.ts                # Expo entry file
├── app.json                # Expo config
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── ios/                    # Native iOS project (auto-generated)
├── assets/                 # App icons, splash screen
├── ESPN-Soccer-Leagues-API.md  # Full API reference (150+ leagues)
├── PROJECT-PLAN.md         # Full feature plan & phases
└── DEVLOG.md               # Development log & decisions
```

## API

ESPN public endpoints (no API key required):

```
Scoreboard:  https://site.api.espn.com/apis/site/v2/sports/soccer/{SLUG}/scoreboard
Standings:   https://site.web.api.espn.com/apis/v2/sports/soccer/{SLUG}/standings
Match:       https://site.api.espn.com/apis/site/v2/sports/soccer/{SLUG}/summary?event={ID}
```

See [ESPN-Soccer-Leagues-API.md](ESPN-Soccer-Leagues-API.md) for the full league list and API docs.

## Development

- Edit `App.tsx` and save — changes appear instantly (hot reload)
- See [PROJECT-PLAN.md](PROJECT-PLAN.md) for the full roadmap
- See [DEVLOG.md](DEVLOG.md) for setup history and decisions

## License

Private project.

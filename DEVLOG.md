# WaseemScores — Development Log

## Phase 1: Workspace & Environment Setup
**Date**: 2026-06-21
**Status**: ✅ Complete

---

### 1.1 Prerequisites Installed

#### Node.js v22.23.0 (via nvm)
- **What**: JavaScript runtime that executes all our code
- **Why**: Expo SDK 56 requires Node `^20.19.4 || ^22.13.0` — our original v20.11.1 was too old
- **Install**: `nvm install 22 && nvm alias default 22`
- **Verify**: `node --version` → v22.23.0

#### Xcode 26.3
- **What**: Apple's IDE that provides the iOS SDK, simulators, and build tools
- **Why**: Required to compile native iOS code and run the iOS Simulator
- **Install**: Mac App Store (free, ~12GB)
- **Verify**: `xcodebuild -version` → Xcode 26.3

#### Xcode Command Line Tools
- **What**: Compiler toolchain (clang, make, git, etc.)
- **Why**: Required by CocoaPods and native build process
- **Install**: `xcode-select --install`
- **Verify**: `xcode-select -p` → /Applications/Xcode.app/Contents/Developer

#### Watchman 2026.06.15.00
- **What**: A file watching service built by Meta/Facebook
- **Why**: Detects file changes instantly for hot reload — without it, the dev server would poll the filesystem (slow and battery-draining)
- **Install**: `brew install watchman`
- **Dependencies installed by Homebrew**:
  - `xz` — data compression library (lzma)
  - `boost` — C++ utility libraries used by Folly
  - `double-conversion` — binary-decimal number conversion (used by Folly)
  - `fmt` — modern C++ formatting library
  - `gflags` — Google's command-line flags library
  - `glog` — Google's logging library
  - `libevent` — event notification library (async I/O)
  - `libsodium` — modern cryptography library
  - `snappy` — fast compression/decompression (Google)
  - `folly` — Facebook's Open Source Library (core C++ utilities)
  - `fizz` — Facebook's TLS 1.3 implementation
  - `wangle` — Facebook's networking framework
  - `xxhash` — extremely fast hash algorithm
  - `fbthrift` — Facebook's Thrift RPC framework
  - `fb303` — Facebook's base service monitoring interface
  - `edencommon` — shared libraries for Meta's Eden filesystem tools
  - `readline` — line editing for terminal input
  - `sqlite` — embedded SQL database engine
  - `python@3.14` — Python runtime (build dependency)
- **Verify**: `watchman --version` → 2026.06.15.00

#### CocoaPods 1.16.2
- **What**: Dependency manager for iOS/macOS native libraries
- **Why**: React Native's iOS native modules are distributed as Pods — CocoaPods downloads and links them into the Xcode project
- **Install**: `brew install cocoapods`
- **Verify**: `pod --version` → 1.16.2

#### Homebrew 6.0.2
- **What**: macOS package manager
- **Why**: Used to install Watchman, CocoaPods, and Node
- **Already installed**: `brew --version` → Homebrew 6.0.2

---

### 1.2 Expo Project Created

- **Template**: `blank-typescript` (Expo SDK 56)
- **Command**: `npx create-expo-app@latest . --template blank-typescript`
- **SDK**: Expo 56.0.12
- **React**: 19.2.3
- **React Native**: 0.85.3
- **TypeScript**: 6.0.3

#### Project files created:
| File | Purpose |
|------|---------|
| `App.tsx` | Main app component (entry point) |
| `index.ts` | Expo entry file that registers the app |
| `app.json` | Expo configuration (app name, icons, splash) |
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `assets/` | Icon and splash screen images |
| `.gitignore` | Git ignore rules (node_modules, ios/, etc.) |

---

### 1.3 Native iOS Build

- **Command**: `npx expo run:ios`
- **What happened**:
  1. Created native `ios/` directory (Expo prebuild)
  2. Installed CocoaPods (iOS native dependencies)
  3. Compiled all native modules (React Native, Expo modules, Hermes engine)
  4. Linked the final binary
  5. Installed app on iPhone 17 Pro Simulator
  6. Started Metro bundler for JavaScript hot reload
- **Bundle ID**: `com.anonymous.WaseemScores`
- **Build time**: ~3-5 minutes (first build only)
- **Warnings** (safe to ignore):
  - `ld: -undefined dynamic_lookup is deprecated on iOS-simulator` — Apple deprecation warning, harmless
  - `ld: ignoring duplicate libraries: '-lc++'` — duplicate link flag, harmless

---

### 1.4 Available iOS Simulators

| Device | ID |
|--------|-----|
| iPhone 17 Pro | BB662567-2AA6-4936-B528-BAF29C0A6F58 |
| iPhone 17 Pro Max | E43AC01B-9A22-41C3-A83F-794FB6FA6B2C |
| iPhone Air | 73F63799-4D38-4B38-B485-7C96CC9690BD |
| iPhone 17 | EEE32091-9D05-491C-B811-9072FF08721E |
| iPhone 16e | FFD28FE2-342A-4F38-B558-BE0A8936A31D |

---

### 1.5 How to Run the App (Quick Reference)

```bash
# Make sure you're using the right Node version
nvm use 22

# FIRST TIME (or after native config changes):
npx expo run:ios
# This builds the native iOS app (~3-5 min) and starts the dev server

# EVERY OTHER TIME (fast, ~5 seconds):
npx expo start
# Then press 'i' to open in iOS Simulator
# Or scan the QR code with your iPhone's camera for physical device testing

# IF NATIVE CONFIG CHANGES (new native libraries, permissions, etc.):
npx expo prebuild --clean
npx expo run:ios
```

---

### 1.6 Key Learnings

1. **Expo Go does NOT support SDK 56** — must use `npx expo run:ios` for native development builds
2. **Node version matters** — SDK 56 needs Node ≥20.19.4 (we use v22 via nvm)
3. **First build is slow** (3-5 min) but subsequent launches are fast via `npx expo start`
4. **`ios/` folder is auto-generated** — never edit it manually, use `npx expo prebuild --clean` to regenerate
5. **Watchman needs many dependencies** — it's built on Meta's C++ infrastructure (Folly, Thrift, etc.)

---

## Phase 2: Foundation
**Date**: 2026-06-21
**Status**: ✅ Complete

---

### 2.1 Dependencies Added

| Package | Version | Purpose |
|---------|---------|---------|
| `@tanstack/react-query` | Latest | Data fetching, caching, background refresh |
| `@react-navigation/native` | Latest | Navigation framework |
| `@react-navigation/bottom-tabs` | Latest | Bottom tab navigator |
| `react-native-screens` | SDK 56 | Native screen containers (performance) |
| `react-native-safe-area-context` | SDK 56 | Safe area insets (notch, home indicator) |
| `react-native-reanimated` | SDK 56 | Smooth animations |

### 2.2 Project Structure Created

```
src/
├── api/
│   ├── index.ts          # Barrel export
│   ├── espn.ts           # ESPN API client (fetch wrapper)
│   ├── endpoints.ts      # URL builders for all endpoints
│   └── types.ts          # Full TypeScript types for API responses
├── hooks/
│   ├── index.ts
│   ├── useScoreboard.ts  # Fetch & parse scoreboard data
│   └── useStandings.ts   # Fetch & parse standings data
├── screens/
│   ├── index.ts
│   ├── ScoresScreen.tsx  # Main scores tab (multi-league)
│   └── StandingsScreen.tsx # Standings with league picker
├── components/
│   ├── index.ts
│   ├── MatchCard.tsx     # Single match row (home vs away)
│   └── StandingsTable.tsx # Full league table component
├── constants/
│   ├── index.ts
│   ├── colors.ts         # Dark theme color palette
│   └── leagues.ts        # Full registry of 150+ leagues
├── navigation/
│   └── index.tsx         # Tab navigator with dark theme
├── hooks/
├── stores/
└── utils/
```

### 2.3 ESPN API Client

- Base client with error handling in `src/api/espn.ts`
- Two base URLs:
  - `site.api.espn.com` — scoreboard, match summary
  - `site.web.api.espn.com` — standings (the only one that works for standings)
- Endpoints support optional params: `?dates=YYYYMMDD`, `?season=YEAR`
- TanStack Query handles caching:
  - Live matches: refetch every 30s
  - Recent matches: refetch every 5 min
  - Standings: refetch every 4 hours
  - Historical seasons: cache indefinitely

### 2.4 League Registry

- **120+ leagues** registered in `src/constants/leagues.ts`
- Each league has: slug, name, shortName, region, country, hasStandings, tier
- Helper functions: `getLeagueBySlug()`, `getLeaguesByRegion()`, `getTopLeagues()`
- 13 default leagues on scoreboard home screen (top European + Americas + Saudi)
- Organized by 12 regions (fifa, europe, europe-women, usa-canada, mexico, concacaf, south-america, asia, oceania, africa, wcq, other)

### 2.5 Screens Built

#### Scores Screen
- Fetches scoreboard for all 13 default leagues in parallel
- Groups matches by league with collapsible sections
- Shows match count per league
- Pull-to-refresh support
- Loading, error, and empty states
- Live matches highlighted in red

#### Standings Screen
- Horizontal league picker (top-tier leagues with standings)
- Full table: #, Team, GP, W, D, L, GD, Pts
- Zone indicators (colored bars for UCL/UEL/relegation)
- Positive GD in green, negative in red
- Pull-to-refresh support

### 2.6 Dark Theme

- AMOLED-friendly dark background (#0F0F0F)
- Surface cards (#1A1A1A)
- Green accent for primary actions
- Red for live indicators
- Consistent color system in `src/constants/colors.ts`

### 2.7 Navigation

- Bottom tab navigator (Scores | Standings)
- Dark theme applied globally via NavigationContainer
- Consistent header styling

### 2.8 Build Verification

- TypeScript: `npx tsc --noEmit` — **0 errors**
- Metro bundle: 693 modules bundled in 5.8s
- App running in iPhone 17 Pro Simulator via development build

---
---

## Phase 2.1: Bug Fixes
**Date**: 2026-06-21
**Status**: ✅ Complete

---

### Fix 1: Multi-Group Standings + Sort Order
- **Problem**: Standings only showed first group (`data.children?.[0]`). Multi-group tournaments like World Cup were incomplete. Also, team order was wrong — API returns entries unsorted, position was assigned by array index.
- **Solution**: Refactored `useStandings` hook to parse ALL groups from `data.children[]`. Sort entries by `rank` stat from API (not array order). Added `ParsedStandingsGroup` type. `StandingsScreen` now renders each group with its own header.
- **Files Changed**: `src/api/types.ts`, `src/hooks/useStandings.ts`, `src/screens/StandingsScreen.tsx`

### Fix 2: Season Display Label
- **Problem**: No indication of which season the standings were for.
- **Solution**: Extract `seasonDisplayName` from the API response and render it as a centered label above the standings table.
- **Files Changed**: `src/screens/StandingsScreen.tsx`

### Fix 3: Match Sorting & Live Priority
- **Problem**: Matches in ScoresScreen were unsorted. Live matches weren't prioritized.
- **Solution**: Sort matches within each league (live first, then by date). Sort league sections so leagues with live matches appear at the top.
- **Files Changed**: `src/screens/ScoresScreen.tsx`

### Fix 4: Bracket / Knockout Display
- **Problem**: Tournaments with knockouts (World Cup, Champions League) only showed group standings. No way to see bracket matches.
- **Solution**: Added `useTournamentCalendar` hook that fetches calendar entries from the scoreboard endpoint. Added `useBracket` hook that fetches matches for each knockout round by date range. Created `BracketView` component showing round headers with match cards (scores, team logos, status). `StandingsScreen` now shows a Groups/Bracket toggle when knockout rounds are available.
- **New Files**: `src/hooks/useBracket.ts`, `src/components/BracketView.tsx`
- **Modified**: `src/api/endpoints.ts`, `src/api/espn.ts`, `src/api/types.ts`, `src/screens/StandingsScreen.tsx`, `src/hooks/index.ts`, `src/components/index.ts`

---

## Next: Phase 3 — Core Experience
- Date navigation (swipeable date picker)
- Match detail screen
- All leagues browsable by region
- Season picker for standings
- Search functionality

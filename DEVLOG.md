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

---

## Phase 4: Polish & Enhancements
**Date**: 2026-06-22
**Status**: ✅ Complete

---

### 4.1 Live Auto-Refresh

- **What**: Automatic 30-second polling when live matches are on screen
- **How**: TanStack Query `refetchInterval` callback — only activates when viewing today AND data contains live matches (`state === 'in'`)
- **File**: `src/screens/ScoresScreen.tsx`
- **Benefit**: Scores update automatically without manual pull-to-refresh during live games

### 4.2 Favorites System

- **What**: Star leagues to pin them at the top of the scores feed
- **How**: React Context + AsyncStorage for persistence
- **Package**: `@react-native-async-storage/async-storage`
- **Files**:
  - `src/stores/FavoritesContext.tsx` — context provider with `toggleFavoriteLeague`, `toggleFavoriteTeam`, persistence
  - `src/stores/index.ts` — barrel export
  - `App.tsx` — wrapped with `<FavoritesProvider>`
  - `src/screens/SearchScreen.tsx` — star toggle per league, favorites sorted first
  - `src/screens/ScoresScreen.tsx` — favorite leagues pinned at top, then live, then rest

### 4.3 App Branding & Configuration

- **What**: Dark splash screen, proper bundle ID, dark UI style
- **File**: `app.json`
- **Changes**:
  - `userInterfaceStyle` → `"dark"`
  - Splash: dark background `#0F0F0F`, uses `splash-icon.png`
  - iOS bundle: `com.waseemscores.app`
  - Android package: `com.waseemscores.app`
  - Adaptive icon background → `#0F0F0F`

### 4.4 Animations

- **What**: Skeleton loading states + pulsing live indicator
- **Package**: `expo-linear-gradient` (installed for future shimmer use)
- **Files**:
  - `src/components/Skeletons.tsx` — `ScoresSkeleton` and `StandingsSkeleton` with animated shimmer bars
  - `src/components/MatchCard.tsx` — `LiveDot` component with pulsing opacity animation
- **Benefit**: App feels responsive during data loads; live matches have an eye-catching pulse

### 4.5 Notes

- All four features pass `npx tsc --noEmit` with 0 errors
- Native rebuild needed: `npx expo prebuild --clean && npx expo run:ios` (AsyncStorage + expo-linear-gradient are native modules)

---

## Phase 5: Advanced Features
**Date**: 2026-06-21
**Status**: ✅ Complete

### 5.1 Team Detail Screen
- **File**: `src/screens/TeamDetailScreen.tsx`
- Shows team logo, name, standing summary, record
- Favorite toggle (star) for the team
- Next match card with tap-to-navigate
- Recent/upcoming fixtures list (up to 10)
- API: `ESPN_BASE/{slug}/teams/{teamId}` + `ESPN_BASE/{slug}/teams/{teamId}/schedule`

### 5.2 Head-to-Head Stats
- Added H2H section to `MatchDetailScreen`
- Shows last 5 previous meetings between the two teams
- Data sourced from `headToHeadGames` or `headToHead` field in match summary response
- Shows date, team abbreviations, and final score

### 5.3 Top Scorers & Assists
- **File**: `src/screens/TopScorersScreen.tsx`
- New "Stats" tab in bottom navigation
- League picker (horizontal scroll, all 22 leagues)
- Toggle between Goals and Assists leaders
- Table with rank, player name, team badge, APP/G/A stats
- API: `ESPN_BASE/{slug}/statistics?season={YEAR}`
- Response structure: `stats[0]` = goalsLeaders, `stats[1]` = assistsLeaders

### 5.4 Push Notifications
- Installed: `expo-notifications`, `expo-device`, `expo-constants`
- **Service**: `src/services/notifications.ts`
  - Registers for push permissions on app launch
  - Android notification channel "goals" with high importance
  - Helper functions: `sendLocalGoalNotification`, `sendMatchStartNotification`
- **Hook**: `src/hooks/useGoalNotifications.ts`
  - Monitors live matches on ScoresScreen
  - Compares score snapshots between refreshes
  - Fires local notification when a favorite team scores

### 5.5 News Feed
- **File**: `src/screens/NewsScreen.tsx`
- New "News" tab in bottom navigation
- League picker for filtering
- Article cards with image, headline, date, description
- Tapping an article opens the ESPN link via `Linking.openURL`
- API: `ESPN_BASE/{slug}/news`

### 5.6 Team Tappability (MatchCard)
- Updated `src/components/MatchCard.tsx`
- Team names/logos are now individually tappable
- Navigates to TeamDetail with teamId, slug, teamName

### 5.7 Navigation Updates
- `ScoresStackParamList` now includes `TeamDetail` route
- Bottom tabs: Scores | Standings | Leagues | Stats | News
- All new screens use dark AMOLED theme

### 5.8 API Additions (`src/api/endpoints.ts`)
- `teamInfo(slug, teamId)` — Team info endpoint
- `teamSchedule(slug, teamId)` — Team schedule endpoint
- `leagueStatistics(slug, season?)` — League top scorers/assists
- `news(slug)` — League news articles

### 5.9 Notes
- All features pass `npx tsc --noEmit` with 0 errors
- Native rebuild required: `npx expo prebuild --clean && npx expo run:ios` (expo-notifications, expo-device, expo-constants are native modules)
- H2H data availability depends on ESPN including it in the match summary response (not all matches have it)

---

## Phase 4 — Core Experience Gaps (2026-06-22)

### 4.1 Swipeable Date Navigation
- **File**: `src/screens/ScoresScreen.tsx`
- Added `react-native-gesture-handler` dependency
- Wrapped app in `GestureHandlerRootView` (`App.tsx`)
- Pan gesture on scores content: swipe right = previous day, swipe left = next day
- Threshold: 80px translation to trigger, with `activeOffsetX` and `failOffsetY` to avoid conflicts with vertical scrolling
- Date picker auto-scrolls to selected date

### 4.2 Leagues Browsable by Region (League Hub)
- **File**: `src/screens/SearchScreen.tsx`
- Converted from `FlatList` to `SectionList` with sticky section headers
- Sections: ⭐ Favorites, 🌍 FIFA/Global, 🇪🇺 Europe, 🌐 Other
- When searching, shows flat filtered results
- Tier 1 leagues get a green "Top" badge
- Tapping a league navigates to Standings tab with that league pre-selected
- Added `›` chevron indicator for tap affordance

### 4.3 Zone Colors & Relegation Bands
- **File**: `src/components/StandingsTable.tsx`
- Zone color bars already worked via ESPN `entry.note.color` field
- Added zone legend at the bottom of the table (auto-generated from unique notes)
- Consistent spacing with `zoneBarSpacer` when no zone indicator present

### 4.4 League Tap → Standings Navigation
- **File**: `src/screens/StandingsScreen.tsx`
- Accepts `leagueSlug` route param via `useRoute`
- `useEffect` auto-selects the matching league when navigated from Leagues tab

### 4.5 Stats Screen Fix (TopScorers)
- **File**: `src/screens/TopScorersScreen.tsx`
- ESPN returns `shortDisplayValue: "M: 38, G: 29: A: 18"`, not a `statistics` array
- Fixed parsing with regex: `/M:\s*(\d+)/`, `/G:\s*(\d+)/`, `/A:\s*(\d+)/`
- Appearances, Goals, Assists now display correctly

### 4.6 Removed Features
- **Home/Away table views**: ESPN standings API does not provide home/away splits
- **Form guide (W/D/L dots)**: ESPN standings API has no form data; scoreboard has `competitor.form` but only for teams with matches on that day — insufficient for full table

---

## Phase 5 — Personalization & Profiles (2026-06-22)

### 5.1 My Scores & Live Filters
- **File**: `src/screens/ScoresScreen.tsx`
- Added filter chips: All | ★ My Scores | ● Live
- "My Scores" shows matches from favorite leagues + matches involving favorite teams
- "Live" shows only in-progress matches
- Contextual empty states per filter
- Settings gear icon in Scores header → navigates to Settings

### 5.2 Settings Screen
- **File**: `src/screens/SettingsScreen.tsx`
- Time format toggle (12h/24h)
- Spoiler mode toggle
- Notification toggles: master, goal alerts, match start alerts
- Expandable favorites management: tap to reveal list, "Remove" button per item
- About section (version, data source)

### 5.3 Full Team Profile
- **File**: `src/screens/TeamDetailScreen.tsx`
- Three-tab layout: Overview | Squad | Fixtures
- Overview: season stats grid (Played/W/D/L/GF/GA), next match, coach info
- Squad: roster grouped by position (GK/DEF/MID/FWD), player photo, jersey, nationality, age
- Fixtures: expanded to 20 matches, tappable to match detail
- Roster fetches without season first, falls back to season=2024 if empty
- Each player row tappable → navigates to PlayerProfile

### 5.4 Player Profile Screen
- **File**: `src/screens/PlayerProfileScreen.tsx`
- ESPN APIs: `athletes/{id}` (bio) + `athletes/{id}/overview` (stats, game log)
- Headshot from ESPN CDN pattern
- Bio card: age, height, weight, nationality, birthplace
- Season stats table with per-competition splits (labels: STRT/FC/FA/YC/RC/G/A/SHOT/SOG)
- Recent game log with goals and assists per match

### 5.5 Onboarding Flow
- **File**: `src/screens/OnboardingScreen.tsx`
- Two-step flow: Pick Leagues → Pick Teams
- 16 popular teams pre-configured (EPL, La Liga, Bundesliga, Serie A, Ligue 1)
- Uses `SafeAreaView` from `react-native-safe-area-context`
- Skip option available; completion stored via MMKV
- Shows on first launch only, controlled by `SettingsContext.onboardingComplete`

### 5.6 MMKV Storage Migration
- **New dep**: `react-native-mmkv` (native module, required rebuild)
- **File**: `src/stores/storage.ts` — storage abstraction with `mmkvStorage` helpers
- One-time migration from AsyncStorage on app startup (`migrateFromAsyncStorage`)
- `FavoritesContext` and `SettingsContext` now use synchronous MMKV reads (no loading flash)
- Storage instance ID: `waseem-scores`

### 5.7 Navigation Updates
- `ScoresStackParamList` expanded: `PlayerProfile`, `Settings` routes added
- Onboarding shown before main navigator when `onboardingComplete === false`
- `SettingsProvider` wraps app in `App.tsx`

### 5.8 API Additions
- `teamRoster(slug, teamId, season?)` — Team roster endpoint
- `athleteOverview(slug, athleteId)` — Player stats/game log
- `athleteInfo(slug, athleteId)` — Player bio/team info

### 5.9 Notes
- All features pass `npx tsc --noEmit` with 0 errors
- Native rebuild required for MMKV: `npx expo prebuild --clean && npx expo run:ios`


# WaseemScores — Project Plan

## Vision
A full-featured soccer scores app (like 365Scores) covering **150+ leagues** from the ESPN API, with live scores, standings, match details, lineups, and multi-season support.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | **React Native + Expo** | Cross-platform (iOS + Android), fast dev cycle |
| Navigation | React Navigation v7 | Tab + stack navigation |
| State Management | Zustand | Lightweight, performant |
| Data Fetching | TanStack Query (React Query) | Caching, background refresh, stale-while-revalidate |
| Storage | MMKV | Fast local storage for favorites, settings |
| UI Components | Custom + React Native Reanimated | Smooth animations, custom design |
| Icons | Phosphor Icons | Modern, consistent |
| Notifications | Expo Notifications | Match alerts, goal alerts |

---

## Core Features

### 1. Live Scores & Scoreboard
- Real-time match scores (polling every 30s during live games)
- Match status: scheduled, live, halftime, full-time, postponed, cancelled
- Group by league with collapsible sections
- Filter by date (today, yesterday, tomorrow, custom date picker)
- "Following" tab showing only favorite teams/leagues
- "Live" tab showing only in-progress matches
- Minute indicator with pulsing animation for live matches
- Score flash animation on goal
- Swipe between days (gesture navigation)
- Match countdown timer for upcoming games

### 2. Standings
- Full league table with all stats (GP, W, D, L, GF, GA, GD, Pts)
- Qualification zone indicators (UCL, UEL, UECL, relegation) with color bands
- Season selector (all 25 available seasons)
- Auto-switch to new season when available
- Form guide (last 5 matches as W/D/L dots)
- Home & Away tables (separate views)
- Points progression chart over the season
- Sort by any column (tap header)
- Team comparison overlay (select 2 teams to compare side-by-side)
- Promotion/relegation playoff indicators

### 3. Match Details
- Score & match events timeline (goals, cards, subs — minute by minute)
- Lineups & formations (visual pitch layout)
- Player ratings (if available)
- Match statistics (possession, shots, shots on target, corners, fouls, offsides)
- Head-to-head history (last 10 meetings)
- Venue info with capacity
- Broadcast info (where to watch)
- Pre-match: probable lineups, team form, key stats
- Post-match: full stats summary, standout performers
- Referee info
- Weather conditions (for outdoor venues)

### 4. League Hub
- All 150+ leagues organized by region
- League info, logo, current season
- Top scorers table
- Top assists table
- Clean sheets leaders
- Fixtures & results calendar
- League news/headlines (if available from API)
- Historical winners

### 5. Team Profile
- Full squad roster with player photos
- Team stats (goals scored/conceded, form, avg possession)
- Upcoming fixtures
- Recent results
- Transfer history (if available)
- Home/away record
- Season-by-season history
- Team badge & colors

### 6. Player Profile
- Player bio (age, nationality, position, shirt number)
- Season stats (goals, assists, cards, minutes played)
- Career history / clubs
- Player photo
- Current form

### 7. Favorites & Personalization
- Follow unlimited teams and leagues
- Personalized "My Scores" feed (priority-sorted)
- Custom notification per team (goals, kickoff, halftime, fulltime, red cards)
- Pin leagues to top of scoreboard
- Reorder favorite leagues
- Quick-switch between followed leagues
- Onboarding flow: pick your teams & leagues on first launch

### 8. Calendar & Fixtures
- Full season fixture list per league
- Monthly calendar view with match dots
- Fixture countdown for next match of followed teams
- Add match to device calendar (one tap)

### 9. Notifications & Alerts
- Goal alerts (instant)
- Match start / halftime / fulltime
- Red card alerts
- Lineup announced
- Result summary (post-match)
- Table change alerts ("Your team moved to 3rd!")
- Configurable per team / per league / global

### 10. Match Timeline & Commentary
- Minute-by-minute event feed
- Goal details (scorer + assist)
- Substitutions with in/out
- Cards with reason
- VAR decisions
- Penalties (scored/missed)

### 11. Comparison Tools
- Compare any 2 teams (stats side-by-side)
- Compare standings across seasons
- Head-to-head record finder

### 12. Search & Discovery
- Global search (teams, leagues, players)
- Quick access to any competition
- Trending matches (most followed live games)
- "Explore" section with featured leagues by region

### 13. Widgets (iOS & Android)
- Home screen widget showing live scores of followed teams
- Lock screen widget (iOS) with next match countdown
- Small / medium / large widget sizes

### 14. Share & Social
- Share match result as image card (score + teams + badges)
- Share standings snapshot
- Copy match link
- Share to WhatsApp / Instagram Stories / Twitter

### 15. Statistics & Analytics
- League-wide stats (top scorers, most assists, most cards)
- Team season progression (points over time graph)
- Goals per matchday chart
- Clean sheet tracker
- Unbeaten run tracker
- Biggest wins/losses of the season

### 16. Multi-Language & Accessibility
- RTL support (Arabic)
- Dynamic font sizing
- VoiceOver / TalkBack accessibility
- Localized team names where available

### 17. Offline Mode
- Full offline access to last-fetched data
- Graceful handling of no connectivity
- Auto-sync when back online
- Clear indicator when showing cached data

### 18. Settings
- Theme (dark / light / system / AMOLED black)
- Notification preferences (granular per team)
- Default home screen tab
- Default leagues on scoreboard
- Time format (12h / 24h)
- Spoiler mode (hide scores until you tap)
- Data saver mode (reduce polling frequency)

---

## API Endpoints Used

| Feature | Endpoint |
|---------|----------|
| Scores/Fixtures | `https://site.api.espn.com/apis/site/v2/sports/soccer/{SLUG}/scoreboard` |
| Standings | `https://site.web.api.espn.com/apis/v2/sports/soccer/{SLUG}/standings` |
| Standings (season) | `.../{SLUG}/standings?season={YEAR}` |
| Match Details | `https://site.api.espn.com/apis/site/v2/sports/soccer/{SLUG}/summary?event={GAME_ID}` |
| League Discovery | `https://site.api.espn.com/apis/site/v2/leagues/dropdown?sport=soccer&limit=200` |

---

## Data Architecture

```
src/
├── api/
│   ├── espn.ts              # Base API client
│   ├── endpoints.ts         # All endpoint builders
│   ├── types.ts             # TypeScript types for API responses
│   └── leagues.ts           # Full league registry (slug, name, region, hasStandings)
├── hooks/
│   ├── useScoreboard.ts     # Fetch & cache scoreboard
│   ├── useStandings.ts      # Fetch & cache standings
│   ├── useMatchDetails.ts   # Fetch match summary
│   ├── useSeasons.ts        # Available seasons for a league
│   └── useFavorites.ts      # Manage favorite teams/leagues
├── stores/
│   ├── favoritesStore.ts    # Persisted favorites
│   ├── settingsStore.ts     # App settings
│   └── filtersStore.ts      # Active date/league filters
├── screens/
│   ├── ScoresScreen.tsx     # Main scores tab
│   ├── StandingsScreen.tsx  # Standings tab
│   ├── MatchScreen.tsx      # Match detail page
│   ├── LeaguesScreen.tsx    # Browse all leagues
│   ├── LeagueScreen.tsx     # Single league hub
│   ├── SearchScreen.tsx     # Search
│   └── SettingsScreen.tsx   # Settings
├── components/
│   ├── MatchCard.tsx        # Single match row
│   ├── StandingsTable.tsx   # Standings table component
│   ├── LeagueSection.tsx    # Collapsible league group
│   ├── DatePicker.tsx       # Horizontal date scroller
│   ├── SeasonPicker.tsx     # Season dropdown
│   ├── TeamBadge.tsx        # Team logo + name
│   └── LiveIndicator.tsx    # Pulsing live dot
├── constants/
│   ├── leagues.ts           # All league definitions
│   └── colors.ts            # Theme colors
├── navigation/
│   └── index.tsx            # Tab + stack navigator
└── utils/
    ├── formatting.ts        # Date, score formatting
    └── polling.ts           # Smart polling logic
```

---

## League Registry Structure

```typescript
interface League {
  slug: string;           // e.g. "esp.1"
  name: string;           // e.g. "Spanish LALIGA"
  shortName: string;      // e.g. "La Liga"
  region: Region;         // e.g. "europe"
  country?: string;       // e.g. "Spain"
  hasStandings: boolean;  // from API doc
  tier: number;           // 1 = top priority, 2 = secondary, 3 = niche
  logoUrl?: string;       // league logo if available
}

type Region =
  | "fifa"
  | "europe"
  | "europe-women"
  | "usa-canada"
  | "mexico"
  | "concacaf"
  | "south-america"
  | "asia"
  | "oceania"
  | "africa"
  | "wcq"
  | "other";
```

---

## Season Handling Strategy

1. **On app launch**: Fetch standings without `?season=` param → returns current/latest season
2. **Season picker**: Offer all available seasons from `data.seasons[]` array
3. **New season detection**: If API returns a new season year that's newer than cached, auto-switch and notify user
4. **Caching**: Cache standings per league+season combo, refresh every 4 hours (or 5 min during matchdays)

---

## Development Phases

### Phase 1 — Workspace & Environment Setup (Day 1)

**Goal**: Get an empty "Hello World" app running on both the iOS Simulator and your physical iPhone.

#### Prerequisites to Install (all FREE)

| Tool | How to Install | Why |
|------|---------------|-----|
| **Xcode** | Mac App Store (search "Xcode") | iOS Simulator + build tools |
| **Xcode Command Line Tools** | `xcode-select --install` | Compiler toolchain |
| **Node.js (v20+)** | `brew install node` or [nodejs.org](https://nodejs.org) | JavaScript runtime |
| **Watchman** | `brew install watchman` | Fast file watcher for hot reload |
| **CocoaPods** | `sudo gem install cocoapods` | iOS dependency manager |
| **Expo Go app** | App Store on iPhone | Run dev builds on device |

#### Setup Steps

```bash
# 1. Verify prerequisites
node --version        # Should be v20+
npm --version         # Should be v10+
xcode-select -p       # Should show Xcode path
watchman --version    # Should show version

# 2. Create the Expo project
npx create-expo-app WaseemScores --template blank-typescript
cd WaseemScores

# 3. Install core dependencies
npx expo install react-native-reanimated react-native-gesture-handler \
  react-native-screens react-native-safe-area-context \
  @react-navigation/native @react-navigation/bottom-tabs

# 4. Test on iOS Simulator (opens automatically)
npx expo run:ios

# 5. Test on physical iPhone via Expo Go
npx expo start
# → Open Expo Go app on iPhone → scan the QR code in terminal

# 6. Test on physical iPhone via USB (no WiFi needed)
npx expo run:ios --device
# → Select your device from the list
```

#### Xcode Simulator Setup
```bash
# Open Xcode → Settings → Platforms → download iOS 18 Simulator
# Or from terminal:
xcodebuild -downloadPlatform iOS

# List available simulators
xcrun simctl list devices available

# The default is usually iPhone 16 Pro — Expo picks it automatically
```

#### iPhone Setup for Development
1. Connect iPhone to Mac via USB
2. On iPhone: **Settings → Privacy & Security → Developer Mode → ON** (restart required)
3. On Mac: Open Xcode → **Window → Devices and Simulators** → verify device appears
4. Trust the Mac on your iPhone when prompted
5. In Xcode: **Settings → Accounts** → sign in with your Apple ID (free, no paid developer account needed)

#### Verify Everything Works Checklist
- [ ] `node --version` returns v20+
- [ ] Xcode installed and opens without errors
- [ ] iOS Simulator launches (run any simulator from Xcode → Open Developer Tool → Simulator)
- [ ] `npx expo run:ios` builds and shows app in Simulator
- [ ] iPhone connected, Developer Mode enabled, trusted
- [ ] `npx expo start` → scan QR → app opens on iPhone via Expo Go
- [ ] Hot reload works (edit App.tsx, save, see change instantly on both)

#### Troubleshooting
| Problem | Fix |
|---------|-----|
| "No simulators found" | Open Xcode → Settings → Platforms → install iOS runtime |
| Build fails with CocoaPods error | `cd ios && pod install --repo-update` |
| iPhone not recognized | Try different USB cable, restart iPhone |
| Expo Go "Network error" | Make sure Mac and iPhone are on same WiFi |
| "Developer Mode required" | iPhone Settings → Privacy & Security → Developer Mode → ON |
| "Untrusted Developer" on iPhone | Settings → General → VPN & Device Management → Trust |

> **Once you see the blank app running on both Simulator AND iPhone, Phase 1 is complete.**

---

### Phase 2 — Foundation ✅ DONE
- [x] Project setup (Expo SDK 56, TypeScript, React Navigation v7)
- [x] ESPN API client with TanStack Query
- [x] League registry (22 leagues — not full 150+ yet)
- [x] Type definitions for API responses
- [x] Basic scoreboard screen (today's matches grouped by league)
- [x] Basic standings screen (single league table)
- [x] Dark AMOLED theme as default

### Phase 3 — Completed Features ✅ DONE
> All items below were implemented across the original phases 3–7.

**Core Experience:**
- [x] Date navigation (horizontal date picker)
- [x] Match detail screen (events, stats, lineups, H2H)
- [x] Standings with season picker (all 25 seasons)
- [x] Search functionality (leagues)

**Personalization:**
- [x] Favorites system (follow teams + leagues)
- [x] Pin favorite leagues to top of scoreboard
- [x] Team profile screen (basic — fixtures, standing, next match)

**Polish & Live Experience:**
- [x] Smart polling (30s for live matches)
- [x] Live match indicators & pulsing dot animation
- [x] Match timeline (key events — goals, cards, subs)
- [x] Pull-to-refresh
- [x] Loading skeletons (shimmer effect)

**Statistics:**
- [x] League top scorers & assists tables (with league picker)
- [x] Head-to-head history (in match detail screen)

**Notifications:**
- [x] Local notifications setup (expo-notifications)
- [x] Goal alerts for followed teams (local, score comparison)

**News:**
- [x] League news screen with article cards

---

### Phase 4 — Core Experience Gaps
- [ ] Swipeable gesture date navigation (swipe between days)
- [ ] All leagues browsable by region (league hub page)
- [ ] Qualification zone colors & relegation bands in standings
- [ ] Home/Away table views in standings
- [ ] Form guide (last 5 matches as W/D/L dots)

### Phase 5 — Personalization & Profiles
- [ ] "My Scores" personalized tab (only favorites)
- [ ] "Live" tab (only in-progress matches)
- [ ] Onboarding flow (pick your teams on first launch)
- [ ] Player profile screen (bio, stats, career)
- [ ] Full settings screen (theme, notifications, time format, spoiler mode)
- [ ] Persistent storage migration (AsyncStorage → MMKV)
- [ ] Full team profile (squad roster, player photos, team stats, transfer history)

### Phase 6 — Polish & Animations
- [ ] Score flash animation on goal
- [ ] Lineups visual pitch layout (formation view)
- [ ] Spoiler mode (hide scores until tap)
- [ ] Comprehensive empty states & error handling
- [ ] Match countdown timer for upcoming games

### Phase 7 — Statistics & Comparison
- [ ] Points progression chart (line graph over season)
- [ ] Team comparison tool (side-by-side stats)
- [ ] Clean sheet / unbeaten run trackers
- [ ] Season stats overview per league
- [ ] Sort standings by any column (tap header)
- [ ] Goals per matchday chart

### Phase 8 — Notifications & Alerts
- [ ] Match start / halftime / fulltime alerts
- [ ] Red card alerts
- [ ] Table position change alerts ("Your team moved to 3rd!")
- [ ] Granular notification settings per team
- [ ] Calendar integration (add match to device calendar)
- [ ] Lineup announced alert

### Phase 9 — Sharing & Widgets
- [ ] Share match result as image card
- [ ] Share standings snapshot
- [ ] iOS home screen widget (live scores)
- [ ] Android widget
- [ ] Lock screen widget (next match countdown)

### Phase 10 — Final Polish
- [ ] Offline mode (full cached data access)
- [ ] RTL support (Arabic)
- [ ] Accessibility (VoiceOver/TalkBack)
- [ ] Performance optimization (large lists, memory)
- [ ] App icon & splash screen (final design)
- [ ] Data saver mode (reduce polling frequency)
- [ ] Comprehensive testing on physical iPhone
- [ ] Edge cases & bug fixes

---

### Deferred (not planned for the moment)
- Full league registry (expand from 22 to 150+ leagues)

---

## Polling Strategy

| Match State | Refresh Interval |
|-------------|-----------------|
| Live (in play) | Every 30 seconds |
| Today's matches (pre/post) | Every 5 minutes |
| Standings (matchday) | Every 5 minutes |
| Standings (no matches) | Every 4 hours |
| Historical season | Cache indefinitely |

---

## Design Principles

1. **Speed first** — Cached data shown instantly, fresh data loads in background
2. **Minimal taps** — Most info visible without drilling down
3. **Glanceable** — Bold scores, clear status indicators
4. **Dark mode default** — Easy on eyes for evening match-watching
5. **Offline-capable** — Last fetched data always available

---

## Immediate Next Steps

1. Initialize Expo project with TypeScript
2. Build the ESPN API client & types
3. Create the full league registry from the API doc
4. Implement scoreboard screen with today's matches
5. Implement standings screen with season picker

---

## Notes

- ESPN API is public, no key required
- Be respectful with rate limiting (no hard cap documented)
- Team logos available at: `https://a.espncdn.com/i/teamlogos/soccer/500/{TEAM_ID}.png`
- All data includes: scores, lineups, player stats, team stats, odds, broadcasts, venues

---

## Local Development & Testing (100% FREE)

Everything below costs $0. No paid accounts needed until you decide to publish to stores.

### macOS (Primary Dev Machine)
```bash
# Install dependencies
npm install

# Option 1: iOS Simulator (FREE — requires Xcode from Mac App Store)
npx expo run:ios

# Option 2: Android Emulator (FREE — requires Android Studio)
npx expo run:android

# Option 3: Web browser (FREE — instant, great for layout/logic testing)
npx expo start --web

# Option 4: Physical iOS device via Expo Go (FREE — same WiFi, scan QR)
npx expo start
# Then open Expo Go app on iPhone → scan the QR code

# Option 5: Physical iOS device via USB (FREE — no WiFi needed)
npx expo run:ios --device
```

### Windows
```bash
# Android Emulator (FREE — requires Android Studio)
npx expo run:android

# Web browser (FREE)
npx expo start --web

# Physical device via Expo Go (FREE — scan QR)
npx expo start

# Note: iOS Simulator is NOT available on Windows
# Use your physical iPhone with Expo Go instead
```

### Your Physical iPhone — Testing Options

| Method | Cost | What You Need | Best For |
|--------|------|---------------|----------|
| **Expo Go app** | FREE | Same WiFi as Mac | Quick testing, hot reload |
| **USB direct** (`expo run:ios --device`) | FREE | Lightning/USB-C cable | Testing without WiFi |
| **Development build** (EAS local) | FREE | Xcode on Mac | Testing native modules |

```bash
# Build a dev client directly on your Mac (FREE, no cloud needed)
npx expo run:ios --device

# Or create a local build you install via Xcode
npx expo prebuild --platform ios
cd ios && xcodebuild -workspace WaseemScores.xcworkspace -scheme WaseemScores \
  -destination 'id=YOUR_DEVICE_UDID' -configuration Debug
```

### Free Testing Summary

| Tool | Cost | Platform | Setup |
|------|------|----------|-------|
| Xcode + iOS Simulator | FREE | macOS only | Download from Mac App Store (~12GB) |
| Android Studio + Emulator | FREE | macOS + Windows | Download from developer.android.com |
| Expo Go (physical device) | FREE | iOS + Android | Install app, scan QR code |
| Web browser preview | FREE | Any | Built into Expo, just works |
| USB device testing | FREE | macOS + iPhone | Just plug in the cable |
| Node.js + npm | FREE | Any | Required for all development |

> **Bottom line**: You can develop, test, and perfect the entire app on your Mac + iPhone without spending a single dollar. Store accounts are only needed when you're ready to ship to the public.

---

## Deployment & Publishing (LATER — Only When App Is Perfect)

> **Do NOT pay for any accounts until the app is fully tested and ready.**
> All development and testing is free. These steps are for when you decide to go live.

### Cost Summary for Publishing

| Item | Cost | When Needed |
|------|------|-------------|
| Expo/EAS account | FREE tier (30 builds/month) | Only if using cloud builds |
| Apple Developer Account | $99/year | Only to publish on App Store |
| Google Play Developer | $25 one-time | Only to publish on Play Store |
| Total to go live | ~$124 | Only when ready to ship |
npm install -g eas-cli

# Login to Expo account
eas login

# Create a development build for internal testing
eas build --profile development --platform ios
eas build --profile development --platform android
```

### Preview Builds (Beta Testing)

```bash
# Build for internal distribution (no store needed)
eas build --profile preview --platform ios
eas build --profile preview --platform android

# iOS: Installs via ad-hoc provisioning (up to 100 devices)
# Android: Generates .apk that can be sideloaded
```

### Production Builds & Store Submission

```bash
# Build production iOS (.ipa)
eas build --profile production --platform ios

# Build production Android (.aab)
eas build --profile production --platform android

# Submit to App Store
eas submit --platform ios

# Submit to Google Play
eas submit --platform android
```

### EAS Build Profiles (`eas.json`)

```json
{
  "cli": { "version": ">= 5.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": { "simulator": true }
    },
    "preview": {
      "distribution": "internal",
      "ios": { "resourceClass": "m-medium" }
    },
    "production": {
      "ios": { "resourceClass": "m-medium" },
      "android": { "buildType": "app-bundle" }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@email.com",
        "ascAppId": "APP_STORE_CONNECT_APP_ID",
        "appleTeamId": "TEAM_ID"
      },
      "android": {
        "serviceAccountKeyPath": "./google-services.json",
        "track": "internal"
      }
    }
  }
}
```

### Store Requirements

#### Apple App Store (iOS)
- Apple Developer Account ($99/year)
- App Store Connect setup
- App icons (1024x1024)
- Screenshots for iPhone & iPad
- Privacy policy URL
- App Review (typically 24-48 hours)

#### Google Play Store (Android)
- Google Play Developer Account ($25 one-time)
- Play Console setup
- App icons + feature graphic (1024x500)
- Screenshots for phone & tablet
- Privacy policy URL
- Content rating questionnaire
- Internal testing → Closed testing → Open testing → Production

### OTA Updates (No Store Review Needed)

```bash
# Push JS/asset changes instantly to users (no new binary needed)
eas update --branch production --message "Bug fix for standings"

# Preview an update before pushing to production
eas update --branch preview --message "Testing new feature"
```

- OTA updates work for JS/TypeScript and asset changes only
- Native code changes (new libraries, permissions) require a new store build
- Users get updates silently on next app launch

---

## CI/CD Pipeline (Optional)

```yaml
# GitHub Actions: auto-build on push to main
name: Build & Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform all --non-interactive --profile production
      - run: eas submit --platform all --non-interactive
```

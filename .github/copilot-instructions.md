# Copilot Instructions for WaseemScores

## Project Overview
WaseemScores is a React Native + Expo SDK 56 soccer scores app using the ESPN public API. It covers 150+ leagues with live scores, standings, match details, and more.

## Tech Stack
- React Native 0.85.3 with Expo SDK 56
- TypeScript 6.0
- Node.js v22+ (managed via nvm)
- iOS native builds via `npx expo run:ios`

## Code Style
- Use TypeScript for all files (.ts / .tsx)
- Use functional components with hooks
- Prefer `const` over `let`
- Use arrow functions for components and callbacks
- Use absolute imports where configured
- Keep components small and focused (< 150 lines)

## Project Conventions
- All API calls go in `src/api/`
- Custom hooks in `src/hooks/`
- Screen components in `src/screens/`
- Reusable UI components in `src/components/`
- State stores in `src/stores/`
- Constants and config in `src/constants/`

## ESPN API
- Base endpoints documented in `ESPN-Soccer-Leagues-API.md`
- Standings: `https://site.web.api.espn.com/apis/v2/sports/soccer/{SLUG}/standings`
- Scoreboard: `https://site.api.espn.com/apis/site/v2/sports/soccer/{SLUG}/scoreboard`
- Match details: `https://site.api.espn.com/apis/site/v2/sports/soccer/{SLUG}/summary?event={GAME_ID}`
- No API key required
- Use `?season={YEAR}` for historical seasons (year = start year of season)

## Important Notes
- Never push or commit git changes — user does both themselves
- After completing a migration step, add full details to DEVLOG.md
- Expo SDK 56 docs: https://docs.expo.dev/versions/v56.0.0/
- First iOS build uses `npx expo run:ios` (creates native `ios/` directory)
- Subsequent runs use `npx expo start` then press `i`
- The `ios/` folder is auto-generated — don't manually edit files in it
- Use `npx expo prebuild --clean` if native config changes are needed

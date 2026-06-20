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

## Next: Phase 2 — Foundation
- ESPN API client
- League registry (150+ leagues)
- Basic scoreboard & standings screens

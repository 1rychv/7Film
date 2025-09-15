# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

7Film is an Expo/React Native app that simulates analog film photography with real-time filters and effects. The app provides camera functionality with various film emulation filters (Portra, Tri-X, Kodachrome) and includes a "develop" screen with GL-based halation effects using Three.js.

## Tech Stack

- **Framework**: Expo SDK 54 with React Native 0.81.4
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **3D Graphics**: Three.js with expo-gl for shader effects
- **Camera**: expo-camera with custom filter overlays
- **UI Components**: Custom themed components with light/dark mode support

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Platform-specific launches
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser

# Linting
npm run lint

# Reset project (moves starter code to app-example)
npm run reset-project
```

## Architecture

### File-Based Routing Structure
- `app/_layout.tsx` - Root layout with navigation setup
- `app/(tabs)/_layout.tsx` - Tab navigation container
- `app/(tabs)/camera.tsx` - Main camera screen with filter selection
- `app/develop.tsx` - Film development screen with GL effects
- `app/modal.tsx` - Modal overlay screens

### Component Organization
- `components/themed-*` - Theme-aware UI components
- `components/ParallaxScrollView.tsx` - Scrollable views with parallax headers
- `components/HelloWave.tsx` - Animated components
- `constants/theme.ts` - Color palette and theme definitions
- `hooks/` - Custom React hooks for theme and animations

### Camera & Effects Pipeline
1. **Camera Capture**: Uses expo-camera with configurable flash and facing modes
2. **Filter Preview**: Real-time filter overlay on camera viewfinder
3. **Photo Processing**: Captured images pass through filter transformation
4. **GL Effects**: Three.js shaders apply halation and film grain in develop screen

## Key Configuration

### app.json
- Camera permissions configured for iOS/Android
- Typed routes enabled for better TypeScript support
- React Compiler experimental feature enabled
- Splash screen and app icons configured

### Environment Setup
- Requires camera permissions on device/simulator
- GL context needed for shader effects
- expo-asset for preloading image resources

## Testing on Devices

```bash
# Development build for physical devices
npx expo run:ios     # iOS device
npx expo run:android # Android device

# Expo Go (limited features)
npx expo start --tunnel
```

## Filter Implementation

The app implements film emulation through:
- Color grading matrices for each film stock
- Grain simulation using noise functions
- Halation effects via GL shaders
- Exposure compensation and contrast curves
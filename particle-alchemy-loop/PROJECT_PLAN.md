# PROJECT_PLAN.md - Particle Alchemy Loop

## 1. Project Concept
A physics-based particle sandbox game inspired by "Falling Sand" style games. Players can place different elements (sand, water, stone) and watch them interact according to physics rules. Features include gravity control and touch-based particle placement.

## 2. Current Status
**Phase: Pre-MVP Development - Core Implementation Complete**

The basic game loop with menu screen, gameplay canvas, and particle physics engine has been implemented. Ready for testing and refinement.

## 3. Tech Specification

### Stack
- **Framework:** React Native + Expo SDK 54
- **Language:** TypeScript (strict mode)
- **Routing:** Expo Router (file-based)
- **State Management:** Zustand
- **Rendering:** expo-gl (WebGL)
- **Haptics:** expo-haptics

### Data Models
```typescript
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: ElementType;
  life: number;
  updated: boolean;
}

type ElementType = 'sand' | 'water' | 'stone';
```

### Directory Structure
```
particle-alchemy-loop/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout
│   ├── index.tsx           # Menu screen
│   └── game.tsx            # Gameplay screen
├── src/
│   ├── components/         # UI components
│   │   ├── GlassPanel.tsx
│   │   ├── ElementPalette.tsx
│   │   ├── ControlBar.tsx
│   │   └── ParticleCanvas.tsx
│   ├── game/               # Game logic
│   │   └── ParticleEngine.ts
│   ├── stores/             # Zustand stores
│   │   └── gameStore.ts
│   ├── theme/              # Global theme
│   │   └── index.ts
│   └── types/              # TypeScript types
│       └── index.ts
├── assets/                 # Images & fonts
└── PROJECT_PLAN.md         # This file
```

## 4. Implementation Roadmap

### Phase 1: Project Setup
- [x] Create Expo project with TypeScript template
- [x] Install dependencies (Expo Router, Zustand, expo-gl)
- [x] Configure Expo Router in app.json
- [x] Set up directory structure
- [x] Create theme file with colors, typography, spacing

### Phase 2: Menu Screen
- [x] Create root layout with SafeAreaProvider
- [x] Implement GlassPanel component
- [x] Build menu screen UI matching mockup
- [x] Add navigation to game screen
- [x] Implement level indicator component

### Phase 3: Gameplay UI
- [x] Create ElementPalette component
- [x] Create ControlBar component
- [x] Build game screen layout
- [x] Implement Zustand game store
- [x] Add haptic feedback

### Phase 4: Particle Physics Engine
- [x] Create ParticleEngine class
- [x] Implement spatial grid for collision
- [x] Add sand physics (falling, sliding)
- [x] Add water physics (flowing, spreading)
- [x] Add stone physics (static)
- [x] Implement gravity direction control

### Phase 5: Rendering
- [x] Create ParticleCanvas component
- [x] Set up WebGL context with expo-gl
- [x] Implement vertex/fragment shaders
- [x] Add touch handling with PanResponder
- [x] Implement particle rendering loop

### Phase 6: Testing & Polish (In Progress)
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Performance optimization
- [ ] Bug fixes
- [ ] UI polish

### Phase 7: Future Enhancements (Planned)
- [ ] Add more elements (fire, plant, oil, etc.)
- [ ] Implement sound system
- [ ] Add challenges mode
- [ ] Implement settings screen
- [ ] Add gallery/screenshot feature
- [ ] Implement undo/redo history

## 5. Key Features

### Implemented
- Menu screen with glass morphism design
- Touch-based particle placement
- 3 element types: Sand, Water, Stone
- Real-time physics simulation
- Play/Pause controls
- Speed adjustment (1x, 1.5x, 2x, 4x)
- Reset functionality
- WebGL-accelerated rendering

### Planned
- Gravity rotation (360°)
- Sound feedback
- Screenshot capture
- Challenge puzzles
- Element shop

## 6. Notes
- Pre-MVP focuses on 3 elements only (sand, water, stone)
- Target: 20,000 particles at 60fps
- Design follows iOS-style glass morphism aesthetics
- Color scheme: Dark theme with primary blue (#4396ea)

---
**Last Updated:** 2026-01-21
**Version:** Pre-MVP 0.1.0

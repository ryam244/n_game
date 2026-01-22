// src/stores/gameStore.ts
// Zustand store for game state management

import { create } from 'zustand';
import { ElementType } from '../theme';

interface GameStore {
  // Simulation state
  isPlaying: boolean;
  speed: number;
  particleCount: number;

  // Gravity control
  gravityAngle: number; // In degrees (0 = down, 90 = right, etc.)

  // Element selection
  selectedElement: ElementType;

  // Brush settings
  brushSize: number;

  // Actions
  setIsPlaying: (playing: boolean) => void;
  togglePlaying: () => void;
  setSpeed: (speed: number) => void;
  setParticleCount: (count: number) => void;
  setGravityAngle: (angle: number) => void;
  setSelectedElement: (element: ElementType) => void;
  setBrushSize: (size: number) => void;
  reset: () => void;
}

const initialState = {
  isPlaying: true,
  speed: 1,
  particleCount: 0,
  gravityAngle: 180, // Default: gravity pointing down
  selectedElement: 'sand' as ElementType,
  brushSize: 3,
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),

  setSpeed: (speed) => set({ speed }),

  setParticleCount: (count) => set({ particleCount: count }),

  setGravityAngle: (angle) => {
    // Normalize angle to 0-360
    const normalizedAngle = ((angle % 360) + 360) % 360;
    set({ gravityAngle: normalizedAngle });
  },

  setSelectedElement: (element) => set({ selectedElement: element }),

  setBrushSize: (size) => set({ brushSize: Math.max(1, Math.min(10, size)) }),

  reset: () => set(initialState),
}));

export default useGameStore;

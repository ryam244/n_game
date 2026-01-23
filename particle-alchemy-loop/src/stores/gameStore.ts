// Zustand store for game state
import { create } from 'zustand';
import { ElementType } from '../theme';

interface GameStore {
  isPlaying: boolean;
  speed: number;
  particleCount: number;
  gravityAngle: number;
  selectedElement: ElementType;
  brushSize: number;
  setIsPlaying: (playing: boolean) => void;
  togglePlaying: () => void;
  setSpeed: (speed: number) => void;
  setParticleCount: (count: number) => void;
  setGravityAngle: (angle: number) => void;
  setSelectedElement: (element: ElementType) => void;
  setBrushSize: (size: number) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  isPlaying: true,
  speed: 1,
  particleCount: 0,
  gravityAngle: 180,
  selectedElement: 'sand',
  brushSize: 3,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSpeed: (speed) => set({ speed }),
  setParticleCount: (count) => set({ particleCount: count }),
  setGravityAngle: (angle) => set({ gravityAngle: ((angle % 360) + 360) % 360 }),
  setSelectedElement: (element) => set({ selectedElement: element }),
  setBrushSize: (size) => set({ brushSize: Math.max(1, Math.min(10, size)) }),
}));

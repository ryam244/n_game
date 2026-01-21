// src/types/index.ts
// Particle Alchemy Loop - Type Definitions

import { ElementType } from '../theme';

// Particle structure (optimized for performance)
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: ElementType;
  life: number;
  updated: boolean;
}

// Grid cell for spatial hashing
export interface GridCell {
  particles: number[]; // Indices of particles in this cell
}

// Game state
export interface GameState {
  isPlaying: boolean;
  speed: number;
  particleCount: number;
  gravityAngle: number; // In degrees (0-360)
  selectedElement: ElementType;
  brushSize: number;
}

// Touch/interaction state
export interface TouchState {
  isDrawing: boolean;
  lastX: number;
  lastY: number;
}

// Canvas dimensions
export interface CanvasDimensions {
  width: number;
  height: number;
  gridWidth: number;
  gridHeight: number;
}

// Simulation settings
export interface SimulationSettings {
  gravity: number;
  friction: number;
  maxParticles: number;
  particleSize: number;
}

// Element button props
export interface ElementButtonProps {
  type: ElementType;
  isSelected: boolean;
  onPress: () => void;
}

// Control bar props
export interface ControlBarProps {
  isPlaying: boolean;
  speed: number;
  onPlayPause: () => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
  onUndo: () => void;
  onScreenshot: () => void;
}

// Navigation types
export type RootStackParamList = {
  index: undefined;
  game: undefined;
  settings: undefined;
  challenges: undefined;
  shop: undefined;
};

// User progress
export interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  challengesCompleted: number;
  totalChallenges: number;
}

// Menu item
export interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route: keyof RootStackParamList;
}

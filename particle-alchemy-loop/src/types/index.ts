// Type definitions
import { ElementType } from '../theme';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: ElementType;
  life: number;
  updated: boolean;
}

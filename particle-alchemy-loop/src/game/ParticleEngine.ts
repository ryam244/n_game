// src/game/ParticleEngine.ts
// Particle physics engine for falling sand simulation

import { Particle } from '../types';
import { elementTypes, ElementType, gameConfig } from '../theme';

const { gridSize, gravity, friction, maxParticles } = gameConfig;

export class ParticleEngine {
  private particles: Particle[] = [];
  private grid: (number | null)[][] = [];
  private width: number = 0;
  private height: number = 0;
  private gridWidth: number = 0;
  private gridHeight: number = 0;
  private gravityX: number = 0;
  private gravityY: number = gravity;

  constructor() {
    this.particles = [];
  }

  // Initialize the grid with canvas dimensions
  init(canvasWidth: number, canvasHeight: number) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.gridWidth = Math.floor(canvasWidth / gridSize);
    this.gridHeight = Math.floor(canvasHeight / gridSize);

    // Initialize empty grid
    this.grid = Array(this.gridHeight)
      .fill(null)
      .map(() => Array(this.gridWidth).fill(null));

    this.particles = [];
  }

  // Set gravity direction from angle (0 = up, 180 = down)
  setGravityAngle(angleDegrees: number) {
    const angleRadians = (angleDegrees * Math.PI) / 180;
    this.gravityX = Math.sin(angleRadians) * gravity;
    this.gravityY = Math.cos(angleRadians) * gravity;
  }

  // Add particles at a position
  addParticle(x: number, y: number, type: ElementType, brushSize: number = 1) {
    const gridX = Math.floor(x / gridSize);
    const gridY = Math.floor(y / gridSize);

    // Add particles in a brush pattern
    for (let dy = -brushSize; dy <= brushSize; dy++) {
      for (let dx = -brushSize; dx <= brushSize; dx++) {
        // Circular brush
        if (dx * dx + dy * dy > brushSize * brushSize) continue;

        const px = gridX + dx;
        const py = gridY + dy;

        // Check bounds
        if (px < 0 || px >= this.gridWidth || py < 0 || py >= this.gridHeight) continue;

        // Check if cell is empty and we haven't hit max particles
        if (this.grid[py][px] === null && this.particles.length < maxParticles) {
          // Random offset for natural look
          const particle: Particle = {
            x: px * gridSize + Math.random() * 2 - 1,
            y: py * gridSize + Math.random() * 2 - 1,
            vx: 0,
            vy: 0,
            type,
            life: 255,
            updated: false,
          };

          const index = this.particles.length;
          this.particles.push(particle);
          this.grid[py][px] = index;
        }
      }
    }
  }

  // Update all particles
  update() {
    // Reset updated flags
    for (const particle of this.particles) {
      particle.updated = false;
    }

    // Shuffle update order for fairness (prevents bias)
    const indices = Array.from({ length: this.particles.length }, (_, i) => i);
    this.shuffleArray(indices);

    for (const index of indices) {
      const particle = this.particles[index];
      if (particle.updated) continue;

      switch (particle.type) {
        case 'sand':
          this.updateSand(index);
          break;
        case 'water':
          this.updateWater(index);
          break;
        case 'stone':
          // Stone doesn't move
          particle.updated = true;
          break;
      }
    }
  }

  // Update sand particle - falls down, can slide diagonally
  private updateSand(index: number) {
    const particle = this.particles[index];
    const gridX = Math.floor(particle.x / gridSize);
    const gridY = Math.floor(particle.y / gridSize);

    // Apply gravity
    particle.vx += this.gravityX;
    particle.vy += this.gravityY;

    // Apply friction
    particle.vx *= friction;
    particle.vy *= friction;

    // Calculate new grid position
    const newGridX = Math.floor((particle.x + particle.vx) / gridSize);
    const newGridY = Math.floor((particle.y + particle.vy) / gridSize);

    // Try to move down
    if (this.tryMove(index, gridX, gridY, newGridX, newGridY)) {
      particle.updated = true;
      return;
    }

    // Try to slide diagonally (randomly choose left or right first)
    const dir = Math.random() < 0.5 ? -1 : 1;

    // Try diagonal in primary direction
    if (this.tryMove(index, gridX, gridY, gridX + dir, gridY + 1)) {
      particle.vx = dir * 0.5;
      particle.updated = true;
      return;
    }

    // Try diagonal in opposite direction
    if (this.tryMove(index, gridX, gridY, gridX - dir, gridY + 1)) {
      particle.vx = -dir * 0.5;
      particle.updated = true;
      return;
    }

    // Stuck - reset velocity
    particle.vx = 0;
    particle.vy = 0;
    particle.updated = true;
  }

  // Update water particle - flows more freely than sand
  private updateWater(index: number) {
    const particle = this.particles[index];
    const gridX = Math.floor(particle.x / gridSize);
    const gridY = Math.floor(particle.y / gridSize);

    // Apply gravity
    particle.vx += this.gravityX;
    particle.vy += this.gravityY;

    // Apply less friction for water (more fluid)
    particle.vx *= 0.95;
    particle.vy *= 0.95;

    // Calculate new grid position
    const newGridX = Math.floor((particle.x + particle.vx) / gridSize);
    const newGridY = Math.floor((particle.y + particle.vy) / gridSize);

    // Try to move down
    if (this.tryMove(index, gridX, gridY, newGridX, newGridY)) {
      particle.updated = true;
      return;
    }

    // Try to slide diagonally
    const dir = Math.random() < 0.5 ? -1 : 1;

    if (this.tryMove(index, gridX, gridY, gridX + dir, gridY + 1)) {
      particle.vx = dir * 0.3;
      particle.updated = true;
      return;
    }

    if (this.tryMove(index, gridX, gridY, gridX - dir, gridY + 1)) {
      particle.vx = -dir * 0.3;
      particle.updated = true;
      return;
    }

    // Water spreads horizontally more than sand
    const spreadDir = Math.random() < 0.5 ? -1 : 1;
    const spreadDist = Math.ceil(Math.random() * 3);

    for (let d = 1; d <= spreadDist; d++) {
      if (this.tryMove(index, gridX, gridY, gridX + spreadDir * d, gridY)) {
        particle.vx = spreadDir * 0.5;
        particle.updated = true;
        return;
      }
    }

    // Stuck - reset velocity
    particle.vx = 0;
    particle.vy = 0;
    particle.updated = true;
  }

  // Try to move particle to new position
  private tryMove(
    index: number,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
  ): boolean {
    // Check bounds
    if (toX < 0 || toX >= this.gridWidth || toY < 0 || toY >= this.gridHeight) {
      return false;
    }

    // Check if destination is empty
    const destOccupant = this.grid[toY][toX];
    if (destOccupant !== null) {
      // For water, can swap with sand (water is less dense)
      const particle = this.particles[index];
      if (particle.type === 'water' && destOccupant !== null) {
        const other = this.particles[destOccupant];
        if (other.type === 'sand') {
          // Swap positions
          this.grid[fromY][fromX] = destOccupant;
          this.grid[toY][toX] = index;

          const tempX = particle.x;
          const tempY = particle.y;
          particle.x = other.x;
          particle.y = other.y;
          other.x = tempX;
          other.y = tempY;

          return true;
        }
      }
      return false;
    }

    // Move particle
    const particle = this.particles[index];
    this.grid[fromY][fromX] = null;
    this.grid[toY][toX] = index;
    particle.x = toX * gridSize;
    particle.y = toY * gridSize;

    return true;
  }

  // Get all particles for rendering
  getParticles(): Particle[] {
    return this.particles;
  }

  // Get particle count
  getParticleCount(): number {
    return this.particles.length;
  }

  // Clear all particles
  clear() {
    this.particles = [];
    this.grid = Array(this.gridHeight)
      .fill(null)
      .map(() => Array(this.gridWidth).fill(null));
  }

  // Utility: shuffle array in place
  private shuffleArray(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Get grid dimensions
  getGridDimensions() {
    return {
      width: this.gridWidth,
      height: this.gridHeight,
      cellSize: gridSize,
    };
  }
}

export default ParticleEngine;

// Particle physics engine
import { Particle } from '../types';
import { ElementType, gameConfig } from '../theme';

const { gridSize, gravity, friction, maxParticles } = gameConfig;

export class ParticleEngine {
  private particles: Particle[] = [];
  private grid: (number | null)[][] = [];
  private gridWidth = 0;
  private gridHeight = 0;
  private gravityX = 0;
  private gravityY = gravity;

  init(width: number, height: number) {
    this.gridWidth = Math.floor(width / gridSize);
    this.gridHeight = Math.floor(height / gridSize);
    this.grid = Array(this.gridHeight).fill(null).map(() => Array(this.gridWidth).fill(null));
    this.particles = [];
  }

  setGravityAngle(angleDegrees: number) {
    const rad = (angleDegrees * Math.PI) / 180;
    this.gravityX = Math.sin(rad) * gravity;
    this.gravityY = Math.cos(rad) * gravity;
  }

  addParticle(x: number, y: number, type: ElementType, brushSize: number = 1) {
    const gx = Math.floor(x / gridSize);
    const gy = Math.floor(y / gridSize);

    for (let dy = -brushSize; dy <= brushSize; dy++) {
      for (let dx = -brushSize; dx <= brushSize; dx++) {
        if (dx * dx + dy * dy > brushSize * brushSize) continue;
        const px = gx + dx;
        const py = gy + dy;
        if (px < 0 || px >= this.gridWidth || py < 0 || py >= this.gridHeight) continue;
        if (this.grid[py][px] === null && this.particles.length < maxParticles) {
          const particle: Particle = {
            x: px * gridSize,
            y: py * gridSize,
            vx: 0,
            vy: 0,
            type,
            life: 255,
            updated: false,
          };
          this.particles.push(particle);
          this.grid[py][px] = this.particles.length - 1;
        }
      }
    }
  }

  update() {
    for (const p of this.particles) p.updated = false;

    const indices = [...Array(this.particles.length).keys()];
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    for (const i of indices) {
      const p = this.particles[i];
      if (p.updated) continue;
      if (p.type === 'stone') { p.updated = true; continue; }
      if (p.type === 'sand') this.updateSand(i);
      else if (p.type === 'water') this.updateWater(i);
    }
  }

  private updateSand(i: number) {
    const p = this.particles[i];
    const gx = Math.floor(p.x / gridSize);
    const gy = Math.floor(p.y / gridSize);

    p.vx += this.gravityX;
    p.vy += this.gravityY;
    p.vx *= friction;
    p.vy *= friction;

    if (this.tryMove(i, gx, gy, gx, gy + 1)) { p.updated = true; return; }
    const dir = Math.random() < 0.5 ? -1 : 1;
    if (this.tryMove(i, gx, gy, gx + dir, gy + 1)) { p.vx = dir * 0.5; p.updated = true; return; }
    if (this.tryMove(i, gx, gy, gx - dir, gy + 1)) { p.vx = -dir * 0.5; p.updated = true; return; }
    p.vx = 0; p.vy = 0; p.updated = true;
  }

  private updateWater(i: number) {
    const p = this.particles[i];
    const gx = Math.floor(p.x / gridSize);
    const gy = Math.floor(p.y / gridSize);

    p.vx += this.gravityX;
    p.vy += this.gravityY;
    p.vx *= 0.95;
    p.vy *= 0.95;

    if (this.tryMove(i, gx, gy, gx, gy + 1)) { p.updated = true; return; }
    const dir = Math.random() < 0.5 ? -1 : 1;
    if (this.tryMove(i, gx, gy, gx + dir, gy + 1)) { p.updated = true; return; }
    if (this.tryMove(i, gx, gy, gx - dir, gy + 1)) { p.updated = true; return; }
    for (let d = 1; d <= 3; d++) {
      if (this.tryMove(i, gx, gy, gx + dir * d, gy)) { p.updated = true; return; }
    }
    p.vx = 0; p.vy = 0; p.updated = true;
  }

  private tryMove(i: number, fx: number, fy: number, tx: number, ty: number): boolean {
    if (tx < 0 || tx >= this.gridWidth || ty < 0 || ty >= this.gridHeight) return false;
    if (this.grid[ty][tx] !== null) return false;
    this.grid[fy][fx] = null;
    this.grid[ty][tx] = i;
    this.particles[i].x = tx * gridSize;
    this.particles[i].y = ty * gridSize;
    return true;
  }

  getParticles(): Particle[] { return this.particles; }
  getParticleCount(): number { return this.particles.length; }
  clear() {
    this.particles = [];
    this.grid = Array(this.gridHeight).fill(null).map(() => Array(this.gridWidth).fill(null));
  }
}

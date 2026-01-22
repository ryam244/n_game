// src/components/ParticleCanvas.tsx
// Canvas component for rendering particles

import React, { useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, Dimensions, PanResponder } from 'react-native';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import { colors, elementTypes, gameConfig, ElementType } from '../theme';
import { ParticleEngine } from '../game/ParticleEngine';
import { Particle } from '../types';

interface ParticleCanvasProps {
  width: number;
  height: number;
  isPlaying: boolean;
  speed: number;
  selectedElement: ElementType;
  brushSize: number;
  gravityAngle: number;
  onParticleCountChange: (count: number) => void;
  engineRef: React.MutableRefObject<ParticleEngine | null>;
}

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  width,
  height,
  isPlaying,
  speed,
  selectedElement,
  brushSize,
  gravityAngle,
  onParticleCountChange,
  engineRef,
}) => {
  const glRef = useRef<ExpoWebGLRenderingContext | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const isDrawingRef = useRef<boolean>(false);
  const lastDrawPosRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize the particle engine
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new ParticleEngine();
    }
    engineRef.current.init(width, height);
  }, [width, height, engineRef]);

  // Update gravity when angle changes
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setGravityAngle(gravityAngle);
    }
  }, [gravityAngle, engineRef]);

  // Handle touch/draw
  const handleDraw = useCallback(
    (x: number, y: number) => {
      if (engineRef.current) {
        engineRef.current.addParticle(x, y, selectedElement, brushSize);
        onParticleCountChange(engineRef.current.getParticleCount());
      }
    },
    [selectedElement, brushSize, onParticleCountChange, engineRef]
  );

  // Pan responder for touch handling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        isDrawingRef.current = true;
        const { locationX, locationY } = evt.nativeEvent;
        handleDraw(locationX, locationY);
        lastDrawPosRef.current = { x: locationX, y: locationY };
      },
      onPanResponderMove: (evt) => {
        if (isDrawingRef.current) {
          const { locationX, locationY } = evt.nativeEvent;

          // Interpolate between last position and current for smooth lines
          if (lastDrawPosRef.current) {
            const dx = locationX - lastDrawPosRef.current.x;
            const dy = locationY - lastDrawPosRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const steps = Math.max(1, Math.floor(dist / (gameConfig.gridSize * 2)));

            for (let i = 1; i <= steps; i++) {
              const t = i / steps;
              const ix = lastDrawPosRef.current.x + dx * t;
              const iy = lastDrawPosRef.current.y + dy * t;
              handleDraw(ix, iy);
            }
          }

          handleDraw(locationX, locationY);
          lastDrawPosRef.current = { x: locationX, y: locationY };
        }
      },
      onPanResponderRelease: () => {
        isDrawingRef.current = false;
        lastDrawPosRef.current = null;
      },
    })
  ).current;

  // WebGL context creation
  const onContextCreate = useCallback((gl: ExpoWebGLRenderingContext) => {
    glRef.current = gl;

    // Set clear color to background
    gl.clearColor(0.067, 0.098, 0.129, 1.0); // #111921

    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }, []);

  // Render loop
  useEffect(() => {
    const targetFrameTime = 1000 / (60 * speed);

    const render = (time: number) => {
      if (!glRef.current || !engineRef.current) {
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      const deltaTime = time - lastTimeRef.current;

      // Update physics at target frame rate
      if (isPlaying && deltaTime >= targetFrameTime) {
        // Multiple updates for higher speeds
        const updates = Math.min(Math.floor(speed), 4);
        for (let i = 0; i < updates; i++) {
          engineRef.current.update();
        }
        lastTimeRef.current = time;
      }

      // Render particles
      const gl = glRef.current;
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Get particles and render them as points
      const particles = engineRef.current.getParticles();
      renderParticles(gl, particles, width, height);

      gl.flush();
      gl.endFrameEXP();

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed, width, height, engineRef]);

  return (
    <View style={[styles.container, { width, height }]} {...panResponder.panHandlers}>
      <GLView
        style={styles.glView}
        onContextCreate={onContextCreate}
      />
    </View>
  );
};

// Simple particle rendering (optimized for mobile)
function renderParticles(
  gl: ExpoWebGLRenderingContext,
  particles: Particle[],
  canvasWidth: number,
  canvasHeight: number
) {
  if (particles.length === 0) return;

  // Create vertex shader
  const vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec3 a_color;
    varying vec3 v_color;
    uniform vec2 u_resolution;

    void main() {
      vec2 clipSpace = ((a_position / u_resolution) * 2.0 - 1.0) * vec2(1, -1);
      gl_Position = vec4(clipSpace, 0, 1);
      gl_PointSize = ${gameConfig.gridSize.toFixed(1)};
      v_color = a_color;
    }
  `;

  // Create fragment shader
  const fragmentShaderSource = `
    precision mediump float;
    varying vec3 v_color;

    void main() {
      gl_FragColor = vec4(v_color, 1.0);
    }
  `;

  // Compile shaders
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  if (!vertexShader || !fragmentShader) return;

  // Create program
  const program = createProgram(gl, vertexShader, fragmentShader);
  if (!program) return;

  gl.useProgram(program);

  // Set resolution uniform
  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  gl.uniform2f(resolutionLocation, canvasWidth, canvasHeight);

  // Create position buffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Build position and color data
  const positions: number[] = [];
  const colorData: number[] = [];

  for (const particle of particles) {
    positions.push(particle.x, particle.y);

    // Get color for element type
    const element = elementTypes[particle.type];
    const color = hexToRgb(element.color);
    colorData.push(color.r, color.g, color.b);
  }

  // Upload position data
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW);

  // Set up position attribute
  const positionLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // Create and upload color buffer
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.DYNAMIC_DRAW);

  // Set up color attribute
  const colorLocation = gl.getAttribLocation(program, 'a_color');
  gl.enableVertexAttribArray(colorLocation);
  gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

  // Draw points
  gl.drawArrays(gl.POINTS, 0, particles.length);

  // Clean up
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  gl.deleteProgram(program);
  gl.deleteBuffer(positionBuffer);
  gl.deleteBuffer(colorBuffer);
}

// Shader helper functions
function createShader(gl: ExpoWebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: ExpoWebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

// Convert hex color to RGB (0-1 range)
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
    };
  }
  return { r: 0.5, g: 0.5, b: 0.5 };
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 0,
  },
  glView: {
    flex: 1,
  },
});

export default ParticleCanvas;

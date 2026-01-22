// src/components/ParticleCanvas.tsx
// Canvas component for rendering particles using React Native Views

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
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
  const [particles, setParticles] = useState<Particle[]>([]);
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

  // Animation loop
  useEffect(() => {
    const targetFrameTime = 1000 / 30; // 30 FPS for View-based rendering

    const animate = (time: number) => {
      if (!engineRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = time - lastTimeRef.current;

      if (deltaTime >= targetFrameTime) {
        if (isPlaying) {
          // Update physics
          const updates = Math.min(Math.floor(speed), 4);
          for (let i = 0; i < updates; i++) {
            engineRef.current.update();
          }
        }

        // Update render state
        setParticles([...engineRef.current.getParticles()]);
        lastTimeRef.current = time;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed, engineRef]);

  // Limit rendered particles for performance
  const maxRenderedParticles = 2000;
  const displayParticles = particles.slice(0, maxRenderedParticles);

  return (
    <View style={[styles.container, { width, height }]} {...panResponder.panHandlers}>
      <View style={styles.canvas}>
        {displayParticles.map((particle, index) => {
          const element = elementTypes[particle.type];
          return (
            <View
              key={index}
              style={[
                styles.particle,
                {
                  left: particle.x,
                  top: particle.y,
                  backgroundColor: element.color,
                  width: gameConfig.gridSize,
                  height: gameConfig.gridSize,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: colors.backgroundDark,
  },
  canvas: {
    flex: 1,
    position: 'relative',
  },
  particle: {
    position: 'absolute',
    borderRadius: 1,
  },
});

export default ParticleCanvas;

// Particle canvas using View-based rendering
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';
import { colors, elementTypes, gameConfig, ElementType } from '../theme';
import { ParticleEngine } from '../game/ParticleEngine';
import { Particle } from '../types';

interface Props {
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

export const ParticleCanvas: React.FC<Props> = ({
  width, height, isPlaying, speed, selectedElement, brushSize, gravityAngle, onParticleCountChange, engineRef,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    if (!engineRef.current) engineRef.current = new ParticleEngine();
    engineRef.current.init(width, height);
  }, [width, height, engineRef]);

  useEffect(() => {
    engineRef.current?.setGravityAngle(gravityAngle);
  }, [gravityAngle, engineRef]);

  const handleDraw = useCallback((x: number, y: number) => {
    if (engineRef.current) {
      engineRef.current.addParticle(x, y, selectedElement, brushSize);
      onParticleCountChange(engineRef.current.getParticleCount());
    }
  }, [selectedElement, brushSize, onParticleCountChange, engineRef]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => handleDraw(e.nativeEvent.locationX, e.nativeEvent.locationY),
      onPanResponderMove: (e) => handleDraw(e.nativeEvent.locationX, e.nativeEvent.locationY),
    })
  ).current;

  useEffect(() => {
    const animate = (time: number) => {
      if (!engineRef.current) { animRef.current = requestAnimationFrame(animate); return; }
      if (time - lastTimeRef.current >= 33) {
        if (isPlaying) {
          for (let i = 0; i < Math.min(speed, 4); i++) engineRef.current.update();
        }
        setParticles([...engineRef.current.getParticles()]);
        lastTimeRef.current = time;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isPlaying, speed, engineRef]);

  const display = particles.slice(0, 1500);

  return (
    <View style={[styles.container, { width, height }]} {...panResponder.panHandlers}>
      {display.map((p, i) => (
        <View key={i} style={[styles.particle, {
          left: p.x, top: p.y, backgroundColor: elementTypes[p.type].color,
          width: gameConfig.gridSize, height: gameConfig.gridSize,
        }]} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { overflow: 'hidden', backgroundColor: colors.backgroundDark, position: 'relative' },
  particle: { position: 'absolute', borderRadius: 1 },
});

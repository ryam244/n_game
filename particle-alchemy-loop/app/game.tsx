// app/game.tsx
// Main Gameplay Screen - Particle Alchemy Loop

import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { colors, spacing, typography, borderRadius, ElementType } from '../src/theme';
import { GlassPanel } from '../src/components/GlassPanel';
import { ElementPalette } from '../src/components/ElementPalette';
import { ControlBar } from '../src/components/ControlBar';
import { ParticleCanvas } from '../src/components/ParticleCanvas';
import { ParticleEngine } from '../src/game/ParticleEngine';
import { useGameStore } from '../src/stores/gameStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Canvas dimensions (leave room for UI)
const CANVAS_HEIGHT = SCREEN_HEIGHT - 280;
const CANVAS_WIDTH = SCREEN_WIDTH;

export default function GameScreen() {
  const engineRef = useRef<ParticleEngine | null>(null);

  // Get state from store
  const {
    isPlaying,
    speed,
    particleCount,
    gravityAngle,
    selectedElement,
    brushSize,
    togglePlaying,
    setSpeed,
    setParticleCount,
    setSelectedElement,
    reset,
  } = useGameStore();

  // Speed options cycle
  const speedOptions = [1, 1.5, 2, 4];
  const handleSpeedChange = useCallback(() => {
    const currentIndex = speedOptions.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speedOptions.length;
    setSpeed(speedOptions[nextIndex]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [speed, setSpeed]);

  // Handle play/pause
  const handlePlayPause = useCallback(() => {
    togglePlaying();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [togglePlaying]);

  // Handle reset
  const handleReset = useCallback(() => {
    Alert.alert(
      'Reset Simulation',
      'Are you sure you want to clear all particles?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            if (engineRef.current) {
              engineRef.current.clear();
              setParticleCount(0);
            }
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  }, [setParticleCount]);

  // Handle undo (for now, just clears - TODO: implement history)
  const handleUndo = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement undo history
  }, []);

  // Handle screenshot (placeholder)
  const handleScreenshot = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Screenshot', 'Screenshot feature coming soon!');
  }, []);

  // Handle element selection
  const handleSelectElement = useCallback(
    (element: ElementType) => {
      setSelectedElement(element);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [setSelectedElement]
  );

  // Handle back navigation
  const handleBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={['#1a2430', colors.backgroundDark]}
        style={styles.background}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <GlassPanel style={styles.header} padding={spacing.md}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="settings" size={24} color={colors.primary} />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Particle Alchemy Loop</Text>
            <Text style={styles.headerSubtitle}>
              {isPlaying ? 'SIMULATION ACTIVE' : 'PAUSED'}
            </Text>
          </View>

          <View style={styles.particleCounter}>
            <View style={styles.counterDot} />
            <Text style={styles.counterText}>
              P: {particleCount.toLocaleString()}
            </Text>
          </View>

          <TouchableOpacity style={styles.infoButton}>
            <MaterialIcons name="info" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </GlassPanel>

        {/* Canvas Area */}
        <View style={styles.canvasContainer}>
          <ParticleCanvas
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            isPlaying={isPlaying}
            speed={speed}
            selectedElement={selectedElement}
            brushSize={brushSize}
            gravityAngle={gravityAngle}
            onParticleCountChange={setParticleCount}
            engineRef={engineRef}
          />

          {/* Decorative center element */}
          <View style={styles.centerDecoration} pointerEvents="none">
            <View style={styles.centerRing}>
              <View style={styles.centerRingInner}>
                <MaterialIcons
                  name="all-inclusive"
                  size={80}
                  color={`${colors.primary}30`}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Zoom controls */}
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton}>
            <MaterialIcons name="add" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton}>
            <MaterialIcons name="remove" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.zoomDivider} />
          <TouchableOpacity style={[styles.zoomButton, styles.zoomButtonActive]}>
            <MaterialIcons name="near-me" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Bottom UI */}
        <View style={styles.bottomUI}>
          {/* Element Palette */}
          <ElementPalette
            selectedElement={selectedElement}
            onSelectElement={handleSelectElement}
          />

          {/* Control Bar */}
          <View style={styles.controlBarContainer}>
            <ControlBar
              isPlaying={isPlaying}
              speed={speed}
              onPlayPause={handlePlayPause}
              onSpeedChange={handleSpeedChange}
              onReset={handleReset}
              onUndo={handleUndo}
              onScreenshot={handleScreenshot}
            />
          </View>

          {/* Home indicator space */}
          <View style={styles.homeIndicator}>
            <View style={styles.homeIndicatorBar} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.sm,
    marginTop: spacing.xs,
    borderRadius: borderRadius.lg,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.textPrimary}05`,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  headerTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.tiny,
    color: colors.primary,
    letterSpacing: 2,
    marginTop: 2,
  },
  particleCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.textPrimary}05`,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: `${colors.textPrimary}10`,
    gap: spacing.xs,
  },
  counterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  counterText: {
    ...typography.caption,
    fontFamily: 'monospace',
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.textPrimary}05`,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  canvasContainer: {
    flex: 1,
    position: 'relative',
  },
  centerDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerRingInner: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 0.5,
    borderColor: `${colors.primary}30`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomControls: {
    position: 'absolute',
    top: 100,
    right: spacing.md,
    gap: spacing.sm,
    alignItems: 'center',
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glassBackground,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomButtonActive: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  zoomDivider: {
    height: 1,
    width: 24,
    backgroundColor: `${colors.textPrimary}10`,
  },
  bottomUI: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  controlBarContainer: {
    paddingTop: spacing.sm,
  },
  homeIndicator: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  homeIndicatorBar: {
    width: 128,
    height: 4,
    borderRadius: 2,
    backgroundColor: `${colors.textPrimary}10`,
  },
});

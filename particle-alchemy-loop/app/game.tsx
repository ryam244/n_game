// Gameplay Screen
import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { colors, spacing, typography, borderRadius } from '../src/theme';
import { GlassPanel } from '../src/components/GlassPanel';
import { ElementPalette } from '../src/components/ElementPalette';
import { ControlBar } from '../src/components/ControlBar';
import { ParticleCanvas } from '../src/components/ParticleCanvas';
import { ParticleEngine } from '../src/game/ParticleEngine';
import { useGameStore } from '../src/stores/gameStore';

const { width: SW, height: SH } = Dimensions.get('window');
const CANVAS_HEIGHT = SH - 280;

export default function GameScreen() {
  const engineRef = useRef<ParticleEngine | null>(null);
  const { isPlaying, speed, particleCount, gravityAngle, selectedElement, brushSize,
    togglePlaying, setSpeed, setParticleCount, setSelectedElement } = useGameStore();

  const speeds = [1, 1.5, 2, 4];
  const handleSpeed = useCallback(() => {
    const i = speeds.indexOf(speed);
    setSpeed(speeds[(i + 1) % speeds.length]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [speed, setSpeed]);

  const handlePlayPause = useCallback(() => {
    togglePlaying();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [togglePlaying]);

  const handleReset = useCallback(() => {
    Alert.alert('Reset', 'Clear all particles?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => {
        engineRef.current?.clear();
        setParticleCount(0);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }},
    ]);
  }, [setParticleCount]);

  const handleSelect = useCallback((el: typeof selectedElement) => {
    setSelectedElement(el);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [setSelectedElement]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a2430', colors.backgroundDark]} style={styles.bg} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <GlassPanel style={styles.header} padding={spacing.md}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Particle Alchemy</Text>
            <Text style={styles.headerSub}>{isPlaying ? 'SIMULATION ACTIVE' : 'PAUSED'}</Text>
          </View>
          <View style={styles.counter}>
            <View style={styles.dot} />
            <Text style={styles.counterText}>P: {particleCount.toLocaleString()}</Text>
          </View>
        </GlassPanel>

        <View style={styles.canvasWrap}>
          <ParticleCanvas
            width={SW}
            height={CANVAS_HEIGHT}
            isPlaying={isPlaying}
            speed={speed}
            selectedElement={selectedElement}
            brushSize={brushSize}
            gravityAngle={gravityAngle}
            onParticleCountChange={setParticleCount}
            engineRef={engineRef}
          />
        </View>

        <View style={styles.bottomUI}>
          <ElementPalette selectedElement={selectedElement} onSelectElement={handleSelect} />
          <View style={styles.controlWrap}>
            <ControlBar isPlaying={isPlaying} speed={speed} onPlayPause={handlePlayPause} onSpeedChange={handleSpeed} onReset={handleReset} />
          </View>
          <View style={styles.homeInd}><View style={styles.homeBar} /></View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundDark },
  bg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.sm, marginTop: spacing.xs, borderRadius: borderRadius.lg },
  backBtn: { padding: spacing.xs },
  headerInfo: { flex: 1, marginLeft: spacing.sm },
  headerTitle: { ...typography.bodySmall, fontWeight: '700', color: colors.textPrimary },
  headerSub: { ...typography.tiny, color: colors.primary, letterSpacing: 2, marginTop: 2 },
  counter: { flexDirection: 'row', alignItems: 'center', backgroundColor: `${colors.textPrimary}05`, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: borderRadius.full, gap: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  counterText: { ...typography.caption, fontFamily: 'monospace', color: colors.textPrimary },
  canvasWrap: { flex: 1 },
  bottomUI: { position: 'absolute', bottom: 0, left: 0, right: 0, gap: spacing.sm, paddingBottom: spacing.sm },
  controlWrap: { paddingTop: spacing.sm },
  homeInd: { alignItems: 'center', paddingTop: spacing.sm, paddingBottom: spacing.xs },
  homeBar: { width: 128, height: 4, borderRadius: 2, backgroundColor: `${colors.textPrimary}10` },
});

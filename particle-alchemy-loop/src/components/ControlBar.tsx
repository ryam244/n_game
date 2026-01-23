// Bottom control bar
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../theme';
import { GlassPanel } from './GlassPanel';

interface Props {
  isPlaying: boolean;
  speed: number;
  onPlayPause: () => void;
  onSpeedChange: () => void;
  onReset: () => void;
}

export const ControlBar: React.FC<Props> = ({ isPlaying, speed, onPlayPause, onSpeedChange, onReset }) => (
  <GlassPanel style={styles.container} padding={spacing.sm}>
    <View style={styles.left}>
      <TouchableOpacity onPress={onPlayPause} style={styles.iconBtn}>
        <MaterialIcons name={isPlaying ? 'pause-circle-outline' : 'play-circle-outline'} size={28} color={colors.textMuted} />
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity onPress={onSpeedChange} style={styles.speedBtn}>
        <MaterialIcons name="fast-forward" size={16} color={colors.primary} />
        <Text style={styles.speedText}>{speed}x</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity onPress={onReset} style={styles.resetBtn}>
      <MaterialIcons name="delete" size={18} color={colors.textPrimary} />
      <Text style={styles.resetText}>Reset</Text>
    </TouchableOpacity>
  </GlassPanel>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    marginHorizontal: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconBtn: { padding: spacing.xs },
  divider: { width: 1, height: 24, backgroundColor: `${colors.textPrimary}10` },
  speedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: `${colors.primary}10`,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: `${colors.primary}20`,
  },
  speedText: { ...typography.caption, color: colors.primary, fontWeight: '700' },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  resetText: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '700' },
});

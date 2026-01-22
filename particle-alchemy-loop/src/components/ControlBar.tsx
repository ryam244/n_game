// src/components/ControlBar.tsx
// Bottom control bar for simulation controls

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../theme';
import { GlassPanel } from './GlassPanel';

interface ControlBarProps {
  isPlaying: boolean;
  speed: number;
  onPlayPause: () => void;
  onSpeedChange: () => void;
  onReset: () => void;
  onUndo: () => void;
  onScreenshot: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  isPlaying,
  speed,
  onPlayPause,
  onSpeedChange,
  onReset,
  onUndo,
  onScreenshot,
}) => {
  return (
    <GlassPanel style={styles.container} padding={spacing.sm}>
      <View style={styles.leftControls}>
        {/* Play/Pause */}
        <TouchableOpacity
          onPress={onPlayPause}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name={isPlaying ? 'pause-circle-outline' : 'play-circle-outline'}
            size={28}
            color={colors.textMuted}
          />
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Speed control */}
        <TouchableOpacity
          onPress={onSpeedChange}
          style={styles.speedButton}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="fast-forward"
            size={16}
            color={colors.primary}
          />
          <Text style={styles.speedText}>{speed}x</Text>
        </TouchableOpacity>

        {/* Screenshot */}
        <TouchableOpacity
          onPress={onScreenshot}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="photo-camera"
            size={24}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.rightControls}>
        {/* Undo */}
        <TouchableOpacity
          onPress={onUndo}
          style={styles.undoButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="undo" size={22} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Reset */}
        <TouchableOpacity
          onPress={onReset}
          style={styles.resetButton}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="delete"
            size={18}
            color={colors.textPrimary}
          />
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </GlassPanel>
  );
};

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
  leftControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    padding: spacing.xs,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: `${colors.textPrimary}10`,
  },
  speedButton: {
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
  speedText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  undoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.textPrimary}05`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  resetText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '700',
  },
});

export default ControlBar;

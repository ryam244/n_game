// src/components/GlassPanel.tsx
// Glass morphism panel component

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius as br } from '../theme';

interface GlassPanelProps {
  children: React.ReactNode;
  style?: ViewStyle;
  borderRadius?: number;
  padding?: number;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  style,
  borderRadius = br.xl,
  padding = 0,
}) => {
  return (
    <View
      style={[
        styles.container,
        { borderRadius, padding },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.glassBackground,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
});

export default GlassPanel;

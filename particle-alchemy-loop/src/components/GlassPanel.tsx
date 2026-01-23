// Glass morphism panel component
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius as br } from '../theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  borderRadius?: number;
  padding?: number;
}

export const GlassPanel: React.FC<Props> = ({ children, style, borderRadius = br.xl, padding = 0 }) => (
  <View style={[styles.container, { borderRadius, padding }, style]}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.glassBackground,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
});

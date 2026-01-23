// Element selection palette
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, elementTypes, ElementType } from '../theme';
import { GlassPanel } from './GlassPanel';

interface Props {
  selectedElement: ElementType;
  onSelectElement: (element: ElementType) => void;
}

export const ElementPalette: React.FC<Props> = ({ selectedElement, onSelectElement }) => {
  const elements: ElementType[] = ['sand', 'water', 'stone'];

  return (
    <GlassPanel style={styles.container} padding={spacing.sm}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {elements.map((type) => {
          const el = elementTypes[type];
          const selected = selectedElement === type;
          return (
            <TouchableOpacity
              key={type}
              onPress={() => onSelectElement(type)}
              style={[styles.btn, selected && styles.btnSelected]}
            >
              <MaterialIcons name={el.icon as any} size={20} color={selected ? el.color : colors.textMuted} />
              <Text style={[styles.text, selected && styles.textSelected]}>{el.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </GlassPanel>
  );
};

const styles = StyleSheet.create({
  container: { borderRadius: borderRadius.full, marginHorizontal: spacing.md },
  scroll: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.xs },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: `${colors.textPrimary}05`,
    borderWidth: 1,
    borderColor: `${colors.textPrimary}05`,
    gap: spacing.sm,
  },
  btnSelected: { backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}40` },
  text: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '500' },
  textSelected: { color: colors.textPrimary, fontWeight: '600' },
});

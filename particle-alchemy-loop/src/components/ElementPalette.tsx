// src/components/ElementPalette.tsx
// Element selection palette for the game

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, elementTypes, ElementType } from '../theme';
import { GlassPanel } from './GlassPanel';

interface ElementButtonProps {
  type: ElementType;
  isSelected: boolean;
  onPress: () => void;
}

const ElementButton: React.FC<ElementButtonProps> = ({ type, isSelected, onPress }) => {
  const element = elementTypes[type];

  const getIconName = (icon: string): keyof typeof MaterialIcons.glyphMap => {
    const iconMap: Record<string, keyof typeof MaterialIcons.glyphMap> = {
      grain: 'grain',
      water_drop: 'water-drop',
      mountain_flag: 'landscape',
    };
    return iconMap[icon] || 'circle';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.elementButton,
        isSelected && styles.elementButtonSelected,
      ]}
    >
      <MaterialIcons
        name={getIconName(element.icon)}
        size={20}
        color={isSelected ? element.color : colors.textMuted}
      />
      <Text
        style={[
          styles.elementText,
          isSelected && styles.elementTextSelected,
        ]}
      >
        {element.name}
      </Text>
    </TouchableOpacity>
  );
};

interface ElementPaletteProps {
  selectedElement: ElementType;
  onSelectElement: (element: ElementType) => void;
}

export const ElementPalette: React.FC<ElementPaletteProps> = ({
  selectedElement,
  onSelectElement,
}) => {
  const elements: ElementType[] = ['sand', 'water', 'stone'];

  return (
    <GlassPanel style={styles.container} padding={spacing.sm}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {elements.map((type) => (
          <ElementButton
            key={type}
            type={type}
            isSelected={selectedElement === type}
            onPress={() => onSelectElement(type)}
          />
        ))}
      </ScrollView>
    </GlassPanel>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.full,
    marginHorizontal: spacing.md,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  elementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: `${colors.textPrimary}05`,
    borderWidth: 1,
    borderColor: `${colors.textPrimary}05`,
    gap: spacing.sm,
  },
  elementButtonSelected: {
    backgroundColor: `${colors.primary}20`,
    borderColor: `${colors.primary}40`,
  },
  elementText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  elementTextSelected: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});

export default ElementPalette;

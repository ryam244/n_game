// app/index.tsx
// Main Menu Screen - Particle Alchemy Loop

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, typography, borderRadius } from '../src/theme';
import { GlassPanel } from '../src/components/GlassPanel';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Menu item component
interface MenuItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <GlassPanel style={styles.menuItem} padding={spacing.md}>
      <View style={styles.menuItemContent}>
        <MaterialIcons
          name={icon}
          size={24}
          color={colors.textMuted}
          style={styles.menuIcon}
        />
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      <MaterialIcons
        name="chevron-right"
        size={20}
        color={colors.textDisabled}
      />
    </GlassPanel>
  </TouchableOpacity>
);

// Level indicator component
const LevelIndicator: React.FC = () => {
  const level = 24;
  const progress = 85;

  return (
    <GlassPanel style={styles.levelContainer} padding={spacing.sm}>
      <View style={styles.levelCircle}>
        <View style={styles.levelProgressBg}>
          <View
            style={[
              styles.levelProgressFill,
              { transform: [{ rotate: `${(progress / 100) * 360}deg` }] },
            ]}
          />
        </View>
        <Text style={styles.levelNumber}>{level}</Text>
      </View>
      <View style={styles.levelInfo}>
        <Text style={styles.levelLabel}>LEVEL</Text>
        <Text style={styles.levelXp}>{progress}% XP</Text>
      </View>
    </GlassPanel>
  );
};

export default function MenuScreen() {
  const handleStartGame = () => {
    router.push('/game');
  };

  const handleNewSandbox = () => {
    router.push('/game');
  };

  const handleChallenges = () => {
    // TODO: Navigate to challenges
  };

  const handleGallery = () => {
    // TODO: Navigate to gallery
  };

  const handleSettings = () => {
    // TODO: Navigate to settings
  };

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={['#1a2a3a', colors.backgroundDark]}
        style={styles.backgroundGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Decorative blobs */}
      <View style={styles.decorativeBlob1} />
      <View style={styles.decorativeBlob2} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <MaterialIcons
                name="all-inclusive"
                size={28}
                color={colors.primary}
              />
            </View>
            <Text style={styles.title}>PARTICLE ALCHEMY</Text>
            <TouchableOpacity style={styles.soundButton}>
              <MaterialIcons
                name="volume-up"
                size={24}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          {/* Level indicator */}
          <View style={styles.levelRow}>
            <LevelIndicator />
          </View>

          {/* Main content */}
          <View style={styles.mainContent}>
            {/* Continue Experiment Button */}
            <TouchableOpacity
              onPress={handleStartGame}
              activeOpacity={0.9}
              style={styles.continueButtonWrapper}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={styles.continueButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.continueButtonInner}>
                  <Text style={styles.continueLabel}>CURRENT RESEARCH</Text>
                  <Text style={styles.continueTitle}>Continue Experiment</Text>
                  <Text style={styles.continueSubtitle}>
                    Level 12 • Resonance Chambers
                  </Text>
                  <View style={styles.progressBar}>
                    <View style={styles.progressFill} />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Menu items */}
            <View style={styles.menuList}>
              <MenuItem
                icon="science"
                title="New Sandbox"
                onPress={handleNewSandbox}
              />
              <MenuItem
                icon="extension"
                title="Challenges"
                onPress={handleChallenges}
              />
              <MenuItem
                icon="auto-awesome-motion"
                title="Alchemy Gallery"
                onPress={handleGallery}
              />
              <MenuItem
                icon="settings"
                title="Settings"
                onPress={handleSettings}
              />
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerIcons}>
              <TouchableOpacity style={styles.footerButton}>
                <MaterialIcons name="info" size={22} color={colors.textDisabled} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerButton}>
                <MaterialIcons
                  name="leaderboard"
                  size={22}
                  color={colors.textDisabled}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerButton}>
                <MaterialIcons name="share" size={22} color={colors.textDisabled} />
              </TouchableOpacity>
            </View>
            <Text style={styles.versionText}>LOOP V2.4.0 • SYNCED</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorativeBlob1: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: `${colors.primary}10`,
  },
  decorativeBlob2: {
    position: 'absolute',
    bottom: '25%',
    right: '10%',
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: `${colors.primary}05`,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glassBackgroundLight,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 3,
    textAlign: 'center',
    flex: 1,
    paddingLeft: spacing.md,
  },
  soundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glassBackgroundLight,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: spacing.sm,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minWidth: 140,
  },
  levelCircle: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelProgressBg: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: `${colors.textPrimary}10`,
  },
  levelProgressFill: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.primary,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  levelNumber: {
    ...typography.tiny,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  levelInfo: {
    flexDirection: 'column',
  },
  levelLabel: {
    ...typography.tiny,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 2,
  },
  levelXp: {
    ...typography.caption,
    color: colors.textMuted,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  continueButtonWrapper: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  continueButtonGradient: {
    padding: 1,
    borderRadius: borderRadius.xl,
  },
  continueButtonInner: {
    backgroundColor: `${colors.backgroundDark}CC`,
    borderRadius: borderRadius.xl - 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  continueLabel: {
    ...typography.tiny,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: spacing.sm,
  },
  continueTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  continueSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  progressBar: {
    width: 96,
    height: 2,
    backgroundColor: `${colors.textPrimary}10`,
    borderRadius: 1,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    width: '66%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  menuList: {
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: borderRadius.xl,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: spacing.md,
  },
  menuItemText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  footerIcons: {
    flexDirection: 'row',
    gap: spacing.xxl,
  },
  footerButton: {
    padding: spacing.sm,
  },
  versionText: {
    ...typography.tiny,
    color: colors.textDisabled,
    letterSpacing: 2,
  },
});

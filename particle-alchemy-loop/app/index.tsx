// Main Menu Screen
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, typography, borderRadius } from '../src/theme';
import { GlassPanel } from '../src/components/GlassPanel';

const MenuItem = ({ icon, title, onPress }: { icon: any; title: string; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <GlassPanel style={styles.menuItem} padding={spacing.md}>
      <View style={styles.menuItemContent}>
        <MaterialIcons name={icon} size={24} color={colors.textMuted} style={styles.menuIcon} />
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} color={colors.textDisabled} />
    </GlassPanel>
  </TouchableOpacity>
);

export default function MenuScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a2a3a', colors.backgroundDark]} style={styles.bg} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.logo}>
              <MaterialIcons name="all-inclusive" size={28} color={colors.primary} />
            </View>
            <Text style={styles.title}>PARTICLE ALCHEMY</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.main}>
            <TouchableOpacity onPress={() => router.push('/game')} activeOpacity={0.9} style={styles.continueWrapper}>
              <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.continueGradient}>
                <View style={styles.continueInner}>
                  <Text style={styles.continueLabel}>SANDBOX MODE</Text>
                  <Text style={styles.continueTitle}>Start Experiment</Text>
                  <Text style={styles.continueSubtitle}>Sand, Water, Stone</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.menuList}>
              <MenuItem icon="science" title="New Sandbox" onPress={() => router.push('/game')} />
              <MenuItem icon="extension" title="Challenges" onPress={() => {}} />
              <MenuItem icon="settings" title="Settings" onPress={() => {}} />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.version}>PRE-MVP v0.1.0</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundDark },
  bg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  safe: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: spacing.lg, paddingBottom: spacing.md },
  logo: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.glassBackgroundLight, borderWidth: 1, borderColor: colors.glassBorder, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.body, fontWeight: '700', color: colors.textPrimary, letterSpacing: 3 },
  main: { flex: 1, justifyContent: 'center', paddingVertical: spacing.xl, maxWidth: 400, alignSelf: 'center', width: '100%' },
  continueWrapper: { marginBottom: spacing.lg, borderRadius: borderRadius.xl, overflow: 'hidden', shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  continueGradient: { padding: 1, borderRadius: borderRadius.xl },
  continueInner: { backgroundColor: `${colors.backgroundDark}CC`, borderRadius: borderRadius.xl - 1, paddingVertical: spacing.lg, paddingHorizontal: spacing.md, alignItems: 'center' },
  continueLabel: { ...typography.tiny, color: colors.primary, fontWeight: '700', letterSpacing: 4, marginBottom: spacing.sm },
  continueTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: spacing.xs },
  continueSubtitle: { ...typography.caption, color: colors.textMuted, letterSpacing: 1 },
  menuList: { gap: spacing.sm, paddingTop: spacing.md },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: borderRadius.xl },
  menuItemContent: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: { marginRight: spacing.md },
  menuItemText: { ...typography.body, color: colors.textSecondary, fontWeight: '500' },
  footer: { alignItems: 'center', paddingVertical: spacing.xl },
  version: { ...typography.tiny, color: colors.textDisabled, letterSpacing: 2 },
});

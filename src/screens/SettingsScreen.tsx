import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { BottomNavigation } from '../components/BottomNavigation';
import { useTheme, ThemeMode } from '../components/ThemeContext';

interface Props { navigate: (screen: string) => void; }

const SettingsScreen: React.FC<Props> = ({ navigate }) => {
  const { colors, mode, setMode, isDark } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric]         = useState(true);

  const tabs = [
    { id: 'home',     label: 'Home',     icon: '🏠' },
    { id: 'stats',    label: 'Stats',    icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const themeOptions: { id: ThemeMode; label: string; icon: string }[] = [
    { id: 'light',  label: 'Light',  icon: '☀️' },
    { id: 'dark',   label: 'Dark',   icon: '🌙' },
    { id: 'system', label: 'System', icon: '📱' },
  ];

  const settingRow = (icon: string, label: string, value: boolean, onToggle: () => void) => (
    <View key={label} style={[styles.settingRow, { borderBottomColor: colors.border }]}>
      <Text style={styles.settingIcon}>{icon}</Text>
      <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#fff"
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.heading, { color: colors.text }]}>Settings</Text>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, shadowColor: colors.primary }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
            <Text style={styles.avatarEmoji}>👨</Text>
          </View>
          <View>
            <Text style={[styles.profileName, { color: colors.text }]}>Alex Johnson</Text>
            <Text style={[styles.profileRole, { color: colors.textSub }]}>Parent · Organizer</Text>
          </View>
        </View>

        {/* ── Theme Selector ──────────────────────────────── */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>APPEARANCE</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.themeHeading, { color: colors.text }]}>🎨  App Theme</Text>
          <Text style={[styles.themeSub, { color: colors.textSub }]}>
            Choose how the app looks
          </Text>
          <View style={styles.themeRow}>
            {themeOptions.map(opt => {
              const isActive = mode === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.themeBtn,
                    { backgroundColor: isActive ? colors.primary : colors.cardAlt,
                      borderColor:     isActive ? colors.primary : colors.border },
                  ]}
                  onPress={() => setMode(opt.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.themeBtnIcon}>{opt.icon}</Text>
                  <Text style={[
                    styles.themeBtnLabel,
                    { color: isActive ? '#fff' : colors.textSub }
                  ]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Preferences ─────────────────────────────────── */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>PREFERENCES</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {settingRow('🔔', 'Notifications', notifications, () => setNotifications(!notifications))}
          {settingRow('👤', 'Face Recognition', biometric, () => setBiometric(!biometric))}
        </View>

        {/* ── Account ─────────────────────────────────────── */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>ACCOUNT</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {[
            { icon: '🔐', label: 'Change PIN',        screen: 'PinEntry' },
            { icon: '👨‍👩‍👧‍👦', label: 'Manage Family',     screen: 'FamilyTab' },
            { icon: '📊', label: 'View Stats',        screen: 'StatsScreen' },
            { icon: '🛡️', label: 'Digital Wellbeing', screen: 'DigitalWellbeingScreen' },
          ].map((item, i, arr) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.linkRow,
                { borderBottomColor: colors.border,
                  borderBottomWidth: i < arr.length - 1 ? 1 : 0 },
              ]}
              onPress={() => navigate(item.screen)}
              activeOpacity={0.7}
            >
              <Text style={styles.linkIcon}>{item.icon}</Text>
              <Text style={[styles.linkLabel, { color: colors.text }]}>{item.label}</Text>
              <Text style={[styles.linkChevron, { color: colors.textMuted }]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: isDark ? '#450a0a' : '#fee2e2' }]}
          onPress={() => navigate('WelcomeScreen')}
          activeOpacity={0.85}
        >
          <Text style={[styles.logoutText, { color: colors.danger }]}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 90 }} />
      </ScrollView>

      <BottomNavigation
        tabs={tabs}
        activeTab="settings"
        onTabChange={(id) => {
          if (id === 'home')  navigate('SelfHome');
          if (id === 'stats') navigate('StatsScreen');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container:      { flex: 1 },
  content:        { padding: 24 },
  heading:        { fontSize: 30, fontWeight: '800', marginBottom: 24 },
  profileCard:    { flexDirection: 'row', alignItems: 'center', gap: 16, borderRadius: 20, padding: 20, marginBottom: 28, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  avatar:         { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji:    { fontSize: 30 },
  profileName:    { fontSize: 18, fontWeight: '700' },
  profileRole:    { fontSize: 13, marginTop: 2 },
  sectionLabel:   { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' },
  card:           { borderRadius: 18, overflow: 'hidden', marginBottom: 24, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },

  // Theme selector
  themeHeading:   { fontSize: 16, fontWeight: '700', marginHorizontal: 16, marginTop: 16, marginBottom: 4 },
  themeSub:       { fontSize: 13, marginHorizontal: 16, marginBottom: 14 },
  themeRow:       { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingBottom: 16 },
  themeBtn:       { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 14, borderWidth: 2, gap: 4 },
  themeBtnIcon:   { fontSize: 22 },
  themeBtnLabel:  { fontSize: 13, fontWeight: '700' },

  settingRow:     { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  settingIcon:    { fontSize: 20, marginRight: 14 },
  settingLabel:   { flex: 1, fontSize: 15, fontWeight: '600' },
  linkRow:        { flexDirection: 'row', alignItems: 'center', padding: 16 },
  linkIcon:       { fontSize: 20, marginRight: 14 },
  linkLabel:      { flex: 1, fontSize: 15, fontWeight: '600' },
  linkChevron:    { fontSize: 22 },
  logoutBtn:      { borderRadius: 16, padding: 18, alignItems: 'center' },
  logoutText:     { fontWeight: '700', fontSize: 16 },
});

export default SettingsScreen;

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/Header';
import { ProgressRing } from '../components/ProgressRing';
import { MemberRow } from '../components/MemberRow';
import { BottomNavigation } from '../components/BottomNavigation';
import { useTheme } from '../components/ThemeContext';

interface Props { navigate: (screen: string) => void; }

const ParentHome: React.FC<Props> = ({ navigate }) => {
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('home');
  const tabs = [
    { id: 'home',     label: 'Home',     icon: '🏠' },
    { id: 'family',   label: 'Family',   icon: '👨‍👩‍👧' },
    { id: 'stats',    label: 'Stats',    icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header showLogo title="Family Overview" rightAction={{ icon: '➕', onPress: () => navigate('ChildDetails') }} />
      <ScrollView contentContainerStyle={styles.content}>

        {/* Family rings */}
        <LinearGradient colors={['#1a0533', '#3b1278', '#6C3AE3']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ringCard}>
          <Text style={styles.ringCardTitle}>Family Screen Time</Text>
          <View style={styles.ringsRow}>
            {[
              { emoji: '👨', name: 'Alex',  time: '4h 12m', pct: 70, color: '#38bdf8' },
              { emoji: '🧒', name: 'Sam',   time: '2h 30m', pct: 42, color: '#34d399' },
              { emoji: '👦', name: 'Rahul', time: '5h 10m', pct: 87, color: '#fb923c' },
            ].map(m => (
              <View key={m.name} style={styles.ringItem}>
                <ProgressRing radius={52} stroke={9} progress={m.pct} color={m.color}>
                  <Text style={{ fontSize: 22 }}>{m.emoji}</Text>
                </ProgressRing>
                <Text style={styles.ringName}>{m.name}</Text>
                <Text style={styles.ringTime}>{m.time}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Alert */}
        <View style={[styles.alert, { backgroundColor: isDark ? '#431407' : '#fff7ed' }]}>
          <Text style={styles.alertIcon}>⚠️</Text>
          <View style={styles.alertBody}>
            <Text style={[styles.alertTitle, { color: isDark ? '#fed7aa' : '#9a3412' }]}>Rahul near daily limit</Text>
            <Text style={[styles.alertSub,   { color: isDark ? '#fdba74' : '#c2410c' }]}>87% of 6h daily budget used</Text>
          </View>
          <TouchableOpacity onPress={() => navigate('ParentPanel')} style={styles.alertBtn}>
            <Text style={styles.alertBtnText}>Manage</Text>
          </TouchableOpacity>
        </View>

        {/* Members */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>CHILDREN</Text>
        <MemberRow name="Sam"   role="iPad · 2h 30m today · School active"   emoji="🧒" onPress={() => navigate('ParentPanel')} />
        <MemberRow name="Rahul" role="Android · 5h 10m · Near limit ⚠️"      emoji="👦" onPress={() => navigate('ParentPanel')} />

        <TouchableOpacity onPress={() => navigate('FaceScanOverlay')} style={styles.scanBtn} activeOpacity={0.85}>
          <LinearGradient colors={['#6C3AE3', '#0EA5E9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.scanBtnGradient}>
            <Text style={styles.scanBtnText}>📷 Face Scan to Identify User</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 90 }} />
      </ScrollView>
      <BottomNavigation tabs={tabs} activeTab={activeTab} onTabChange={(id) => {
        setActiveTab(id);
        if (id === 'family')   navigate('FamilyOverview');
        if (id === 'stats')    navigate('StatsScreen');
        if (id === 'settings') navigate('SettingsScreen');
      }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container:       { flex: 1 },
  content:         { padding: 20 },
  ringCard:        { borderRadius: 24, padding: 22, marginBottom: 18, shadowColor: '#6C3AE3', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 },
  ringCardTitle:   { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600', marginBottom: 18, letterSpacing: 0.5 },
  ringsRow:        { flexDirection: 'row', justifyContent: 'space-around' },
  ringItem:        { alignItems: 'center', gap: 8 },
  ringName:        { fontSize: 13, fontWeight: '700', color: '#fff' },
  ringTime:        { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  alert:           { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: '#f97316', marginBottom: 20, gap: 12 },
  alertIcon:       { fontSize: 22 },
  alertBody:       { flex: 1 },
  alertTitle:      { fontWeight: '700', fontSize: 14 },
  alertSub:        { fontSize: 12, marginTop: 2 },
  alertBtn:        { backgroundColor: '#f97316', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  alertBtnText:    { color: '#fff', fontWeight: '700', fontSize: 13 },
  sectionLabel:    { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 12 },
  scanBtn:         { borderRadius: 18, overflow: 'hidden', shadowColor: '#6C3AE3', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6, marginTop: 8 },
  scanBtnGradient: { paddingVertical: 18, alignItems: 'center' },
  scanBtnText:     { color: '#fff', fontWeight: '800', fontSize: 16 },
});

export default ParentHome;

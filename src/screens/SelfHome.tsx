import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/Header';
import { ProgressRing } from '../components/ProgressRing';
import { BottomNavigation } from '../components/BottomNavigation';

interface Props { navigate: (screen: string) => void; }

const SelfHome: React.FC<Props> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState('home');
  const tabs = [
    { id: 'home',     label: 'Home',     icon: '🏠' },
    { id: 'stats',    label: 'Stats',    icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <View style={styles.container}>
      <Header
        showLogo
        title="SelfHome"
        rightAction={{ icon: '🔔', onPress: () => {} }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Greeting */}
        <LinearGradient colors={['#1a0533', '#6C3AE3', '#0EA5E9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.greetingCard}>
          <View>
            <Text style={styles.greetingText}>Good Morning,</Text>
            <Text style={styles.greetingName}>Alex 👋</Text>
          </View>
          <View style={styles.avatarCircle}><Text style={styles.avatarEmoji}>👨</Text></View>
        </LinearGradient>

        {/* Ring */}
        <View style={styles.ringCard}>
          <ProgressRing radius={110} stroke={16} progress={65} color="#6C3AE3">
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.timeValue}>4h 12m</Text>
              <Text style={styles.timeLabel}>Screen time today</Text>
            </View>
          </ProgressRing>
          <View style={styles.ringMeta}>
            <Text style={styles.ringMetaText}>65% of daily limit used</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <LinearGradient colors={['#6C3AE3', '#8b5cf6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statCard}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statTitle}>Focus</Text>
            <Text style={styles.statVal}>2h 45m</Text>
          </LinearGradient>
          <LinearGradient colors={['#0EA5E9', '#38bdf8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statCard}>
            <Text style={styles.statIcon}>🌙</Text>
            <Text style={styles.statTitle}>Downtime</Text>
            <Text style={styles.statVal}>10:00 PM</Text>
          </LinearGradient>
        </View>

        {/* App blocked shortcut */}
        <TouchableOpacity onPress={() => navigate('AppBlocked')} style={styles.blockedBtn} activeOpacity={0.85}>
          <Text style={styles.blockedBtnText}>🔒 View Blocked Apps</Text>
        </TouchableOpacity>

        {/* Top apps */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Apps</Text>
            <TouchableOpacity onPress={() => navigate('StatsScreen')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          {[
            { name: 'Instagram', icon: '📸', time: '1h 20m', pct: 66 },
            { name: 'Twitter / X', icon: '🐦', time: '45m', pct: 30 },
            { name: 'YouTube', icon: '▶️', time: '30m', pct: 20 },
          ].map(app => (
            <View key={app.name} style={styles.appRow}>
              <View style={styles.appIcon}><Text style={{ fontSize: 22 }}>{app.icon}</Text></View>
              <View style={styles.appInfo}>
                <Text style={styles.appName}>{app.name}</Text>
                <View style={styles.appBarTrack}>
                  <LinearGradient colors={['#6C3AE3', '#0EA5E9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.appBarFill, { width: `${app.pct}%` as any }]} />
                </View>
              </View>
              <Text style={styles.appTime}>{app.time}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>
      <BottomNavigation tabs={tabs} activeTab={activeTab} onTabChange={(id) => {
        setActiveTab(id);
        if (id === 'stats') navigate('StatsScreen');
        if (id === 'settings') navigate('SettingsScreen');
      }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20 },
  greetingCard: { borderRadius: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, shadowColor: '#6C3AE3', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  greetingText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500' },
  greetingName: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 4 },
  avatarCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 26 },
  ringCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 4 },
  timeValue: { fontSize: 30, fontWeight: '800', color: '#0f172a' },
  timeLabel: { fontSize: 12, color: '#64748b', marginTop: 4 },
  ringMeta: { marginTop: 14 },
  ringMetaText: { fontSize: 13, color: '#6C3AE3', fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 14, marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 18, padding: 18, shadowColor: '#6C3AE3', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  statIcon: { fontSize: 24, marginBottom: 6 },
  statTitle: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '500', marginBottom: 4 },
  statVal: { color: '#fff', fontSize: 16, fontWeight: '800' },
  blockedBtn: { backgroundColor: '#1e293b', borderRadius: 14, padding: 14, alignItems: 'center', marginBottom: 20 },
  blockedBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  section: { backgroundColor: '#fff', borderRadius: 20, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#0f172a' },
  seeAll: { color: '#6C3AE3', fontWeight: '600', fontSize: 14 },
  appRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  appIcon: { width: 42, height: 42, borderRadius: 10, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  appInfo: { flex: 1 },
  appName: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginBottom: 6 },
  appBarTrack: { height: 5, backgroundColor: '#e2e8f0', borderRadius: 3, overflow: 'hidden' },
  appBarFill: { height: 5, borderRadius: 3 },
  appTime: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
});

export default SelfHome;

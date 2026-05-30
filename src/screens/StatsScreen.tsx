import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ProgressRing } from '../components/ProgressRing';
import { BottomNavigation } from '../components/BottomNavigation';

interface Props { navigate: (screen: string) => void; }

const bars = [
  { name: 'Mon', value: 75 }, { name: 'Tue', value: 60 }, { name: 'Wed', value: 90 },
  { name: 'Thu', value: 45 }, { name: 'Fri', value: 80 }, { name: 'Sat', value: 95 }, { name: 'Sun', value: 30 },
];

const StatsScreen: React.FC<Props> = ({ navigate }) => {
  const tabs = [{ id: 'home', label: 'Home', icon: '🏠' }, { id: 'stats', label: 'Stats', icon: '📊' }, { id: 'settings', label: 'Settings', icon: '⚙️' }];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Stats</Text>

        <View style={styles.ringsRow}>
          <View style={styles.ringItem}>
            <ProgressRing radius={60} stroke={10} progress={65} color="#0ea5e9">
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#0f172a' }}>4h 12m</Text>
            </ProgressRing>
            <Text style={styles.ringLabel}>Today</Text>
          </View>
          <View style={styles.ringItem}>
            <ProgressRing radius={60} stroke={10} progress={72} color="#8b5cf6">
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#0f172a' }}>28h</Text>
            </ProgressRing>
            <Text style={styles.ringLabel}>This Week</Text>
          </View>
          <View style={styles.ringItem}>
            <ProgressRing radius={60} stroke={10} progress={58} color="#10b981">
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#0f172a' }}>110h</Text>
            </ProgressRing>
            <Text style={styles.ringLabel}>This Month</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>DAILY USAGE THIS WEEK</Text>
        <View style={styles.barChart}>
          {bars.map(b => (
            <View key={b.name} style={styles.barItem}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { height: `${b.value}%` as any, backgroundColor: b.value > 80 ? '#ef4444' : '#0ea5e9' }]} />
              </View>
              <Text style={styles.barLabel}>{b.name}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>TOP APPS THIS WEEK</Text>
        {[
          { name: 'Instagram', icon: '📸', time: '8h 20m', pct: 72 },
          { name: 'YouTube', icon: '▶️', time: '5h 45m', pct: 50 },
          { name: 'Twitter', icon: '🐦', time: '3h 10m', pct: 35 },
        ].map(app => (
          <View key={app.name} style={styles.appStat}>
            <View style={styles.appStatLeft}>
              <View style={styles.appStatIcon}><Text>{app.icon}</Text></View>
              <View>
                <Text style={styles.appStatName}>{app.name}</Text>
                <Text style={styles.appStatTime}>{app.time}</Text>
              </View>
            </View>
            <View style={styles.appStatBarTrack}>
              <View style={[styles.appStatBarFill, { width: `${app.pct}%` as any }]} />
            </View>
          </View>
        ))}
        <View style={{ height: 90 }} />
      </ScrollView>
      <BottomNavigation tabs={tabs} activeTab="stats" onTabChange={(id) => {
        if (id === 'home') navigate('SelfHome');
        if (id === 'settings') navigate('SettingsScreen');
      }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 24 },
  heading: { fontSize: 30, fontWeight: '800', color: '#0f172a', marginBottom: 24 },
  ringsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 32 },
  ringItem: { alignItems: 'center', gap: 8 },
  ringLabel: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#94a3b8', letterSpacing: 1, marginBottom: 14 },
  barChart: { flexDirection: 'row', justifyContent: 'space-between', height: 120, marginBottom: 32, alignItems: 'flex-end' },
  barItem: { flex: 1, alignItems: 'center', gap: 6 },
  barTrack: { flex: 1, width: 24, backgroundColor: '#e2e8f0', borderRadius: 8, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: 8 },
  barLabel: { fontSize: 10, color: '#94a3b8', fontWeight: '600' },
  appStat: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  appStatLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  appStatIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center', fontSize: 20 },
  appStatName: { fontSize: 15, fontWeight: '600', color: '#0f172a' },
  appStatTime: { fontSize: 12, color: '#64748b' },
  appStatBarTrack: { height: 6, backgroundColor: '#e2e8f0', borderRadius: 3 },
  appStatBarFill: { height: 6, backgroundColor: '#0ea5e9', borderRadius: 3 },
});

export default StatsScreen;

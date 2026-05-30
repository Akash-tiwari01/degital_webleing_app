import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AppRow } from '../components/AppRow';

interface Props { navigate: (screen: string) => void; }

const SelfRules: React.FC<Props> = ({ navigate }) => {
  const [apps, setApps] = useState([
    { id: 1, name: 'Instagram', icon: '📸', blocked: false },
    { id: 2, name: 'TikTok', icon: '🎵', blocked: true },
    { id: 3, name: 'YouTube', icon: '▶️', blocked: false },
    { id: 4, name: 'Games', icon: '🎮', blocked: false },
    { id: 5, name: 'Twitter / X', icon: '🐦', blocked: false },
  ]);

  const toggle = (id: number) => setApps(apps.map(a => a.id === id ? { ...a, blocked: !a.blocked } : a));

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigate('SelfGoals')} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>App Rules</Text>

      <View style={styles.tip}>
        <Text style={styles.tipIcon}>💡</Text>
        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>AI Tip</Text>
          <Text style={styles.tipText}>Limiting social media during work hours increases focus by 40%.</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>DISTRACTING APPS</Text>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
        {apps.map(app => (
          <AppRow key={app.id} appName={app.name} icon={app.icon} blocked={app.blocked} onToggle={() => toggle(app.id)} />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.btn} onPress={() => navigate('SelfFocusSchedule')} activeOpacity={0.85}>
        <Text style={styles.btnText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 24 },
  back: { marginBottom: 20 },
  backText: { color: '#64748b', fontSize: 16 },
  heading: { fontSize: 30, fontWeight: '800', color: '#0f172a', marginBottom: 20 },
  tip: {
    flexDirection: 'row', backgroundColor: '#eff6ff', padding: 16, borderRadius: 14,
    borderLeftWidth: 4, borderLeftColor: '#3b82f6', marginBottom: 24, gap: 12,
  },
  tipIcon: { fontSize: 22 },
  tipContent: { flex: 1 },
  tipTitle: { fontWeight: '700', color: '#1e3a8a', marginBottom: 4 },
  tipText: { color: '#1e40af', fontSize: 13, lineHeight: 20 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#94a3b8', letterSpacing: 1, marginBottom: 12 },
  list: { flex: 1, marginBottom: 16 },
  btn: {
    backgroundColor: '#0f172a', paddingVertical: 18, borderRadius: 18, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 4,
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});

export default SelfRules;

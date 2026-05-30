import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ProgressRing } from '../components/ProgressRing';
import { AppRow } from '../components/AppRow';
import { BottomNavigation } from '../components/BottomNavigation';
import { useState } from 'react';

interface Props { navigate: (screen: string) => void; }

const ParentPanel: React.FC<Props> = ({ navigate }) => {
  const tabs = [{ id: 'home', label: 'Home', icon: '🏠' }, { id: 'family', label: 'Family', icon: '👨‍👩‍👧' }];
  const [apps, setApps] = useState([
    { id: 1, name: 'YouTube', icon: '▶️', blocked: false },
    { id: 2, name: 'TikTok', icon: '🎵', blocked: true },
    { id: 3, name: 'Games', icon: '🎮', blocked: false },
  ]);
  const toggle = (id: number) => setApps(apps.map(a => a.id === id ? { ...a, blocked: !a.blocked } : a));

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigate('ParentHome')} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.profileRow}>
          <View style={styles.avatar}><Text style={styles.avatarEmoji}>🧒</Text></View>
          <View>
            <Text style={styles.childName}>Sam</Text>
            <Text style={styles.childSub}>iPad · Child Mode</Text>
          </View>
        </View>

        <View style={styles.ringRow}>
          <ProgressRing radius={70} stroke={12} progress={45} color="#f59e0b">
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#0f172a' }}>2h 30m</Text>
              <Text style={{ fontSize: 10, color: '#64748b' }}>used</Text>
            </View>
          </ProgressRing>
          <View style={styles.ringStats}>
            <Text style={styles.stat}>Daily Limit: <Text style={styles.statBold}>6h</Text></Text>
            <Text style={styles.stat}>Remaining: <Text style={styles.statBold}>3h 30m</Text></Text>
            <Text style={styles.stat}>Apps used: <Text style={styles.statBold}>8</Text></Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>APP RULES</Text>
        {apps.map(a => <AppRow key={a.id} appName={a.name} icon={a.icon} blocked={a.blocked} onToggle={() => toggle(a.id)} />)}

        <TouchableOpacity style={styles.editBtn} onPress={() => navigate('EditChildRules')} activeOpacity={0.85}>
          <Text style={styles.editBtnText}>Edit All Rules</Text>
        </TouchableOpacity>
        <View style={styles.bottomSpacer} />
      </ScrollView>
      <BottomNavigation tabs={tabs} activeTab="family" onTabChange={(id) => {
        if (id === 'home') navigate('ParentHome');
        if (id === 'family') navigate('FamilyTab');
      }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 24 },
  back: { marginBottom: 20 },
  backText: { color: '#64748b', fontSize: 16 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 28 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 34 },
  childName: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
  childSub: { color: '#64748b', fontSize: 14 },
  ringRow: { flexDirection: 'row', alignItems: 'center', gap: 24, backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  ringStats: { gap: 8 },
  stat: { color: '#64748b', fontSize: 14 },
  statBold: { fontWeight: '700', color: '#0f172a' },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#94a3b8', letterSpacing: 1, marginBottom: 12 },
  editBtn: { backgroundColor: '#0f172a', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 8 },
  editBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  bottomSpacer: { height: 90 },
});

export default ParentPanel;

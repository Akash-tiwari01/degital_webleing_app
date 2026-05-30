import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { AppRow } from '../components/AppRow';
import { SchoolHoursCard } from '../components/SchoolHoursCard';

interface Props { navigate: (screen: string) => void; }

const EditChildRules: React.FC<Props> = ({ navigate }) => {
  const [apps, setApps] = useState([
    { id: 1, name: 'YouTube', icon: '▶️', blocked: false },
    { id: 2, name: 'TikTok', icon: '🎵', blocked: true },
    { id: 3, name: 'Games', icon: '🎮', blocked: false },
    { id: 4, name: 'Social Media', icon: '💬', blocked: true },
    { id: 5, name: 'Streaming', icon: '📺', blocked: false },
  ]);
  const [schoolEnabled, setSchoolEnabled] = useState(true);
  const toggle = (id: number) => setApps(apps.map(a => a.id === id ? { ...a, blocked: !a.blocked } : a));

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigate('ParentPanel')} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>Edit Sam's Rules</Text>
        <Text style={styles.sectionLabel}>APP PERMISSIONS</Text>
        {apps.map(a => <AppRow key={a.id} appName={a.name} icon={a.icon} blocked={a.blocked} onToggle={() => toggle(a.id)} />)}
        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>SCHOOL SCHEDULE</Text>
        <SchoolHoursCard enabled={schoolEnabled} onToggle={() => setSchoolEnabled(!schoolEnabled)} />
        <TouchableOpacity style={styles.saveBtn} onPress={() => navigate('ParentPanel')} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Save Changes ✓</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 24 },
  back: { marginBottom: 20 },
  backText: { color: '#64748b', fontSize: 16 },
  heading: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 20 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#94a3b8', letterSpacing: 1, marginBottom: 12 },
  saveBtn: { backgroundColor: '#10b981', paddingVertical: 18, borderRadius: 18, alignItems: 'center', marginTop: 8 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

export default EditChildRules;

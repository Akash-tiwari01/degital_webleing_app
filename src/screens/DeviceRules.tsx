import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AppRow } from '../components/AppRow';
import { SchoolHoursCard } from '../components/SchoolHoursCard';

interface Props { navigate: (screen: string) => void; }

const DeviceRules: React.FC<Props> = ({ navigate }) => {
  const [apps, setApps] = useState([
    { id: 1, name: 'YouTube', icon: '▶️', blocked: false },
    { id: 2, name: 'Games', icon: '🎮', blocked: false },
    { id: 3, name: 'Social Media', icon: '💬', blocked: true },
  ]);
  const [schoolEnabled, setSchoolEnabled] = useState(true);
  const toggle = (id: number) => setApps(apps.map(a => a.id === id ? { ...a, blocked: !a.blocked } : a));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Device Rules</Text>
      <Text style={styles.sub}>Final rules for this child device.</Text>
      {apps.map(app => <AppRow key={app.id} appName={app.name} icon={app.icon} blocked={app.blocked} onToggle={() => toggle(app.id)} />)}
      <View style={styles.spacer} />
      <SchoolHoursCard enabled={schoolEnabled} onToggle={() => setSchoolEnabled(!schoolEnabled)} />
      <TouchableOpacity style={styles.btn} onPress={() => navigate('ChildHome')} activeOpacity={0.85}>
        <Text style={styles.btnText}>Finish Setup 🎉</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 24, paddingBottom: 48 },
  heading: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  sub: { color: '#64748b', fontSize: 14, marginBottom: 20 },
  spacer: { height: 16 },
  btn: { backgroundColor: '#7c3aed', paddingVertical: 18, borderRadius: 18, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
export default DeviceRules;

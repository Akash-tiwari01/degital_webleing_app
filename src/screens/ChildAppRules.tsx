import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AppRow } from '../components/AppRow';

interface Props { navigate: (screen: string) => void; }

const ChildAppRules: React.FC<Props> = ({ navigate }) => {
  const [apps, setApps] = useState([
    { id: 1, name: 'YouTube', icon: '▶️', blocked: false },
    { id: 2, name: 'TikTok', icon: '🎵', blocked: true },
    { id: 3, name: 'Games', icon: '🎮', blocked: false },
    { id: 4, name: 'Social Media', icon: '💬', blocked: true },
    { id: 5, name: 'Streaming', icon: '📺', blocked: false },
  ]);
  const toggle = (id: number) => setApps(apps.map(a => a.id === id ? { ...a, blocked: !a.blocked } : a));

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigate('ChildFaceEnroll')} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Sam's App Rules</Text>
      <Text style={styles.sub}>Control which apps Sam can access.</Text>
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {apps.map(app => (
          <AppRow key={app.id} appName={app.name} icon={app.icon} blocked={app.blocked} onToggle={() => toggle(app.id)} />
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.btn} onPress={() => navigate('ChildSchoolHours')} activeOpacity={0.85}>
        <Text style={styles.btnText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 24 },
  back: { marginBottom: 20 },
  backText: { color: '#64748b', fontSize: 16 },
  heading: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  sub: { color: '#64748b', fontSize: 14, marginBottom: 20 },
  list: { flex: 1, marginBottom: 16 },
  btn: { backgroundColor: '#0f172a', paddingVertical: 18, borderRadius: 18, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});

export default ChildAppRules;

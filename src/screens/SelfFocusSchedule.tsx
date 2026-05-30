import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SchoolHoursCard } from '../components/SchoolHoursCard';

interface Props { navigate: (screen: string) => void; }

const SelfFocusSchedule: React.FC<Props> = ({ navigate }) => {
  const [enabled, setEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigate('SelfRules')} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Focus Schedule</Text>
      <Text style={styles.sub}>Set your work / focus hours so we know when to lock distractions.</Text>

      <SchoolHoursCard enabled={enabled} onToggle={() => setEnabled(!enabled)} />

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>🎯 What happens during focus hours?</Text>
        <Text style={styles.infoText}>• Blocked apps will be inaccessible{'\n'}• Notifications are silenced{'\n'}• A daily summary is sent at end of day</Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={() => navigate('SelfHome')} activeOpacity={0.85}>
        <Text style={styles.btnText}>Finish Setup 🎉</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 24 },
  back: { marginBottom: 20 },
  backText: { color: '#64748b', fontSize: 16 },
  heading: { fontSize: 30, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  sub: { color: '#64748b', fontSize: 15, marginBottom: 28, lineHeight: 24 },
  infoBox: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 24, borderLeftWidth: 4, borderLeftColor: '#10b981' },
  infoTitle: { fontWeight: '700', color: '#0f172a', marginBottom: 10, fontSize: 15 },
  infoText: { color: '#475569', lineHeight: 26, fontSize: 14 },
  btn: {
    backgroundColor: '#0ea5e9', paddingVertical: 18, borderRadius: 18, alignItems: 'center',
    shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6,
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});

export default SelfFocusSchedule;

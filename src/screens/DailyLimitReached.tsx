import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ProgressRing } from '../components/ProgressRing';

interface Props { navigate: (screen: string) => void; }

const DailyLimitReached: React.FC<Props> = ({ navigate }) => {
  return (
    <View style={styles.container}>
      <ProgressRing radius={100} stroke={14} progress={100} color="#ef4444">
        <Text style={styles.ringEmoji}>⏰</Text>
      </ProgressRing>
      <Text style={styles.heading}>Daily Limit Reached</Text>
      <Text style={styles.sub}>You've used all 6 hours of screen time for today. Great discipline!</Text>
      <View style={styles.statsRow}>
        <View style={styles.stat}><Text style={styles.statVal}>6h 0m</Text><Text style={styles.statLbl}>Used today</Text></View>
        <View style={styles.stat}><Text style={styles.statVal}>12 apps</Text><Text style={styles.statLbl}>Opened</Text></View>
      </View>
      <TouchableOpacity style={styles.extendBtn} onPress={() => navigate('ParentUnlockFlow')} activeOpacity={0.85}>
        <Text style={styles.extendBtnText}>Request Extension</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigate('SelfHome')} style={styles.backBtn}>
        <Text style={styles.backBtnText}>Accept & Close</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff5f5', padding: 32, alignItems: 'center', justifyContent: 'center' },
  ringEmoji: { fontSize: 60 },
  heading: { fontSize: 26, fontWeight: '800', color: '#0f172a', marginTop: 24, marginBottom: 10, textAlign: 'center' },
  sub: { color: '#64748b', fontSize: 15, textAlign: 'center', marginBottom: 32, lineHeight: 24 },
  statsRow: { flexDirection: 'row', gap: 20, marginBottom: 32 },
  stat: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 18, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statVal: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  statLbl: { color: '#94a3b8', fontSize: 12 },
  extendBtn: { width: '100%', backgroundColor: '#ef4444', paddingVertical: 18, borderRadius: 18, alignItems: 'center', marginBottom: 14 },
  extendBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  backBtn: {},
  backBtnText: { color: '#64748b', fontSize: 15 },
});
export default DailyLimitReached;

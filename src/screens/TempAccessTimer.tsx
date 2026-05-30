import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ProgressRing } from '../components/ProgressRing';

interface Props { navigate: (screen: string) => void; }

const TempAccessTimer: React.FC<Props> = ({ navigate }) => {
  const [seconds, setSeconds] = useState(300);

  useEffect(() => {
    const t = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(t); navigate('AppBlocked'); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = (seconds / 300) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Temporary Access</Text>
      <Text style={styles.sub}>TikTok is temporarily unlocked. Enjoy responsibly!</Text>

      <ProgressRing radius={120} stroke={16} progress={progress} color="#f59e0b">
        <View style={styles.ringContent}>
          <Text style={styles.timer}>{mins}:{secs.toString().padStart(2,'0')}</Text>
          <Text style={styles.timerLabel}>remaining</Text>
        </View>
      </ProgressRing>

      <Text style={styles.appName}>🎵 TikTok</Text>
      <Text style={styles.note}>App will be locked when timer ends.</Text>

      <TouchableOpacity style={styles.endBtn} onPress={() => navigate('AppBlocked')} activeOpacity={0.85}>
        <Text style={styles.endBtnText}>End Early</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffbeb', alignItems: 'center', justifyContent: 'center', padding: 32 },
  heading: { fontSize: 26, fontWeight: '800', color: '#0f172a', marginBottom: 8, textAlign: 'center' },
  sub: { color: '#64748b', fontSize: 14, marginBottom: 40, textAlign: 'center', lineHeight: 22 },
  ringContent: { alignItems: 'center' },
  timer: { fontSize: 42, fontWeight: '800', color: '#0f172a' },
  timerLabel: { color: '#64748b', fontSize: 13, marginTop: 4 },
  appName: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginTop: 28, marginBottom: 8 },
  note: { color: '#94a3b8', fontSize: 13, marginBottom: 40 },
  endBtn: { backgroundColor: '#0f172a', paddingVertical: 16, paddingHorizontal: 40, borderRadius: 18 },
  endBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
export default TempAccessTimer;

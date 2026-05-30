import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

interface Props { navigate: (screen: string) => void; }

const ParentUnlockFlow: React.FC<Props> = ({ navigate }) => {
  const [step, setStep] = useState<'scan'|'approve'>('scan');
  const [progress, setProgress] = useState(0);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (step !== 'scan') return;
    Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1.07, duration: 600, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
    ])).start();
    const t = setInterval(() => setProgress(p => {
      if (p >= 100) { clearInterval(t); setStep('approve'); return 100; }
      return p + 4;
    }), 60);
    return () => clearInterval(t);
  }, [step]);

  if (step === 'approve') {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>👨</Text>
        <Text style={styles.heading}>Parent Verified ✅</Text>
        <Text style={styles.sub}>Alex, do you want to allow Sam to use TikTok?</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.denyBtn} onPress={() => navigate('AppBlocked')}>
            <Text style={styles.denyText}>Deny</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.allowBtn} onPress={() => navigate('TempAccessTimer')}>
            <Text style={styles.allowText}>Allow 5 min</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Parent Verification</Text>
      <Text style={styles.sub}>Parent, please scan your face to approve access.</Text>
      <Animated.View style={[styles.ring, { transform: [{ scale: pulse }] }]}>
        <View style={styles.face}><Text style={styles.faceEmoji}>👨</Text></View>
      </Animated.View>
      <Text style={styles.percent}>{progress}%</Text>
      <Text style={styles.status}>Verifying parent identity...</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center', padding: 32 },
  heading: { fontSize: 26, fontWeight: '800', color: '#f1f5f9', marginBottom: 10, textAlign: 'center' },
  sub: { color: '#94a3b8', fontSize: 14, textAlign: 'center', marginBottom: 48, lineHeight: 22 },
  ring: { width: 200, height: 200, borderRadius: 100, borderWidth: 3, borderColor: '#38bdf8', alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  face: { width: 160, height: 160, borderRadius: 80, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center' },
  faceEmoji: { fontSize: 80 },
  percent: { fontSize: 40, fontWeight: '800', color: '#38bdf8', marginBottom: 8 },
  status: { color: '#94a3b8', fontSize: 14 },
  emoji: { fontSize: 80, marginBottom: 16 },
  row: { flexDirection: 'row', gap: 16, width: '100%' },
  denyBtn: { flex: 1, backgroundColor: '#1e293b', paddingVertical: 18, borderRadius: 18, alignItems: 'center' },
  denyText: { color: '#94a3b8', fontWeight: '700', fontSize: 16 },
  allowBtn: { flex: 1, backgroundColor: '#22c55e', paddingVertical: 18, borderRadius: 18, alignItems: 'center' },
  allowText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
export default ParentUnlockFlow;

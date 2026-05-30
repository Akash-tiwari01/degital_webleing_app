import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props { navigate: (screen: string) => void; }

const ProfileIdentified: React.FC<Props> = ({ navigate }) => {
  return (
    <View style={styles.container}>
      <View style={styles.successRing}>
        <Text style={styles.emoji}>😊</Text>
      </View>
      <View style={styles.checkBadge}>
        <Text style={styles.checkText}>✓</Text>
      </View>
      <Text style={styles.heading}>Hi, Alex! 👋</Text>
      <Text style={styles.sub}>Profile identified successfully. Welcome back!</Text>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Today's screen time</Text>
        <Text style={styles.cardValue}>2h 45m</Text>
        <Text style={styles.cardHint}>Daily limit: 6h</Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => navigate('SelfHome')} activeOpacity={0.85}>
        <Text style={styles.btnText}>Continue to App</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigate('ProfilePicker')} style={styles.switchBtn}>
        <Text style={styles.switchText}>Switch Profile</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center', padding: 32 },
  successRing: { width: 160, height: 160, borderRadius: 80, borderWidth: 4, borderColor: '#22c55e', alignItems: 'center', justifyContent: 'center', marginBottom: 0 },
  emoji: { fontSize: 80 },
  checkBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center', marginTop: -18, marginBottom: 24 },
  checkText: { color: '#fff', fontWeight: '800', fontSize: 18 },
  heading: { fontSize: 30, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  sub: { color: '#64748b', fontSize: 15, marginBottom: 32 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '100%', alignItems: 'center', marginBottom: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  cardLabel: { color: '#94a3b8', fontSize: 13, marginBottom: 6 },
  cardValue: { fontSize: 36, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  cardHint: { color: '#22c55e', fontSize: 13, fontWeight: '600' },
  btn: { width: '100%', backgroundColor: '#22c55e', paddingVertical: 18, borderRadius: 18, alignItems: 'center', marginBottom: 16 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  switchBtn: {},
  switchText: { color: '#64748b', fontSize: 15 },
});
export default ProfileIdentified;

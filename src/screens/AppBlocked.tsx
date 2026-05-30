import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props { 
  navigate: (screen: string) => void; 
  appName?: string;
}

const AppBlocked: React.FC<Props> = ({ navigate, appName = 'App' }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.lockEmoji}>🔒</Text>
      <Text style={styles.heading}>App Blocked</Text>
      <Text style={styles.appName}>{appName}</Text>
      <Text style={styles.sub}>This app is blocked during your current schedule.</Text>
      <View style={styles.altBox}>
        <Text style={styles.altTitle}>🤖 AI Suggests Instead:</Text>
        <TouchableOpacity style={styles.altItem}>
          <Text style={styles.altItemText}>📚 Kindle — Read for 20 min</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.altItem}>
          <Text style={styles.altItemText}>🧘 Calm — 5-min meditation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.altItem}>
          <Text style={styles.altItemText}>🎵 Spotify — Music focus mode</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.unlockBtn} onPress={() => navigate('ParentUnlockFlow')} activeOpacity={0.85}>
        <Text style={styles.unlockBtnText}>Request Parent Unlock</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigate('SelfHome')} style={styles.backBtn}>
        <Text style={styles.backBtnText}>← Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 32, alignItems: 'center', justifyContent: 'center' },
  lockEmoji: { fontSize: 80, marginBottom: 16 },
  heading: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  appName: { fontSize: 18, color: '#ef4444', fontWeight: '700', marginBottom: 12 },
  sub: { color: '#64748b', fontSize: 15, textAlign: 'center', marginBottom: 32, lineHeight: 24 },
  altBox: { backgroundColor: '#f8fafc', borderRadius: 18, padding: 20, width: '100%', marginBottom: 28, gap: 10 },
  altTitle: { fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  altItem: { backgroundColor: '#fff', borderRadius: 12, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  altItemText: { color: '#1e293b', fontWeight: '600' },
  unlockBtn: { width: '100%', backgroundColor: '#0f172a', paddingVertical: 18, borderRadius: 18, alignItems: 'center', marginBottom: 14 },
  unlockBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  backBtn: {},
  backBtnText: { color: '#64748b', fontSize: 15 },
});
export default AppBlocked;

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MemberRow } from '../components/MemberRow';

interface Props { navigate: (screen: string) => void; }

const ProfilePicker: React.FC<Props> = ({ navigate }) => {
  const profiles = [
    { name: 'Alex', role: 'Parent · Admin', emoji: '👨', screen: 'PinEntry' },
    { name: 'Sam', role: 'Child · Limited', emoji: '🧒', screen: 'PinEntry' },
  ];
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigate('FaceScanOverlay')} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Select Profile</Text>
      <Text style={styles.sub}>Who's using this device right now?</Text>
      <View style={styles.list}>
        {profiles.map(p => (
          <MemberRow key={p.name} name={p.name} role={p.role} emoji={p.emoji} onPress={() => navigate(p.screen)} />
        ))}
      </View>
      <TouchableOpacity onPress={() => navigate('FaceScanOverlay')} style={styles.scanBtn} activeOpacity={0.8}>
        <Text style={styles.scanBtnText}>📷 Use Face Scan Instead</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 24 },
  back: { marginBottom: 24 },
  backText: { color: '#64748b', fontSize: 16 },
  heading: { fontSize: 30, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  sub: { color: '#64748b', fontSize: 15, marginBottom: 32 },
  list: { gap: 12, marginBottom: 32 },
  scanBtn: { backgroundColor: '#f1f5f9', borderRadius: 16, padding: 16, alignItems: 'center' },
  scanBtnText: { color: '#475569', fontWeight: '600', fontSize: 15 },
});
export default ProfilePicker;

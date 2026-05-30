import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface Props { navigate: (screen: string) => void; }

const ChildDeviceDetails: React.FC<Props> = ({ navigate }) => {
  const [name, setName] = useState('');
  const [parentCode, setParentCode] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigate('ModeSelection')} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.badge}>📱 Child Device Mode</Text>
      <Text style={styles.heading}>Device Setup</Text>
      <Text style={styles.sub}>This device belongs to a child. A parent must approve settings.</Text>

      <Text style={styles.label}>Child's Name</Text>
      <TextInput style={styles.input} placeholder="e.g. Sam" value={name} onChangeText={setName} placeholderTextColor="#94a3b8" />

      <Text style={styles.label}>Parent Pairing Code</Text>
      <TextInput style={styles.input} placeholder="6-digit code from parent's app" value={parentCode} onChangeText={setParentCode} keyboardType="numeric" maxLength={6} placeholderTextColor="#94a3b8" />

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>💡 Ask your parent to open the app and tap "Add Child Device" to get the pairing code.</Text>
      </View>

      <TouchableOpacity
        style={[styles.btn, (!name || parentCode.length < 6) && styles.btnDisabled]}
        onPress={() => navigate('ChildDeviceFaceEnroll')}
        disabled={!name || parentCode.length < 6}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>Continue →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 24, paddingBottom: 48 },
  back: { marginBottom: 20 },
  backText: { color: '#64748b', fontSize: 16 },
  badge: { backgroundColor: '#ede9fe', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 16, fontSize: 13, color: '#7c3aed', fontWeight: '600' },
  heading: { fontSize: 30, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  sub: { color: '#64748b', fontSize: 15, marginBottom: 28, lineHeight: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderRadius: 14, padding: 16, fontSize: 16, color: '#0f172a', marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  infoBox: { backgroundColor: '#faf5ff', borderRadius: 14, padding: 16, borderLeftWidth: 4, borderLeftColor: '#7c3aed', marginBottom: 28 },
  infoText: { color: '#4c1d95', fontSize: 13, lineHeight: 22 },
  btn: { backgroundColor: '#7c3aed', paddingVertical: 18, borderRadius: 18, alignItems: 'center' },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});

export default ChildDeviceDetails;

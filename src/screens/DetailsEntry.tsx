import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface Props { navigate: (screen: string) => void; }

const DetailsEntry: React.FC<Props> = ({ navigate }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigate('ModeSelection')} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Your Details</Text>
      <Text style={styles.sub}>Tell us a bit about yourself to personalize your experience.</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Alex Johnson"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#94a3b8"
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 32"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        placeholderTextColor="#94a3b8"
      />

      <TouchableOpacity
        style={[styles.btn, (!name || !age) && styles.btnDisabled]}
        onPress={() => navigate('SelfGoals')}
        disabled={!name || !age}
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
  back: { marginBottom: 24 },
  backText: { color: '#64748b', fontSize: 16 },
  heading: { fontSize: 30, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  sub: { color: '#64748b', fontSize: 15, marginBottom: 32, lineHeight: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 },
  input: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16, fontSize: 16, color: '#0f172a',
    marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0',
  },
  btn: {
    backgroundColor: '#0f172a', paddingVertical: 18, borderRadius: 18, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 4,
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});

export default DetailsEntry;

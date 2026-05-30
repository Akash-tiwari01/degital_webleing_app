import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props { navigate: (screen: string) => void; }

const ChildDetails: React.FC<Props> = ({ navigate }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigate('FamilyOverview')} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Child Details</Text>
      <Text style={styles.sub}>Add your child's info. AI will suggest age-appropriate settings.</Text>

      <Text style={styles.label}>Child's Name</Text>
      <TextInput style={styles.input} placeholder="e.g. Sam" value={name} onChangeText={setName} placeholderTextColor="#94a3b8" />

      <Text style={styles.label}>Age</Text>
      <TextInput style={styles.input} placeholder="e.g. 10" value={age} onChangeText={setAge} keyboardType="numeric" placeholderTextColor="#94a3b8" />

      <View style={styles.tipBox}>
        <Text style={styles.tipIcon}>🤖</Text>
        <Text style={styles.tipText}>AI Tip: For age 8–12, we recommend 2hr/day limits with school hours enforcement.</Text>
      </View>

      <TouchableOpacity
        style={[styles.btn, (!name || !age) && styles.btnDisabled]}
        onPress={async () => {
          try {
            await AsyncStorage.setItem('@pending_child_name', name);
            await AsyncStorage.setItem('@pending_child_age', age);
          } catch (e) {
            console.error(e);
          }
          navigate('ChildFaceEnroll');
        }}
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
  sub: { color: '#64748b', fontSize: 15, marginBottom: 28, lineHeight: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderRadius: 14, padding: 16, fontSize: 16, color: '#0f172a', marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  tipBox: { flexDirection: 'row', gap: 10, backgroundColor: '#fffbeb', padding: 16, borderRadius: 14, borderLeftWidth: 4, borderLeftColor: '#f59e0b', marginBottom: 28 },
  tipIcon: { fontSize: 20 },
  tipText: { flex: 1, color: '#78350f', fontSize: 13, lineHeight: 20 },
  btn: { backgroundColor: '#0f172a', paddingVertical: 18, borderRadius: 18, alignItems: 'center' },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});

export default ChildDetails;

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface Props { navigate: (screen: string) => void; }

const goals = [
  { id: 1, icon: '🎯', title: 'Deep Focus', desc: 'Block distracting apps during work' },
  { id: 2, icon: '😴', title: 'Better Sleep', desc: 'Limit screen time before bed' },
  { id: 3, icon: '🏋️', title: 'Stay Active', desc: 'Reduce sedentary screen time' },
  { id: 4, icon: '📚', title: 'Read More', desc: 'Swap scrolling for reading' },
  { id: 5, icon: '🧘', title: 'Mindfulness', desc: 'Scheduled digital detox breaks' },
  { id: 6, icon: '👨‍👩‍👧', title: 'Family Time', desc: 'Device-free family moments' },
];

const SelfGoals: React.FC<Props> = ({ navigate }) => {
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigate('DetailsEntry')} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Your Goals</Text>
      <Text style={styles.sub}>Pick what matters to you. We'll set up smart rules.</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {goals.map(goal => (
            <TouchableOpacity
              key={goal.id}
              style={[styles.card, selected.includes(goal.id) && styles.cardActive]}
              onPress={() => toggle(goal.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.icon}>{goal.icon}</Text>
              <Text style={[styles.title, selected.includes(goal.id) && styles.titleActive]}>{goal.title}</Text>
              <Text style={styles.desc}>{goal.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={[styles.btn, selected.length === 0 && styles.btnDisabled]}
        onPress={() => navigate('SelfRules')}
        disabled={selected.length === 0}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>Continue ({selected.length} selected)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 24 },
  back: { marginBottom: 20 },
  backText: { color: '#64748b', fontSize: 16 },
  heading: { fontSize: 30, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  sub: { color: '#64748b', fontSize: 15, marginBottom: 24, lineHeight: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  card: {
    width: '47%', backgroundColor: '#fff', padding: 18, borderRadius: 18,
    borderWidth: 2, borderColor: '#f1f5f9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardActive: { borderColor: '#0ea5e9', backgroundColor: '#f0f9ff' },
  icon: { fontSize: 32, marginBottom: 8 },
  title: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  titleActive: { color: '#0284c7' },
  desc: { fontSize: 12, color: '#64748b', lineHeight: 18 },
  btn: {
    backgroundColor: '#0f172a', paddingVertical: 18, borderRadius: 18, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 4,
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});

export default SelfGoals;

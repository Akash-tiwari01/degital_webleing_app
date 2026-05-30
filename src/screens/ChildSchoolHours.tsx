import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SchoolHoursCard } from '../components/SchoolHoursCard';

interface Props { navigate: (screen: string) => void; }

const ChildSchoolHours: React.FC<Props> = ({ navigate }) => {
  const [enabled, setEnabled] = useState(true);

  const handleDone = async () => {
    try {
      const name = await AsyncStorage.getItem('@pending_child_name');
      const age = await AsyncStorage.getItem('@pending_child_age');
      if (name && age) {
        const storedKids = await AsyncStorage.getItem('@family_children');
        let kidsList = [];
        if (storedKids) {
          kidsList = JSON.parse(storedKids);
        } else {
          // Initialize with default static kids first
          kidsList = [
            { name: 'Sam', role: 'iPad · Screen time limited', emoji: '👧' },
            { name: 'Rahul', role: 'Android · School hours active', emoji: '👦' },
          ];
        }
        const ageNum = parseInt(age, 10);
        const newKid = {
          name,
          role: `Age ${age} · Screen time active`,
          emoji: ageNum <= 10 ? '👧' : '👦',
        };
        kidsList.push(newKid);
        await AsyncStorage.setItem('@family_children', JSON.stringify(kidsList));
        
        // Clean up pending states
        await AsyncStorage.removeItem('@pending_child_name');
        await AsyncStorage.removeItem('@pending_child_age');
      }
    } catch (e) {
      console.error(e);
    }
    navigate('FamilyOverview');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigate('ChildAppRules')} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Sam's School Hours</Text>
      <Text style={styles.sub}>During school hours, all non-educational apps will be locked.</Text>
      <SchoolHoursCard enabled={enabled} onToggle={() => setEnabled(!enabled)} />
      <View style={styles.noteBox}>
        <Text style={styles.noteText}>📌 Only educational apps like Google Classroom, Khan Academy will remain accessible during school hours.</Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={handleDone} activeOpacity={0.85}>
        <Text style={styles.btnText}>Done ✓</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 24 },
  back: { marginBottom: 20 },
  backText: { color: '#64748b', fontSize: 16 },
  heading: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  sub: { color: '#64748b', fontSize: 14, marginBottom: 24, lineHeight: 22 },
  noteBox: { backgroundColor: '#f0fdf4', borderRadius: 14, padding: 16, borderLeftWidth: 4, borderLeftColor: '#22c55e', marginBottom: 24 },
  noteText: { color: '#166534', fontSize: 13, lineHeight: 22 },
  btn: { backgroundColor: '#10b981', paddingVertical: 18, borderRadius: 18, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});

export default ChildSchoolHours;

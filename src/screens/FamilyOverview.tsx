import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MemberRow } from '../components/MemberRow';
import { BottomNavigation } from '../components/BottomNavigation';
import { useTheme } from '../components/ThemeContext';

interface Props { navigate: (screen: string) => void; }

const FamilyOverview: React.FC<Props> = ({ navigate }) => {
  const { colors } = useTheme();
  const [kids, setKids] = useState<{ name: string; role: string; emoji: string }[]>([
    { name: 'Sam',   role: 'iPad · Screen time limited',       emoji: '👧' },
    { name: 'Rahul', role: 'Android · School hours active',    emoji: '👦' },
  ]);

  useEffect(() => {
    const loadKids = async () => {
      try {
        const storedKids = await AsyncStorage.getItem('@family_children');
        if (storedKids) {
          setKids(JSON.parse(storedKids));
        } else {
          await AsyncStorage.setItem('@family_children', JSON.stringify(kids));
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadKids();
  }, []);

  const tabs = [
    { id: 'home',    label: 'Home',    icon: '🏠' },
    { id: 'family',  label: 'Family',  icon: '👨‍👩‍👧' },
    { id: 'settings',label: 'Settings',icon: '⚙️' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.heading, { color: colors.text }]}>Family</Text>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>PARENTS</Text>
        <MemberRow name="Alex (You)" role="Organizer" emoji="👨" onPress={() => navigate('ParentHome')} />

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>KIDS</Text>
        {kids.map((kid, idx) => (
          <MemberRow key={idx} name={kid.name} role={kid.role} emoji={kid.emoji} onPress={() => navigate('ChildHome')} />
        ))}

        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}
          onPress={() => navigate('ChildDetails')}
          activeOpacity={0.8}
        >
          <Text style={[styles.addBtnText, { color: colors.textSub }]}>+ Add Child</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavigation tabs={tabs} activeTab="family" onTabChange={(id) => {
        if (id === 'home')     navigate('ParentHome');
        if (id === 'settings') navigate('SettingsScreen');
      }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container:    { flex: 1 },
  content:      { padding: 24, paddingBottom: 100 },
  heading:      { fontSize: 30, fontWeight: '800', marginBottom: 24 },
  sectionLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 12, marginTop: 8 },
  addBtn:       { borderRadius: 16, padding: 18, alignItems: 'center', borderWidth: 2, borderStyle: 'dashed', marginTop: 8 },
  addBtnText:   { fontWeight: '700', fontSize: 16 },
});

export default FamilyOverview;

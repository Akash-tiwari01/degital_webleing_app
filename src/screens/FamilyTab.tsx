import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { MemberRow } from '../components/MemberRow';
import { BottomNavigation } from '../components/BottomNavigation';

interface Props { navigate: (screen: string) => void; }

const FamilyTab: React.FC<Props> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState('family');
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'family', label: 'Family', icon: '👨‍👩‍👧' },
    { id: 'stats', label: 'Stats', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Family</Text>
        <Text style={styles.sectionLabel}>PARENTS</Text>
        <MemberRow name="Alex" role="Organizer · Self Mode" emoji="👨" onPress={() => navigate('SelfHome')} />

        <Text style={[styles.sectionLabel, { marginTop: 16 }]}>CHILDREN</Text>
        <MemberRow name="Sam" role="iPad · 2h 30m today" emoji="🧒" onPress={() => navigate('ParentPanel')} />
        <MemberRow name="Rahul" role="Android · Near limit ⚠️" emoji="👦" onPress={() => navigate('ParentPanel')} />

        <TouchableOpacity style={styles.addBtn} onPress={() => navigate('ChildDetails')} activeOpacity={0.8}>
          <Text style={styles.addBtnText}>+ Add Family Member</Text>
        </TouchableOpacity>
        <View style={styles.bottomSpacer} />
      </ScrollView>
      <BottomNavigation tabs={tabs} activeTab={activeTab} onTabChange={(id) => {
        setActiveTab(id);
        if (id === 'home') navigate('ParentHome');
        if (id === 'stats') navigate('StatsScreen');
        if (id === 'settings') navigate('SettingsScreen');
      }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 24 },
  heading: { fontSize: 30, fontWeight: '800', color: '#0f172a', marginBottom: 24 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#94a3b8', letterSpacing: 1, marginBottom: 12 },
  addBtn: { backgroundColor: '#f1f5f9', borderRadius: 16, padding: 18, alignItems: 'center', borderWidth: 2, borderColor: '#e2e8f0', borderStyle: 'dashed', marginTop: 8 },
  addBtnText: { color: '#64748b', fontWeight: '700', fontSize: 15 },
  bottomSpacer: { height: 90 },
});

export default FamilyTab;

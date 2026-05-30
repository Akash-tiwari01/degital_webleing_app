import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProgressRing } from '../components/ProgressRing';
import { BottomNavigation } from '../components/BottomNavigation';
import { useTheme } from '../components/ThemeContext';

interface Props { navigate: (screen: string) => void; }

const ChildHome: React.FC<Props> = ({ navigate }) => {
  const { colors, isDark } = useTheme();
  const tabs = [
    { id: 'home',  label: 'Home',  icon: '🏠' },
    { id: 'stats', label: 'Stats', icon: '📊' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.greeting, { color: colors.text }]}>Hi, Sam! 👋</Text>
      <Text style={[styles.sub, { color: colors.textSub }]}>Here's your screen time today</Text>

      <View style={styles.ringBox}>
        <ProgressRing radius={130} stroke={20} progress={45} color="#a78bfa">
          <View style={styles.ringContent}>
            <Text style={[styles.timeValue, { color: colors.text }]}>2h 30m</Text>
            <Text style={[styles.timeLabel, { color: colors.textSub }]}>used today</Text>
          </View>
        </ProgressRing>
      </View>

      <View style={[styles.limitBox, { backgroundColor: colors.card }]}>
        <Text style={[styles.limitText, { color: colors.textSub }]}>
          Daily Limit: <Text style={[styles.limitValue, { color: colors.text }]}>6 hours</Text>
        </Text>
        <Text style={styles.limitRemain}>3h 30m remaining</Text>
      </View>

      <View style={[styles.schoolBox, { backgroundColor: isDark ? '#1c1407' : '#fffbeb' }]}>
        <Text style={styles.schoolIcon}>🏫</Text>
        <View>
          <Text style={[styles.schoolTitle, { color: isDark ? '#fde68a' : '#78350f' }]}>School Hours Active</Text>
          <Text style={[styles.schoolSub,   { color: isDark ? '#fcd34d' : '#92400e' }]}>Until 3:00 PM · Some apps locked</Text>
        </View>
      </View>

      <Text style={[styles.viewOnly, { color: colors.textMuted }]}>🔒 View-only mode · Parent-managed</Text>

      <BottomNavigation tabs={tabs} activeTab="home" onTabChange={(id) => {
        if (id === 'stats') navigate('StatsScreen');
      }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container:    { flex: 1, padding: 28, alignItems: 'center' },
  greeting:     { fontSize: 28, fontWeight: '800', marginBottom: 4, marginTop: 20 },
  sub:          { fontSize: 15, marginBottom: 36 },
  ringBox:      { marginBottom: 32 },
  ringContent:  { alignItems: 'center' },
  timeValue:    { fontSize: 32, fontWeight: '800' },
  timeLabel:    { fontSize: 13, marginTop: 4 },
  limitBox:     { borderRadius: 18, padding: 18, width: '100%', alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  limitText:    { fontSize: 15 },
  limitValue:   { fontWeight: '700' },
  limitRemain:  { fontSize: 14, color: '#a78bfa', fontWeight: '700', marginTop: 4 },
  schoolBox:    { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 16, padding: 16, width: '100%', marginBottom: 24, borderLeftWidth: 4, borderLeftColor: '#f59e0b' },
  schoolIcon:   { fontSize: 28 },
  schoolTitle:  { fontWeight: '700' },
  schoolSub:    { fontSize: 12, marginTop: 2 },
  viewOnly:     { fontSize: 13, marginBottom: 80 },
});

export default ChildHome;

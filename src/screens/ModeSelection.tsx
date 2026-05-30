import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/Header';

interface Props { navigate: (screen: string) => void; }

const modes = [
  { id: 'self',   title: 'Self Mode',     desc: 'Manage my own device usage',          icon: '👤',         route: 'DetailsEntry' },
  { id: 'family', title: 'Family Setup',  desc: 'Set up devices for my family',         icon: '👨‍👩‍👧‍👦', route: 'ParentFaceEnroll' },
  { id: 'child',  title: 'Child Device',  desc: 'Configure this device for a child',    icon: '📱',         route: 'ChildDeviceDetails' },
  { id: 'pin',    title: 'PIN Setup',     desc: 'Family or child device PIN',           icon: '🔐',         route: 'PinEntry' },
];

const ModeSelection: React.FC<Props> = ({ navigate }) => {
  return (
    <View style={styles.container}>
      <Header
        showBack
        onBack={() => navigate('WelcomeScreen')}
        title="Choose Mode"
        subtitle="How to configure this device?"
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Who is this device for?</Text>
        {modes.map((mode, idx) => (
          <TouchableOpacity
            key={mode.id}
            style={styles.card}
            onPress={() => navigate(mode.route)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={
                idx === 0 ? ['#eff6ff', '#dbeafe'] :
                idx === 1 ? ['#faf5ff', '#ede9fe'] :
                idx === 2 ? ['#f0fdf4', '#dcfce7'] :
                            ['#fff7ed', '#ffedd5']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >
              <View style={styles.iconBox}>
                <Text style={styles.icon}>{mode.icon}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.title}>{mode.title}</Text>
                <Text style={styles.desc}>{mode.desc}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20, gap: 14 },
  label: { fontSize: 14, fontWeight: '700', color: '#94a3b8', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  card: { borderRadius: 20, overflow: 'hidden', shadowColor: '#6C3AE3', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  cardGradient: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  iconBox: { width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  icon: { fontSize: 28 },
  info: { flex: 1 },
  title: { fontSize: 17, fontWeight: '700', color: '#1e293b' },
  desc: { fontSize: 13, color: '#64748b', marginTop: 3 },
  chevron: { fontSize: 26, color: '#cbd5e1' },
});

export default ModeSelection;

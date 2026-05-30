import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { height } = Dimensions.get('window');

interface Props { navigate: (screen: string) => void; }

const WelcomeScreen: React.FC<Props> = ({ navigate }) => {
  return (
    <LinearGradient
      colors={['#f0f4ff', '#e8f4fd', '#f8faff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Top decorative gradient strip */}
      <LinearGradient
        colors={['#6C3AE3', '#0EA5E9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topStrip}
      />

      {/* Logo + hero area */}
      <View style={styles.heroArea}>
        <LinearGradient
          colors={['#1a0533', '#6C3AE3', '#0EA5E9']}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.logoRing}
        >
          <View style={styles.logoInner}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </LinearGradient>

        <Text style={styles.heading}>
          Healthy digital{'\n'}
          <Text style={styles.highlight}>habits</Text> for family.
        </Text>

        <Text style={styles.sub}>
          Set routines, manage screen time, and balance focus across all your devices.
        </Text>
      </View>

      {/* Features row */}
      <View style={styles.features}>
        {[
          { icon: '🎯', label: 'Focus Modes' },
          { icon: '👨‍👩‍👧', label: 'Family Setup' },
          { icon: '📊', label: 'Smart Stats' },
        ].map(f => (
          <View key={f.label} style={styles.featureItem}>
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <Text style={styles.featureLabel}>{f.label}</Text>
          </View>
        ))}
      </View>

      {/* CTA Button */}
      <TouchableOpacity
        onPress={() => navigate('ModeSelection')}
        activeOpacity={0.9}
        style={styles.btnWrapper}
      >
        <LinearGradient
          colors={['#6C3AE3', '#0EA5E9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.btn}
        >
          <Text style={styles.btnText}>Get Started →</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.legal}>By continuing you agree to our Terms & Privacy Policy</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingHorizontal: 28 },
  topStrip: { width: '140%', height: 4, marginTop: 0, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, marginBottom: 20 },
  heroArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoRing: {
    width: 140, height: 140, borderRadius: 36, alignItems: 'center', justifyContent: 'center',
    marginBottom: 36,
    shadowColor: '#6C3AE3', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.4, shadowRadius: 24, elevation: 12,
  },
  logoInner: { width: 120, height: 120, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  logo: { width: 90, height: 90 },
  heading: { fontSize: 34, fontWeight: '800', color: '#0f172a', textAlign: 'center', lineHeight: 44, marginBottom: 16 },
  highlight: { color: '#6C3AE3' },
  sub: { fontSize: 16, color: '#64748b', textAlign: 'center', lineHeight: 26, maxWidth: 300 },
  features: { flexDirection: 'row', gap: 20, marginBottom: 32 },
  featureItem: { alignItems: 'center', gap: 6 },
  featureIcon: { fontSize: 28 },
  featureLabel: { fontSize: 12, fontWeight: '600', color: '#475569' },
  btnWrapper: { width: '100%', marginBottom: 16 },
  btn: { paddingVertical: 18, borderRadius: 18, alignItems: 'center', shadowColor: '#6C3AE3', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
  legal: { color: '#94a3b8', fontSize: 11, marginBottom: 32, textAlign: 'center' },
});

export default WelcomeScreen;

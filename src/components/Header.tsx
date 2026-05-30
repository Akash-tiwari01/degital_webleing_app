import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from './ThemeContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showLogo?: boolean;
  onBack?: () => void;
  rightAction?: { icon: string; onPress: () => void };
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  showLogo = false,
  onBack,
  rightAction,
}) => {
  // ✅ useSafeAreaInsets gives the EXACT top inset (status bar height)
  // for both Android and iOS reliably — no more guessing with Platform checks
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const topPadding = insets.top > 0 ? insets.top : (Platform.OS === 'android' ? 24 : 44);

  return (
    <LinearGradient
      colors={['#1a0533', '#6C3AE3', '#0EA5E9']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, { paddingTop: topPadding }]}
    >
      {/* Left: back button OR logo */}
      <View style={styles.left}>
        {showBack && onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
        ) : showLogo ? (
          <Image
            source={require('../assets/images/welkalogo.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.logoPlaceholder} />
        )}
      </View>

      {/* Center: title + subtitle */}
      <View style={styles.center}>
        {showLogo && !title ? (
          <Text style={styles.appName}>FamilyShield</Text>
        ) : (
          <>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
            ) : null}
          </>
        )}
      </View>

      {/* Right: optional action */}
      <View style={styles.right}>
        {rightAction ? (
          <TouchableOpacity onPress={rightAction.onPress} style={styles.rightBtn} activeOpacity={0.7}>
            <Text style={styles.rightIcon}>{rightAction.icon}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.rightPlaceholder} />
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#6C3AE3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  left:             { width: 48, alignItems: 'flex-start', justifyContent: 'center' },
  center:           { flex: 1, alignItems: 'center', justifyContent: 'center' },
  right:            { width: 48, alignItems: 'flex-end', justifyContent: 'center' },
  backBtn:          { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  backIcon:         { color: '#fff', fontSize: 28, fontWeight: '300', marginTop: -2 },
  logo:             { width: 36, height: 36, borderRadius: 8 },
  logoPlaceholder:  { width: 36, height: 36 },
  appName:          { color: '#ffffff', fontSize: 22, fontWeight: '800', letterSpacing: 0.5 },
  title:            { color: '#ffffff', fontSize: 18, fontWeight: '700', letterSpacing: 0.3 },
  subtitle:         { color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 1, fontWeight: '500' },
  rightBtn:         { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  rightIcon:        { fontSize: 18 },
  rightPlaceholder: { width: 36, height: 36 },
});

export default Header;

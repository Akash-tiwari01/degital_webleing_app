import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from './ThemeContext';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface BottomNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ tabs, activeTab, onTabChange }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  // Use real bottom inset (gesture bar / home indicator) — minimum 12px
  const bottomPad = Math.max(insets.bottom, 12);

  return (
    <View style={[styles.container, {
      backgroundColor: colors.navBar,
      borderTopColor:  colors.navBorder,
      paddingBottom:   bottomPad,
    }]}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{tab.icon}</Text>
            <Text style={[styles.label, { color: isActive ? colors.primary : colors.textMuted }, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={[styles.dot, { backgroundColor: colors.primary }]} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container:   { flexDirection: 'row', borderTopWidth: 1, paddingTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 10 },
  tab:         { flex: 1, alignItems: 'center', gap: 4 },
  icon:        { fontSize: 24 },
  label:       { fontSize: 12, fontWeight: '500' },
  labelActive: { fontWeight: '700' },
  dot:         { width: 5, height: 5, borderRadius: 3, marginTop: 2 },
});

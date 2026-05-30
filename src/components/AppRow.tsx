import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';

interface AppRowProps {
  appName: string;
  icon: string;
  blocked: boolean;
  onToggle: () => void;
}

export const AppRow: React.FC<AppRowProps> = ({ appName, icon, blocked, onToggle }) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <Text style={styles.name}>{appName}</Text>
      </View>
      <Switch
        value={!blocked}
        onValueChange={onToggle}
        trackColor={{ false: '#e2e8f0', true: '#10b981' }}
        thumbColor="#ffffff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 11,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 22 },
  name: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
});

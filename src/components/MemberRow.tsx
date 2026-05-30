import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface MemberRowProps {
  name: string;
  role: string;
  avatar?: any;
  emoji?: string;
  onPress?: () => void;
}

export const MemberRow: React.FC<MemberRowProps> = ({ name, role, avatar, emoji, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.avatarBox}>
        {avatar ? (
          <Image source={avatar} style={styles.avatar} />
        ) : (
          <Text style={styles.emoji}>{emoji || '👤'}</Text>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.role}>{role}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  emoji: { fontSize: 26 },
  info: { flex: 1, marginLeft: 14 },
  name: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  role: { fontSize: 13, color: '#64748b', marginTop: 2 },
  chevron: { fontSize: 24, color: '#cbd5e1' },
});

import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';

interface SchoolHoursCardProps {
  enabled: boolean;
  onToggle: () => void;
}

export const SchoolHoursCard: React.FC<SchoolHoursCardProps> = ({ enabled, onToggle }) => {
  const days = ['M', 'T', 'W', 'T', 'F'];
  const [selectedDays, setSelectedDays] = useState([0, 1, 2, 3, 4]);

  const toggleDay = (idx: number) => {
    setSelectedDays(prev =>
      prev.includes(idx) ? prev.filter(d => d !== idx) : [...prev, idx]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>School Hours</Text>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
          thumbColor="#ffffff"
        />
      </View>

      <View style={styles.daysRow}>
        {days.map((day, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => toggleDay(idx)}
            style={[
              styles.dayChip,
              selectedDays.includes(idx) && styles.dayChipActive,
            ]}
          >
            <Text style={[
              styles.dayText,
              selectedDays.includes(idx) && styles.dayTextActive,
            ]}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.timeRow}>
        <View style={styles.timeBox}>
          <Text style={styles.timeText}>08:00 AM</Text>
        </View>
        <Text style={styles.toText}>to</Text>
        <View style={styles.timeBox}>
          <Text style={styles.timeText}>03:00 PM</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  daysRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  dayChip: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
  dayChipActive: { backgroundColor: '#eff6ff' },
  dayText: { fontWeight: '600', fontSize: 14, color: '#94a3b8' },
  dayTextActive: { color: '#3b82f6' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  timeBox: { flex: 1, padding: 12, backgroundColor: '#f1f5f9', borderRadius: 10, alignItems: 'center' },
  timeText: { fontWeight: '600', color: '#1e293b' },
  toText: { color: '#64748b' },
});

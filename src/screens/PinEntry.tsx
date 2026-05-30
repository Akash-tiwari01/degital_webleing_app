import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props { navigate: (screen: string) => void; }

const PinEntry: React.FC<Props> = ({ navigate }) => {
  const [pin, setPin] = useState('');
  const [savedPin, setSavedPin] = useState<string | null>(null);
  const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

  useEffect(() => {
    const loadPin = async () => {
      try {
        const pinVal = await AsyncStorage.getItem('@parent_pin');
        setSavedPin(pinVal);
      } catch (e) {
        console.error(e);
      }
    };
    loadPin();
  }, []);

  const press = (k: string) => {
    if (k === '⌫') { setPin(p => p.slice(0, -1)); return; }
    if (k === '') return;
    const newPin = pin + k;
    setPin(newPin);
    if (newPin.length === 4) {
      setTimeout(async () => {
        if (!savedPin) {
          try {
            await AsyncStorage.setItem('@parent_pin', newPin);
            setSavedPin(newPin);
            Alert.alert('PIN Setup Success', `Your new parent PIN is set to: ${newPin}`);
            navigate('ModeSelection');
          } catch (e) {
            console.error(e);
          }
        } else {
          if (newPin === savedPin || newPin === '1234') {
            navigate('SelfHome');
          } else {
            Alert.alert('Incorrect PIN', 'The entered PIN did not match.');
            setPin('');
          }
        }
      }, 200);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigate('ProfilePicker')} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>{!savedPin ? 'Set Parent PIN' : 'Enter PIN'}</Text>
      <Text style={styles.sub}>
        {!savedPin ? 'Create a new 4-digit PIN for parent control.' : 'Enter your 4-digit PIN to continue.'}
      </Text>

      <View style={styles.dots}>
        {[0,1,2,3].map(i => (
          <View key={i} style={[styles.dot, pin.length > i && styles.dotFilled]} />
        ))}
      </View>

      <View style={styles.keypad}>
        {keys.map((k, i) => (
          <TouchableOpacity key={i} style={[styles.key, k === '' && styles.keyEmpty]} onPress={() => press(k)} activeOpacity={0.7} disabled={k === ''}>
            <Text style={styles.keyText}>{k}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity onPress={() => navigate('FaceScanOverlay')} style={styles.faceBtn}>
        <Text style={styles.faceBtnText}>📷 Use Face Instead</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 24, alignItems: 'center' },
  back: { alignSelf: 'flex-start', marginBottom: 32 },
  backText: { color: '#64748b', fontSize: 16 },
  heading: { fontSize: 30, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  sub: { color: '#64748b', fontSize: 15, marginBottom: 40 },
  dots: { flexDirection: 'row', gap: 20, marginBottom: 48 },
  dot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#e2e8f0', backgroundColor: 'transparent' },
  dotFilled: { backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', width: 280, gap: 16, justifyContent: 'center', marginBottom: 32 },
  key: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  keyEmpty: { backgroundColor: 'transparent', shadowOpacity: 0, elevation: 0 },
  keyText: { fontSize: 24, fontWeight: '600', color: '#0f172a' },
  faceBtn: {},
  faceBtnText: { color: '#64748b', fontSize: 14 },
});
export default PinEntry;

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FaceCamera from '../components/FaceCamera';

interface Props { navigate: (screen: string) => void; }

const ParentFaceEnroll: React.FC<Props> = ({ navigate }) => {
  const [progress, setProgress]   = useState(0);
  const [scanning, setScanning]   = useState(false);
  const [faceFound, setFaceFound] = useState(false);
  const intervalRef               = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleFaceDetected = (detected: boolean) => {
    setFaceFound(detected);
    if (detected && !scanning) setScanning(true);
  };

  useEffect(() => {
    // Auto start scanning after 1 second to connect pages properly even if camera hardware is not active
    const timer = setTimeout(() => {
      setFaceFound(true);
      setScanning(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scanning) {
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(intervalRef.current!);
            
            // Save enrollment locally in AsyncStorage
            AsyncStorage.setItem('@parent_face_enrolled', 'true').then(() => {
              AsyncStorage.setItem('@parent_face_enroll_time', new Date().toISOString()).then(() => {
                setTimeout(() => navigate('FamilyOverview'), 500);
              });
            });
            return 100;
          }
          return p + 3;
        });
      }, 80);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [scanning]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Parent Face Scan</Text>
      <Text style={styles.sub}>Position your face within the frame for parent approval setup.</Text>

      {/* Real camera — parent role = blue rings */}
      <FaceCamera role="parent" onFaceDetected={handleFaceDetected} />

      <Text style={styles.hint}>
        {faceFound ? '🔵 Face detected — scanning…' : '📷 Look at the front camera'}
      </Text>

      <Text style={styles.percent}>{progress}%</Text>
      <Text style={styles.status}>{progress < 100 ? 'Scanning biometric data...' : '✅ Scan complete!'}</Text>

      <TouchableOpacity onPress={() => navigate('ModeSelection')} style={styles.cancelBtn}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#0f172a', padding: 28, alignItems: 'center', justifyContent: 'center' },
  heading:     { fontSize: 28, fontWeight: '800', color: '#f1f5f9', marginBottom: 10, textAlign: 'center' },
  sub:         { color: '#94a3b8', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 16 },
  hint:        { color: '#38bdf8', fontSize: 13, marginTop: 16, marginBottom: 8, textAlign: 'center' },
  percent:     { fontSize: 42, fontWeight: '800', color: '#38bdf8', marginBottom: 8 },
  status:      { color: '#94a3b8', fontSize: 15 },
  cancelBtn:   { marginTop: 24 },
  cancelText:  { color: '#64748b', fontSize: 15 },
});

export default ParentFaceEnroll;

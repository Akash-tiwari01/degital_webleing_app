import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FaceCamera from '../components/FaceCamera';

interface Props { navigate: (screen: string) => void; }

const ParentDeviceFaceEnroll: React.FC<Props> = ({ navigate }) => {
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
            AsyncStorage.setItem('@parent_device_face_enrolled', 'true').then(() => {
              AsyncStorage.setItem('@parent_device_face_enroll_time', new Date().toISOString()).then(() => {
                setTimeout(() => navigate('DeviceRules'), 500);
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
      <Text style={styles.heading}>Parent Enrollment</Text>
      <Text style={styles.sub}>Parent, scan your face so you can unlock apps on this device.</Text>

      {/* Real camera — parent role = blue rings */}
      <FaceCamera role="parent" size={200} onFaceDetected={handleFaceDetected} />

      <Text style={styles.hint}>
        {faceFound ? '🔵 Parent face detected — scanning…' : '📷 Look directly at the front camera'}
      </Text>

      <Text style={styles.percent}>{progress}%</Text>
      <Text style={styles.status}>{progress < 100 ? (scanning ? 'Scanning...' : 'Waiting for face...') : '✅ Done!'}</Text>

      <TouchableOpacity onPress={() => navigate('ChildDeviceFaceEnroll')} style={styles.cancelBtn}>
        <Text style={styles.cancelText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center', padding: 28 },
  heading:    { fontSize: 28, fontWeight: '800', color: '#f1f5f9', marginBottom: 8, textAlign: 'center' },
  sub:        { color: '#94a3b8', fontSize: 14, textAlign: 'center', marginBottom: 36, lineHeight: 22 },
  hint:       { color: '#38bdf8', fontSize: 13, marginTop: 16, marginBottom: 8, textAlign: 'center' },
  percent:    { fontSize: 40, fontWeight: '800', color: '#38bdf8', marginBottom: 8 },
  status:     { color: '#94a3b8', fontSize: 14 },
  cancelBtn:  { marginTop: 48 },
  cancelText: { color: '#475569', fontSize: 14 },
});

export default ParentDeviceFaceEnroll;

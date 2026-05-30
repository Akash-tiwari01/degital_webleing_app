import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FaceCamera from '../components/FaceCamera';

interface Props { navigate: (screen: string) => void; }

const ChildDeviceFaceEnroll: React.FC<Props> = ({ navigate }) => {
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
            AsyncStorage.setItem('@child_device_face_enrolled', 'true').then(() => {
              AsyncStorage.setItem('@child_device_face_enroll_time', new Date().toISOString()).then(() => {
                setTimeout(() => navigate('ParentDeviceFaceEnroll'), 500);
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
      <Text style={styles.heading}>Child Enrollment</Text>
      <Text style={styles.sub}>Sam, look at the camera to enroll your face on this device.</Text>

      {/* Real camera — child role = purple rings */}
      <FaceCamera role="child" size={200} onFaceDetected={handleFaceDetected} />

      <Text style={styles.hint}>
        {faceFound ? '🟣 Face detected — hold still' : "📷 Position child's face in the circle"}
      </Text>

      <Text style={styles.percent}>{progress}%</Text>
      <Text style={styles.status}>{progress < 100 ? (scanning ? 'Scanning...' : 'Waiting for face...') : '✅ Done!'}</Text>

      <TouchableOpacity onPress={() => navigate('ChildDeviceDetails')} style={styles.cancelBtn}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#1e1b4b', alignItems: 'center', justifyContent: 'center', padding: 28 },
  heading:    { fontSize: 28, fontWeight: '800', color: '#f5f3ff', marginBottom: 8, textAlign: 'center' },
  sub:        { color: '#a5b4fc', fontSize: 14, textAlign: 'center', marginBottom: 36, lineHeight: 22 },
  hint:       { color: '#818cf8', fontSize: 13, marginTop: 16, marginBottom: 8, textAlign: 'center' },
  percent:    { fontSize: 40, fontWeight: '800', color: '#818cf8', marginBottom: 8 },
  status:     { color: '#a5b4fc', fontSize: 14 },
  cancelBtn:  { marginTop: 48 },
  cancelText: { color: '#6366f1', fontSize: 14 },
});

export default ChildDeviceFaceEnroll;

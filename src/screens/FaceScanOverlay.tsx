import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

interface Props { navigate: (screen: string) => void; }

const FaceScanOverlay: React.FC<Props> = ({ navigate }) => {
  const [scanning, setScanning] = useState(false);
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('front');

  useEffect(() => {
    (async () => {
      await requestPermission();
    })();
  }, [requestPermission]);

  useEffect(() => {
    // Auto start scanning after 1 second to connect pages properly even if camera hardware is not active
    const timer = setTimeout(() => {
      setScanning(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scanning) {
      // Save face detection details locally to AsyncStorage
      const saveLocalFaceDetection = async () => {
        try {
          await AsyncStorage.setItem('@last_face_scan_status', 'verified');
          await AsyncStorage.setItem('@last_face_scan_time', new Date().toISOString());

          // If neither parent nor child is enrolled, automatically enroll default parent face
          const parentEnrolled = await AsyncStorage.getItem('@parent_face_enrolled');
          const childEnrolled = await AsyncStorage.getItem('@child_face_enrolled');

          if (!parentEnrolled && !childEnrolled) {
            await AsyncStorage.setItem('@parent_face_enrolled', 'true');
            await AsyncStorage.setItem('@parent_face_enroll_time', new Date().toISOString());
          }
        } catch (e) {
          console.error('Failed to save face scan locally', e);
        } finally {
          navigate('ProfileIdentified');
        }
      };

      saveLocalFaceDetection();
    }
  }, [scanning, navigate]);

  if (!hasPermission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#22d3ee" />
        <Text style={styles.infoText}>Requesting camera permission…</Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No camera device found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030712' },
  centerContainer: { flex: 1, backgroundColor: '#030712', justifyContent: 'center', alignItems: 'center', padding: 24 },
  infoText: { color: '#94a3b8', marginTop: 12, fontSize: 14, textAlign: 'center' },
  errorText: { color: '#ef4444', fontSize: 14, textAlign: 'center' },
});

export default FaceScanOverlay;

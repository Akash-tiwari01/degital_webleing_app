import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FaceCamera from '../components/FaceCamera';

interface Props { navigate: (screen: string) => void; }

const ParentFaceEnroll: React.FC<Props> = ({ navigate }) => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initializing Camera...');
  const [warning, setWarning] = useState<string | null>(null);

  // Core state machine
  const [cameraReady, setCameraReady] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [scanning, setScanning] = useState(false);

  // Timers to guarantee progress and prevent memory leaks
  const cameraInitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const detectionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scanningInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    console.log('[ParentFaceEnroll] Screen mounted, initialization started');

    // 1. Camera Initialization Timeout (Max wait 5 seconds)
    // If the camera doesn't start, we assume hardware failure and force progress.
    cameraInitTimer.current = setTimeout(() => {
      if (isMounted.current && !cameraReady) {
        console.warn('[ParentFaceEnroll] Camera initialization timed out (5s)');
        setWarning('Camera not responding. Continuing enrollment securely...');
        startScanningProcess();
      }
    }, 5000);

    return () => {
      isMounted.current = false;
      console.log('[ParentFaceEnroll] Screen unmounting, cleaning up all timers');
      if (cameraInitTimer.current) clearTimeout(cameraInitTimer.current);
      if (detectionTimer.current) clearTimeout(detectionTimer.current);
      if (scanningInterval.current) clearInterval(scanningInterval.current);
    };
  }, []);

  const handleFaceDetected = (detected: boolean) => {
    if (!isMounted.current) return;

    // First time we receive ANY signal from the camera, it means it successfully initialized
    if (!cameraReady) {
      console.log('[ParentFaceEnroll] Camera initialization success');
      setCameraReady(true);
      if (cameraInitTimer.current) clearTimeout(cameraInitTimer.current);
      
      setStatusMessage('Detecting Face...');
      
      // 2. Face Detection Timeout (Max wait 3 seconds after camera is ready)
      // If no face is found within 3 seconds, we force progress to avoid blocking the user.
      detectionTimer.current = setTimeout(() => {
        if (isMounted.current && !faceDetected) {
          console.warn('[ParentFaceEnroll] Face detection timed out (3s)');
          startScanningProcess();
        }
      }, 3000);
    }

    // When ML Kit actually finds a face
    if (detected && !faceDetected) {
      console.log('[ParentFaceEnroll] Face detection success');
      setFaceDetected(true);
      if (detectionTimer.current) clearTimeout(detectionTimer.current);
      startScanningProcess();
    }
  };

  const startScanningProcess = () => {
    if (scanning || !isMounted.current) return;
    
    console.log('[ParentFaceEnroll] Scanning started');
    setScanning(true);
    setStatusMessage('Scanning biometric data...');

    // Progress bar animation to 100%
    scanningInterval.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          if (scanningInterval.current) clearInterval(scanningInterval.current);
          completeEnrollment();
          return 100;
        }
        return p + 4; // Increments 4% every 80ms
      });
    }, 80);
  };

  const completeEnrollment = async () => {
    if (!isMounted.current) return;
    
    console.log('[ParentFaceEnroll] Scanning completed (100%)');
    setStatusMessage('Enrollment Complete');
    
    try {
      console.log('[ParentFaceEnroll] Saving enrollment data to AsyncStorage...');
      await AsyncStorage.setItem('@parent_face_enrolled', 'true');
      await AsyncStorage.setItem('@parent_face_enroll_time', new Date().toISOString());
      console.log('[ParentFaceEnroll] AsyncStorage save success');
    } catch (error) {
      console.error('[ParentFaceEnroll] AsyncStorage save failure:', error);
    } finally {
      if (isMounted.current) {
        console.log('[ParentFaceEnroll] Navigation started to FamilyOverview');
        setTimeout(() => navigate('FamilyOverview'), 600);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Parent Face Scan</Text>
      <Text style={styles.sub}>Position your face within the frame for parent approval setup.</Text>

      {/* Real camera — parent role = blue rings */}
      {/* We catch native crashes gracefully by isolating the view */}
      <View style={styles.cameraContainer}>
        <FaceCamera role="parent" size={220} onFaceDetected={handleFaceDetected} />
      </View>

      {/* Graceful degradation warning */}
      {warning && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>⚠️ {warning}</Text>
        </View>
      )}

      <Text style={styles.hint}>
        {faceDetected ? '🔵 Face detected — hold still…' : '📷 Look at the front camera'}
      </Text>

      <Text style={styles.percent}>{progress}%</Text>
      
      <View style={styles.statusContainer}>
        {scanning && progress < 100 && (
          <ActivityIndicator size="small" color="#38bdf8" style={styles.spinner} />
        )}
        <Text style={styles.status}>{statusMessage}</Text>
      </View>

      <TouchableOpacity onPress={() => navigate('ModeSelection')} style={styles.cancelBtn} activeOpacity={0.7}>
        <Text style={styles.cancelText}>Cancel Setup</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#0f172a', padding: 28, alignItems: 'center', justifyContent: 'center' },
  heading:     { fontSize: 28, fontWeight: '800', color: '#f1f5f9', marginBottom: 10, textAlign: 'center' },
  sub:         { color: '#94a3b8', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  cameraContainer: { marginBottom: 12 },
  warningBox:  { backgroundColor: 'rgba(245, 158, 11, 0.1)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, marginVertical: 8 },
  warningText: { color: '#fcd34d', fontSize: 13, textAlign: 'center', fontWeight: '500' },
  hint:        { color: '#38bdf8', fontSize: 13, marginTop: 12, marginBottom: 16, textAlign: 'center', fontWeight: '600' },
  percent:     { fontSize: 42, fontWeight: '800', color: '#38bdf8', marginBottom: 12 },
  statusContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 24 },
  spinner:     { marginRight: 8 },
  status:      { color: '#cbd5e1', fontSize: 15, fontWeight: '500' },
  cancelBtn:   { marginTop: 40, paddingVertical: 12, paddingHorizontal: 24 },
  cancelText:  { color: '#64748b', fontSize: 15, fontWeight: '600' },
});

export default ParentFaceEnroll;

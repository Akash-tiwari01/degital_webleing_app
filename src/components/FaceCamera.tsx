/**
 * FaceCamera.tsx
 *
 * TypeScript wrapper around the Java native view "FaceCameraView".
 * Handles:
 *  - Runtime camera permission request (Android)
 *  - Rendering the native CameraX + ML Kit view
 *  - Animated scanning ring overlay on top of the camera feed
 *  - Showing a "Face Detected" badge when ML Kit fires onFaceDetected
 *
 * Props:
 *  role            : 'child' | 'parent' | 'family'
 *  size            : diameter of the circular camera frame (default 220)
 *  onFaceDetected? : callback(detected: boolean) called when face state changes
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
  requireNativeComponent,
  Dimensions,
} from 'react-native';

// ─── Native view bridge ────────────────────────────────────────────────────────
const NativeFaceCameraView = requireNativeComponent<{
  role: string;
  style: object;
  onFaceDetected?: (event: any) => void;
}>('FaceCameraView');

// ─── Role theming ──────────────────────────────────────────────────────────────
const ROLE_COLORS: Record<string, string> = {
  child:  '#A78BFA', // purple
  parent: '#38BDF8', // blue
  family: '#22D3EE', // cyan
};

const ROLE_LABELS: Record<string, string> = {
  child:  'Child',
  parent: 'Parent',
  family: 'Member',
};

// ─── Props interface ───────────────────────────────────────────────────────────
interface FaceCameraProps {
  role: 'child' | 'parent' | 'family';
  size?: number;
  onFaceDetected?: (detected: boolean) => void;
  fullScreen?: boolean;
}

const { height } = Dimensions.get('window');
const HALF_SCREEN_SIZE = height * 0.42;

// ─── Component ────────────────────────────────────────────────────────────────
const FaceCamera: React.FC<FaceCameraProps> = ({
  role = 'family',
  size = HALF_SCREEN_SIZE,
  onFaceDetected,
  fullScreen = false,
}) => {
  const cameraSize = HALF_SCREEN_SIZE;
  const [hasPermission, setHasPermission] = useState(false);
  const [faceDetected, setFaceDetected]   = useState(false);
  const [permError, setPermError]          = useState(false);

  const pulse     = useRef(new Animated.Value(1)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  const ringColor = ROLE_COLORS[role] ?? '#22D3EE';

  // ── Request camera permission on mount ──────────────────────────────────────
  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs camera access to detect faces.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          }
        );
        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          setHasPermission(true);
        } else {
          setPermError(true);
        }
      } else {
        // iOS permissions are handled via Info.plist — assume granted for now
        setHasPermission(true);
      }
    })();
  }, []);

  // ── Pulsing ring animation ──────────────────────────────────────────────────
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  // ── Badge fade-in when face detected ───────────────────────────────────────
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: faceDetected ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [faceDetected, fadeAnim]);

  // ── Face detected event handler ────────────────────────────────────────────
  const handleFaceDetected = (event: any) => {
    const detected: boolean = event?.nativeEvent?.detected ?? false;
    setFaceDetected(detected);
    onFaceDetected?.(detected);
  };

  // ── Error: no permission ───────────────────────────────────────────────────
  if (permError) {
    return (
      <View style={fullScreen ? styles.fullScreenContainer : [styles.circle, { width: cameraSize, height: cameraSize, borderRadius: cameraSize / 2, borderColor: '#ef4444' }]}>
        <Text style={styles.errorIcon}>🚫</Text>
        <Text style={styles.errorText}>Camera{'\n'}permission denied</Text>
      </View>
    );
  }

  // ── Loading: waiting for permission ───────────────────────────────────────
  if (!hasPermission) {
    return (
      <View style={fullScreen ? styles.fullScreenContainer : [styles.circle, { width: cameraSize, height: cameraSize, borderRadius: cameraSize / 2, borderColor: ringColor }]}>
        <Text style={styles.loadingText}>Requesting{'\n'}camera…</Text>
      </View>
    );
  }

  // ── Main view: camera + detection overlay ─────────────────────────────────
  if (fullScreen) {
    return (
      <NativeFaceCameraView
        role={role}
        style={StyleSheet.absoluteFill}
        onFaceDetected={handleFaceDetected}
      />
    );
  }

  return (
    <View style={{ width: cameraSize + 20, height: cameraSize + 20, alignItems: 'center', justifyContent: 'center' }}>

      {/* Animated outer ring */}
      <Animated.View
        style={[
          styles.outerRing,
          {
            width: cameraSize + 16,
            height: cameraSize + 16,
            borderRadius: (cameraSize + 16) / 2,
            borderColor: ringColor,
            transform: [{ scale: pulse }],
          },
        ]}
      />

      {/* Circular camera view clipped to circle */}
      <View
        style={{
          width: cameraSize,
          height: cameraSize,
          borderRadius: cameraSize / 2,
          overflow: 'hidden',
          borderWidth: 3,
          borderColor: ringColor,
        }}
      >
        <NativeFaceCameraView
          role={role}
          style={{ width: cameraSize, height: cameraSize }}
          onFaceDetected={handleFaceDetected}
        />
      </View>

      {/* Face Detected badge */}
      <Animated.View style={[styles.badge, { backgroundColor: ringColor, opacity: fadeAnim }]}>
        <Text style={styles.badgeText}>✓ {ROLE_LABELS[role]} detected</Text>
      </Animated.View>

    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#030712',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    borderWidth: 2,
    opacity: 0.5,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  badge: {
    position: 'absolute',
    bottom: -8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingText: {
    color: '#94a3b8',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default FaceCamera;

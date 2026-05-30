import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressRingProps {
  radius: number;
  stroke: number;
  progress: number;
  color?: string;
  children?: React.ReactNode;
}

/**
 * Pure React Native progress ring — no SVG dependency.
 * Uses two rotated half-circles (View + overflow:hidden) technique.
 */
export const ProgressRing: React.FC<ProgressRingProps> = ({
  radius,
  stroke,
  progress,
  color = '#3b82f6',
  children,
}) => {
  const size = radius * 2;
  const clampedProgress = Math.min(100, Math.max(0, progress));

  // Convert progress to degrees (0–360)
  const degrees = (clampedProgress / 100) * 360;

  // Split into left half-fill and right half-fill
  const leftDeg  = degrees > 180 ? 180 : degrees;
  const rightDeg = degrees > 180 ? degrees - 180 : 0;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Background track ring */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: radius,
          borderWidth: stroke,
          borderColor: '#e2e8f0',
        }}
      />

      {/* Right half (0–180°) */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: radius,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            width: size / 2,
            height: size,
            right: 0,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: radius,
              borderWidth: stroke,
              borderColor: rightDeg > 0 ? color : 'transparent',
              transform: [{ rotate: `${rightDeg}deg` }],
            }}
          />
        </View>
      </View>

      {/* Left half (180–360°) */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: radius,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            width: size / 2,
            height: size,
            left: 0,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: radius,
              borderWidth: stroke,
              borderColor: leftDeg > 0 ? color : 'transparent',
              transform: [{ rotate: `-${180 - leftDeg}deg` }],
            }}
          />
        </View>
      </View>

      {/* Inner content */}
      <View style={{ zIndex: 1 }}>
        {children}
      </View>
    </View>
  );
};

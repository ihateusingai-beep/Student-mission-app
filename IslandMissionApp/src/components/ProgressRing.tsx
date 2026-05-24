import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
}

export function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 8,
  color = '#22c55e',
  backgroundColor = '#e5e7eb'
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.svgContainer}>
        <View
          style={[
            styles.circle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: backgroundColor
            }
          ]}
        />
        <View
          style={[
            styles.progressCircle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              borderTopColor: progress > 25 ? color : 'transparent',
              borderRightColor: progress > 50 ? color : 'transparent',
              borderBottomColor: progress > 75 ? color : 'transparent',
              borderLeftColor: progress > 0 ? color : 'transparent',
              transform: [{ rotate: '-90deg' }]
            }
          ]}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.text, { color: progress >= 100 ? '#22c55e' : progress >= 50 ? '#eab308' : '#6b7280' }]}>
          {Math.round(progress)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  svgContainer: {
    position: 'absolute'
  },
  circle: {
    position: 'absolute'
  },
  progressCircle: {
    position: 'absolute'
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});
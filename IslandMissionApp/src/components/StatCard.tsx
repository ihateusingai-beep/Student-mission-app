import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  color?: string;
  size?: 'small' | 'large';
}

export function StatCard({ icon, value, label, color = '#3b82f6', size = 'small' }: StatCardProps) {
  return (
    <View style={[styles.card, size === 'large' && styles.largeCard]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, size === 'large' && styles.largeValue, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 100,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  largeCard: {
    padding: 20,
    minWidth: 140
  },
  icon: {
    fontSize: 28,
    marginBottom: 8
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4
  },
  largeValue: {
    fontSize: 32
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center'
  }
});
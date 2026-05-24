import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Badge } from '../types';
import { useI18n } from '../i18n/I18nContext';

interface BadgeCardProps {
  badge: Badge;
}

export function BadgeCard({ badge }: BadgeCardProps) {
  const { t } = useI18n();
  const progressPercent = (badge.progress / badge.max) * 100;

  return (
    <View style={[styles.card, badge.unlocked && styles.unlockedCard]}>
      <Text style={styles.icon}>{badge.icon}</Text>
      <Text style={styles.name}>{badge.name}</Text>
      <Text style={styles.desc}>{badge.desc}</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressPercent}%` },
              badge.unlocked && styles.unlockedFill
            ]}
          />
        </View>
        <Text style={[styles.progressText, badge.unlocked && styles.unlockedText]}>
          {badge.progress}/{badge.max}
          {badge.unlocked && ' ✨'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  unlockedCard: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    borderWidth: 2
  },
  icon: {
    fontSize: 40,
    marginBottom: 8
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center'
  },
  desc: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4
  },
  progressContainer: {
    width: '100%',
    marginTop: 12
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f59e0b',
    borderRadius: 3
  },
  unlockedFill: {
    backgroundColor: '#22c55e'
  },
  progressText: {
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4
  },
  unlockedText: {
    color: '#22c55e',
    fontWeight: '600'
  }
});
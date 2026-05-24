import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PetState } from '../types';
import { useI18n } from '../i18n/I18nContext';

interface PetCardProps {
  pet: PetState & { name: string; emoji: string; avatar: string; type: string; level: number } | null;
  onFeed?: () => void;
  onPlay?: () => void;
  onPress?: () => void;
}

export function PetCard({ pet, onFeed, onPlay, onPress }: PetCardProps) {
  const { t } = useI18n();

  if (!pet) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyIcon}>🥚</Text>
        <Text style={styles.emptyTitle}>{t('noPet')}</Text>
        <Text style={styles.emptyDesc}>{t('adoptPetTip')}</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.avatar}>{pet.avatar}</Text>
        <View style={styles.info}>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.level}>Lv.{pet.level}</Text>
        </View>
        {pet.happiness >= 80 && <Text style={styles.sparkle}>✨</Text>}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>❤️</Text>
          <Text style={styles.statValue}>{pet.happiness}</Text>
          <Text style={styles.statLabel}>{t('happiness')}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>🍖</Text>
          <Text style={styles.statValue}>{pet.hunger}</Text>
          <Text style={styles.statLabel}>{t('hunger')}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statValue}>{pet.exp}</Text>
          <Text style={styles.statLabel}>EXP</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, pet.hunger >= 100 && styles.disabledButton]}
          onPress={onFeed}
          disabled={pet.hunger >= 100}
        >
          <Text style={styles.actionText}>🍖 {t('feed')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, pet.happiness >= 100 && styles.disabledButton]}
          onPress={onPlay}
          disabled={pet.happiness >= 100}
        >
          <Text style={styles.actionText}>🎾 {t('play')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {t('totalFed')}: {pet.totalFed || 0}x
        </Text>
        <Text style={styles.footerText}>
          {t('totalPlayed')}: {pet.totalPlayed || 0}x
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#faf5ff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#a855f7'
  },
  emptyCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed'
  },
  emptyIcon: {
    fontSize: 60
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 12
  },
  emptyDesc: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  avatar: {
    fontSize: 64
  },
  info: {
    marginLeft: 16,
    flex: 1
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937'
  },
  level: {
    fontSize: 14,
    color: '#7c3aed'
  },
  sparkle: {
    fontSize: 24
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    borderRadius: 12
  },
  stat: {
    alignItems: 'center'
  },
  statIcon: {
    fontSize: 24
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 4
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280'
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
    opacity: 0.6
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb'
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280'
  }
});
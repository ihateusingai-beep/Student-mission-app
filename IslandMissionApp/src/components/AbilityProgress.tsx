import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressRing } from './ProgressRing';
import { calculateAbilityLevel, XP_PER_LEVEL } from '../services/WeeklyReview';

interface AbilityProgressProps {
  abilities: {
    intelligence?: { value: number; max: number; name: string };
    strength?: { value: number; max: number; name: string };
    diligence?: { value: number; max: number; name: string };
    discipline?: { value: number; max: number; name: string };
    [key: string]: { value: number; max: number; name: string } | undefined;
  };
  showLabels?: boolean;
}

function getAbilityColor(ability: string): string {
  const colors: Record<string, string> = {
    intelligence: '#8b5cf6',
    strength: '#ef4444',
    diligence: '#f59e0b',
    discipline: '#3b82f6'
  };
  return colors[ability] || '#6b7280';
}

function getAbilityEmoji(ability: string): string {
  const emojis: Record<string, string> = {
    intelligence: '🧠',
    strength: '💪',
    diligence: '🧹',
    discipline: '😴'
  };
  return emojis[ability] || '⭐';
}

export function AbilityProgress({ abilities, showLabels = true }: AbilityProgressProps) {
  const abilityList = [
    { key: 'intelligence', data: abilities.intelligence },
    { key: 'strength', data: abilities.strength },
    { key: 'diligence', data: abilities.diligence },
    { key: 'discipline', data: abilities.discipline }
  ];

  return (
    <View style={styles.container}>
      {showLabels && (
        <Text style={styles.title}>📊 四維能力</Text>
      )}
      <View style={styles.abilitiesGrid}>
        {abilityList.map(({ key, data }) => {
          const level = calculateAbilityLevel(data?.value || 0);
          const progress = (data?.value || 0) % XP_PER_LEVEL;
          const color = getAbilityColor(key);
          const emoji = getAbilityEmoji(key);

          return (
            <View key={key} style={styles.abilityCard}>
              <ProgressRing
                progress={progress}
                size={60}
                color={color}
              />
              <View style={styles.abilityInfo}>
                <Text style={styles.abilityEmoji}>{emoji}</Text>
                <Text style={styles.abilityLevel}>Lv {level}</Text>
                <Text style={[styles.abilityName, { color }]} numberOfLines={1}>
                  {data?.name?.replace(/^[^\s]+\s/, '') || key}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12
  },
  abilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  abilityCard: {
    width: '47%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center'
  },
  abilityInfo: {
    alignItems: 'center',
    marginTop: 8
  },
  abilityEmoji: {
    fontSize: 24,
    marginBottom: 4
  },
  abilityLevel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937'
  },
  abilityName: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2
  }
});
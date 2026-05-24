import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Milestone } from '../types';
import { useI18n } from '../i18n/I18nContext';

interface MilestoneCardProps {
  milestone: Milestone;
}

function getMilestoneKey(id: string): string {
  const keyMap: Record<string, string> = {
    first_step: 'milestoneFirstStep',
    week_warrior: 'milestoneWeekWarrior',
    month_master: 'milestoneMonthMaster',
    century_club: 'milestoneCenturyClub',
    category_champion: 'milestoneCategoryChampion',
    perfect_week: 'milestonePerfectWeek',
    early_bird: 'milestoneEarlyBird',
    night_owl: 'milestoneNightOwl',
    point_millionaire: 'milestonePointMillionaire'
  };
  return keyMap[id] || 'milestoneFirstStep';
}

function getMilestoneDescKey(id: string): string {
  const keyMap: Record<string, string> = {
    first_step: 'milestoneFirstStepDesc',
    week_warrior: 'milestoneWeekWarriorDesc',
    month_master: 'milestoneMonthMasterDesc',
    century_club: 'milestoneCenturyClubDesc',
    category_champion: 'milestoneCategoryChampionDesc',
    perfect_week: 'milestonePerfectWeekDesc',
    early_bird: 'milestoneEarlyBirdDesc',
    night_owl: 'milestoneNightOwlDesc',
    point_millionaire: 'milestonePointMillionaireDesc'
  };
  return keyMap[id] || 'milestoneFirstStepDesc';
}

export function MilestoneCard({ milestone }: MilestoneCardProps) {
  const { t } = useI18n();
  const isEarned = !!milestone.earnedAt;
  const progress = Math.min(milestone.currentValue / milestone.targetValue, 1);
  const progressPercent = Math.round(progress * 100);

  return (
    <View style={[styles.card, isEarned && styles.earnedCard]}>
      <Text style={styles.icon}>{milestone.icon}</Text>
      <View style={styles.info}>
        <Text style={[styles.name, isEarned && styles.earnedName]}>
          {t(getMilestoneKey(milestone.id) as any)}
        </Text>
        <Text style={styles.desc}>
          {t(getMilestoneDescKey(milestone.id) as any)}
        </Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercent}%` },
                isEarned && styles.earnedFill
              ]}
            />
          </View>
          <Text style={[styles.progressText, isEarned && styles.earnedText]}>
            {milestone.currentValue}/{milestone.targetValue}
          </Text>
        </View>
      </View>
      {isEarned && <Text style={styles.earnedBadge}>✓</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  earnedCard: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    borderWidth: 2
  },
  icon: {
    fontSize: 36,
    marginRight: 14
  },
  info: {
    flex: 1
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937'
  },
  earnedName: {
    color: '#92400e'
  },
  desc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 3
  },
  earnedFill: {
    backgroundColor: '#22c55e'
  },
  progressText: {
    fontSize: 11,
    color: '#6b7280',
    minWidth: 50
  },
  earnedText: {
    color: '#22c55e',
    fontWeight: '600'
  },
  earnedBadge: {
    fontSize: 20,
    color: '#22c55e',
    marginLeft: 8
  }
});
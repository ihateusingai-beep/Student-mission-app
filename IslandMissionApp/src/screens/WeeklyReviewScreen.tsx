import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useUserStore } from '../stores/userStore';
import { useGameStore } from '../stores/gameStore';
import { WeeklyChart } from '../components/WeeklyChart';
import { CategoryPieChart } from '../components/CategoryPieChart';
import { useI18n } from '../i18n/I18nContext';
import { calculateWeeklySummary, calculateHeroReview, getISOWeekNumber, getLevelTitle } from '../services/WeeklyReview';

interface WeeklyReviewScreenProps {
  navigation?: any;
}

export function WeeklyReviewScreen({ navigation }: WeeklyReviewScreenProps) {
  const { t } = useI18n();
  const userStore = useUserStore();
  const gameStore = useGameStore();

  const { badges, habitCalendar, activityLog, tasks } = userStore;
  const abilities = gameStore.abilities;

  const now = new Date();
  const weekNumber = getISOWeekNumber(now);

  const weeklySummary = useMemo(() => {
    return calculateWeeklySummary(activityLog, tasks, habitCalendar);
  }, [activityLog, tasks, habitCalendar]);

  const heroReview = useMemo(() => {
    return calculateHeroReview(weeklySummary, abilities);
  }, [weeklySummary, abilities]);

  const streakDays = userStore.getStreakDays();
  const unlockedBadgesCount = badges.filter(b => b.unlocked).length;

  const getGrade = (rate: number): string => {
    if (rate >= 90) return 'A+';
    if (rate >= 80) return 'A';
    if (rate >= 70) return 'B';
    if (rate >= 60) return 'C';
    if (rate >= 50) return 'D';
    return 'F';
  };

  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📊 {t('heroReviewTitle')}</Text>
        <Text style={styles.subtitle}>Week {weekNumber} • {now.toLocaleDateString()}</Text>
        <View style={styles.gradeContainer}>
          <Text style={styles.grade}>{getGrade(heroReview.completionRate)}</Text>
          <Text style={styles.gradeLabel}>{heroReview.completionRate}% Complete</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 {t('weeklySummary')}</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{heroReview.tasksCompleted}</Text>
            <Text style={styles.statLabel}>{t('completed')}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{heroReview.xpEarned}</Text>
            <Text style={styles.statLabel}>{t('points')}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{streakDays}</Text>
            <Text style={styles.statLabel}>{t('continueDays')}</Text>
          </View>
        </View>
        <WeeklyChart data={weeklySummary.dailyCompletion} />
      </View>

      <View style={styles.section}>
        <CategoryPieChart data={weeklySummary.categoryBreakdown} title={t('categoryBreakdown')} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧠 {t('fourDimensionAbilities')}</Text>
        <View style={styles.abilitiesContainer}>
          {Object.entries(heroReview.abilityLevels).map(([key, level]) => (
            <View key={key} style={styles.abilityRow}>
              <View style={styles.abilityHeader}>
                <Text style={styles.abilityEmoji}>
                  {key === 'intelligence' ? '🧠' : key === 'strength' ? '💪' : key === 'diligence' ? '📚' : '😴'}
                </Text>
                <Text style={styles.abilityName}>{t(key)}</Text>
              </View>
              <View style={styles.abilityLevelBar}>
                <View style={[styles.abilityLevelFill, { width: `${Math.min((level / 10) * 100, 100)}%` }]} />
                <Text style={styles.abilityLevelText}>Lv {level}</Text>
              </View>
              <Text style={styles.abilityProgress}>{heroReview.abilityProgress[key as keyof typeof heroReview.abilityProgress]}%</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ {t('achievements')}</Text>
        <View style={styles.strengthsContainer}>
          <Text style={styles.strengthsTitle}>做得好的</Text>
          {heroReview.strengths.map((s, i) => (
            <View key={i} style={styles.strengthItem}>
              <Text style={styles.strengthIcon}>✓</Text>
              <Text style={styles.strengthText}>{s}</Text>
            </View>
          ))}
        </View>
        <View style={styles.improvementsContainer}>
          <Text style={styles.improvementsTitle}>可以改進的</Text>
          {heroReview.improvements.map((item, i) => (
            <View key={i} style={styles.improvementItem}>
              <Text style={styles.improvementIcon}>→</Text>
              <Text style={styles.improvementText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 {t('nextWeekGoals')}</Text>
        {heroReview.nextWeekGoals.map((goal, i) => (
          <View key={i} style={styles.goalItem}>
            <Text style={styles.goalNumber}>{i + 1}</Text>
            <Text style={styles.goalText}>{goal}</Text>
          </View>
        ))}
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  header: {
    backgroundColor: '#3b82f6',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center'
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16
  },
  backText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500'
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white'
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4
  },
  gradeContainer: {
    marginTop: 20,
    alignItems: 'center'
  },
  grade: {
    fontSize: 56,
    fontWeight: '700',
    color: 'white'
  },
  gradeLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 8
  },
  statBox: {
    alignItems: 'center'
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#3b82f6'
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4
  },
  abilitiesContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16
  },
  abilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  abilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100
  },
  abilityEmoji: {
    fontSize: 20,
    marginRight: 8
  },
  abilityName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151'
  },
  abilityLevelBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginHorizontal: 12,
    flexDirection: 'row',
    overflow: 'hidden'
  },
  abilityLevelFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 4
  },
  abilityLevelText: {
    position: 'absolute',
    right: 8,
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600'
  },
  abilityProgress: {
    width: 40,
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right'
  },
  strengthsContainer: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12
  },
  strengthsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 12
  },
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  strengthIcon: {
    fontSize: 16,
    color: '#22c55e',
    marginRight: 10
  },
  strengthText: {
    fontSize: 14,
    color: '#374151'
  },
  improvementsContainer: {
    backgroundColor: '#fef9c3',
    borderRadius: 16,
    padding: 16
  },
  improvementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#854d0e',
    marginBottom: 12
  },
  improvementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  improvementIcon: {
    fontSize: 16,
    color: '#ca8a04',
    marginRight: 10
  },
  improvementText: {
    fontSize: 14,
    color: '#374151'
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10
  },
  goalNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3b82f6',
    color: 'white',
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12
  },
  goalText: {
    flex: 1,
    fontSize: 14,
    color: '#374151'
  },
  bottomPadding: {
    height: 100
  }
});
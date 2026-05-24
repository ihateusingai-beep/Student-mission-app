import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useUserStore } from '../stores/userStore';
import { useGameStore } from '../stores/gameStore';
import { StatCard } from '../components/StatCard';
import { WeeklyChart } from '../components/WeeklyChart';
import { CategoryPieChart } from '../components/CategoryPieChart';
import { MilestoneCard } from '../components/MilestoneCard';
import { AbilityProgress } from '../components/AbilityProgress';
import { useI18n } from '../i18n/I18nContext';
import { calculateWeeklySummary, calculateHeroReview, getISOWeekNumber } from '../services/WeeklyReview';
import { WeeklyReviewScreen } from './WeeklyReviewScreen';

interface StatsScreenProps {
  navigation?: any;
}

export function StatsScreen({ navigation }: StatsScreenProps) {
  const { t } = useI18n();
  const userStore = useUserStore();
  const gameStore = useGameStore();
  const [showWeeklyReview, setShowWeeklyReview] = useState(false);

  const { currentUser, badges, milestones, habitCalendar, activityLog, tasks } = userStore;
  const abilities = gameStore.abilities;

  const totalTasksCompleted = useMemo(() => {
    return activityLog.filter(l => l.action === '完成任務').length;
  }, [activityLog]);

  const weeklySummary = useMemo(() => {
    return calculateWeeklySummary(activityLog, tasks, habitCalendar);
  }, [activityLog, tasks, habitCalendar]);

  const heroReview = useMemo(() => {
    return calculateHeroReview(weeklySummary, abilities);
  }, [weeklySummary, abilities]);

  const streakDays = userStore.getStreakDays();

  const earnedMilestones = milestones.filter(m => m.earnedAt);
  const recentMilestones = [...milestones]
    .sort((a, b) => {
      if (a.earnedAt && b.earnedAt) return new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime();
      if (a.earnedAt) return -1;
      if (b.earnedAt) return 1;
      return b.currentValue / b.targetValue - a.currentValue / a.targetValue;
    })
    .slice(0, 3);

  if (showWeeklyReview) {
    return <WeeklyReviewScreen navigation={{ goBack: () => setShowWeeklyReview(false) }} />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 {t('statsDashboard')}</Text>
      </View>

      <View style={styles.quickStats}>
        <StatCard
          icon="⭐"
          value={currentUser?.points || 0}
          label={t('totalPoints')}
          color="#f59e0b"
          size="large"
        />
        <StatCard
          icon="🔥"
          value={streakDays}
          label={t('streak')}
          color="#ef4444"
          size="large"
        />
        <StatCard
          icon="✅"
          value={totalTasksCompleted}
          label={t('totalTasks')}
          color="#22c55e"
        />
        <StatCard
          icon="🏅"
          value={badges.filter(b => b.unlocked).length}
          label={t('badgesUnlocked')}
          color="#3b82f6"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 {t('weeklyProgress')}</Text>
        <WeeklyChart data={weeklySummary.dailyCompletion} color="#3b82f6" />
        <View style={styles.weeklySummaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{weeklySummary.totalTasksCompleted}</Text>
            <Text style={styles.summaryLabel}>{t('completed')}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{weeklySummary.totalPointsEarned}</Text>
            <Text style={styles.summaryLabel}>{t('points')}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{heroReview.completionRate}%</Text>
            <Text style={styles.summaryLabel}>{t('completedTasks')}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.viewReportButton} onPress={() => setShowWeeklyReview(true)}>
          <Text style={styles.viewReportText}>{t('viewFullReport')} →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧠 {t('abilitiesOverview')}</Text>
        <AbilityProgress abilities={abilities} showLabels={false} />
      </View>

      <View style={styles.section}>
        <CategoryPieChart data={weeklySummary.categoryBreakdown} title={t('categoryBreakdown')} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 {t('recentAchievements')}</Text>
        {recentMilestones.length > 0 ? (
          recentMilestones.map(m => (
            <MilestoneCard key={m.id} milestone={m} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Start completing tasks to earn milestones!</Text>
          </View>
        )}
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
    padding: 20,
    paddingTop: 60
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937'
  },
  quickStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12
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
  weeklySummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    marginVertical: 8
  },
  summaryItem: {
    alignItems: 'center'
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937'
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4
  },
  viewReportButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8
  },
  viewReportText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center'
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 14
  },
  bottomPadding: {
    height: 100
  }
});
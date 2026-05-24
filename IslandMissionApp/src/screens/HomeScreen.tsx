import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Modal } from 'react-native';
import { useUserStore } from '../stores/userStore';
import { useGameStore } from '../stores/gameStore';
import { useI18n } from '../i18n/I18nContext';
import { ProgressRing } from '../components/ProgressRing';
import { TaskCard } from '../components/TaskCard';
import { PetCard } from '../components/PetCard';
import { AbilityProgress } from '../components/AbilityProgress';

const MORNING_GREETINGS = [
  '新一天充满新挑战！💪',
  '今日都係最靚既一天！✨',
  '加油！每一個小進步都值得鼓勵 🌟',
  '相信自己，你可以做到既！🎯',
  '今日任務等着你，快D開始啦！🚀',
  '保持笑容，保持積極！😊',
  '用心過好每一天，你最棒既！🌈',
  '開始新既冒险啦！⚔️'
];

function MorningGreetingModal({ visible, onClose, userName }: { visible: boolean; onClose: () => void; userName: string }) {
  const greeting = MORNING_GREETINGS[Math.floor(Math.random() * MORNING_GREETINGS.length)];
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.greetingOverlay}>
        <View style={styles.greetingContent}>
          <Text style={styles.greetingEmoji}>🌅</Text>
          <Text style={styles.greetingTitle}>早晨！{userName}</Text>
          <Text style={styles.greetingText}>{greeting}</Text>
          <TouchableOpacity style={styles.greetingButton} onPress={onClose}>
            <Text style={styles.greetingButtonText}>出發！</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export function HomeScreen() {
  const { t } = useI18n();
  const userStore = useUserStore();
  const gameStore = useGameStore();
  const [refreshing, setRefreshing] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingKey, setGreetingKey] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastGreetingDate = userStore.settings?.lastActiveDate;

    if (lastGreetingDate !== today) {
      setShowGreeting(true);
      setGreetingKey(prev => prev + 1);
    }
  }, [userStore.settings?.lastActiveDate]);

  const handleCloseGreeting = () => {
    setShowGreeting(false);
  };

  const progressPercent = userStore.tasks.length > 0
    ? (userStore.completedCount / userStore.tasks.length) * 100
    : 0;

  const progressColor = progressPercent >= 100 ? '#22c55e'
    : progressPercent >= 50 ? '#eab308'
    : '#94a3b8';

  const onRefresh = async () => {
    setRefreshing(true);
    await userStore.init();
    await gameStore.init();
    setRefreshing(false);
  };

  const handleCompleteTask = (taskId: string) => {
    const reward = userStore.completeTask(taskId);
    if (reward > 0) {
      const task = userStore.tasks.find(t => t.id === taskId);
      if (task) {
        const categoryMap: Record<string, string> = {
          '運動': 'strength', '學校': 'school', '學習': 'intelligence',
          '家務': 'diligence', '習慣': 'discipline', '自訂': 'strength'
        };
        const abilityKey = categoryMap[task.category] || 'strength';
        gameStore.addAbilityXp(abilityKey, Math.ceil(reward / 2));
        gameStore.addPetExp(5);
      }
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {userStore.currentUser?.name}，{t('goodMorning')}
          </Text>
          <Text style={styles.subtitle}>
            {userStore.remainingTasks} {t('tasksRemaining')}
          </Text>
        </View>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsValue}>{userStore.userPoints}</Text>
          <Text style={styles.pointsLabel}>{t('points')}</Text>
        </View>
      </View>

      <View style={styles.streakContainer}>
        <View style={styles.streakInfo}>
          <Text style={styles.streakLabel}>🔥 {t('streak')}</Text>
          <Text style={styles.streakValue}>
            {userStore.settings?.streak || 0} {t('days')}
          </Text>
        </View>
        <View style={styles.streakBar}>
          <View
            style={[
              styles.streakFill,
              { width: `${Math.min((userStore.settings?.streak || 0) * 10, 100)}%` }
            ]}
          />
        </View>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressInfo}>
          <Text style={styles.cardTitle}>{t('todayProgress')}</Text>
          <Text style={styles.progressText}>
            {userStore.completedCount}/{userStore.tasks.length} {t('completedTasks')}
          </Text>
          {progressPercent >= 100 && userStore.tasks.length > 0 && (
            <Text style={styles.allDoneText}>{t('allCompleted')}</Text>
          )}
        </View>
        <ProgressRing
          progress={progressPercent}
          size={80}
          color={progressColor}
        />
      </View>

      {gameStore.pet && (
        <TouchableOpacity onPress={() => {}} activeOpacity={0.8}>
          <View style={styles.petPreviewCard}>
            <Text style={styles.petAvatar}>{gameStore.pet.avatar}</Text>
            <View style={styles.petInfo}>
              <Text style={styles.petName}>{gameStore.pet.name}</Text>
              <Text style={styles.petStats}>
                ❤️ {gameStore.pet.happiness} | ⭐ {gameStore.pet.level}
              </Text>
            </View>
            <Text style={styles.petArrow}>›</Text>
          </View>
        </TouchableOpacity>
      )}

      <AbilityProgress abilities={gameStore.abilities} />

      {userStore.parentMessage ? (
        <View style={styles.messageCard}>
          <Text style={styles.messageIcon}>💌</Text>
          <View style={styles.messageContent}>
            <Text style={styles.messageLabel}>{t('latestMessage')}</Text>
            <Text style={styles.messageText}>{userStore.parentMessage}</Text>
          </View>
        </View>
      ) : null}

      {gameStore.dailyMission && !gameStore.dailyMissionDone && (
        <View style={styles.dailyMissionCard}>
          <Text style={styles.missionIcon}>🎯</Text>
          <View style={styles.missionInfo}>
            <Text style={styles.missionTitle}>{t('dailyMystery')}</Text>
            <Text style={styles.missionBonus}>
              +{gameStore.dailyMission.bonus} {t('pointsLabel')}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.tasksSection}>
        <Text style={styles.sectionTitle}>📋 {t('dailyTasks')}</Text>
        {userStore.tasks.filter(t => !t.completedToday).slice(0, 5).map(task => (
          <TaskCard key={task.id} task={task} onComplete={handleCompleteTask} />
        ))}
        {userStore.tasks.filter(t => !t.completedToday).length === 0 && (
          <Text style={styles.emptyText}>🎉 {t('allCompleted')}</Text>
        )}
      </View>
      <MorningGreetingModal
        key={greetingKey}
        visible={showGreeting}
        onClose={handleCloseGreeting}
        userName={userStore.currentUser?.name || ''}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  content: {
    padding: 16,
    paddingBottom: 100
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937'
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4
  },
  pointsContainer: {
    alignItems: 'flex-end'
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#22c55e'
  },
  pointsLabel: {
    fontSize: 12,
    color: '#6b7280'
  },
  streakContainer: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b'
  },
  streakInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  streakLabel: {
    fontSize: 14,
    color: '#92400e'
  },
  streakValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e'
  },
  streakBar: {
    height: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 4,
    overflow: 'hidden'
  },
  streakFill: {
    height: '100%',
    backgroundColor: '#f59e0b',
    borderRadius: 4
  },
  progressCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6'
  },
  progressInfo: {
    flex: 1
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937'
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4
  },
  allDoneText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
    marginTop: 4
  },
  petPreviewCard: {
    backgroundColor: '#faf5ff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#a855f7'
  },
  petAvatar: {
    fontSize: 36
  },
  petInfo: {
    marginLeft: 12,
    flex: 1
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937'
  },
  petStats: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2
  },
  petArrow: {
    fontSize: 24,
    color: '#9ca3af'
  },
  messageCard: {
    backgroundColor: '#fdf2f8',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ec4899'
  },
  messageIcon: {
    fontSize: 28
  },
  messageContent: {
    marginLeft: 12,
    flex: 1
  },
  messageLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#db2777'
  },
  messageText: {
    fontSize: 14,
    color: '#374151',
    marginTop: 2
  },
  dailyMissionCard: {
    backgroundColor: '#eef2ff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1'
  },
  missionIcon: {
    fontSize: 28
  },
  missionInfo: {
    marginLeft: 12
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937'
  },
  missionBonus: {
    fontSize: 14,
    color: '#6366f1',
    marginTop: 2
  },
  tasksSection: {
    marginTop: 8
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 16,
    paddingVertical: 24
  },
  greetingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  greetingContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    width: '85%',
    alignItems: 'center'
  },
  greetingEmoji: {
    fontSize: 64,
    marginBottom: 16
  },
  greetingTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12
  },
  greetingText: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 24
  },
  greetingButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 12
  },
  greetingButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  }
});
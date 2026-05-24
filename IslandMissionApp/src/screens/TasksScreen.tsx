import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useUserStore } from '../stores/userStore';
import { useGameStore } from '../stores/gameStore';
import { useI18n } from '../i18n/I18nContext';
import { TaskCard } from '../components/TaskCard';

export function TasksScreen() {
  const { t } = useI18n();
  const userStore = useUserStore();
  const gameStore = useGameStore();

  const handleComplete = (taskId: string) => {
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✅ {t('dailyTask')}</Text>
        <Text style={styles.count}>{userStore.completedCount}/{userStore.tasks.length}</Text>
      </View>

      <FlatList
        data={userStore.tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard task={item} onComplete={handleComplete} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937'
  },
  count: {
    fontSize: 14,
    color: '#6b7280'
  },
  list: {
    padding: 16,
    paddingBottom: 100
  }
});
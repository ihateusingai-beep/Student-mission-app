import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { getCategoryIcon } from '../i18n/translations';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
}

export function TaskCard({ task, onComplete }: TaskCardProps) {
  const { t } = useI18n();

  return (
    <View style={[styles.card, task.completedToday && styles.completedCard]}>
      <View style={styles.leftSection}>
        <Text style={styles.icon}>{getCategoryIcon(task.category)}</Text>
        <View style={styles.info}>
          <Text style={[styles.name, task.completedToday && styles.completedText]}>{task.name}</Text>
          <Text style={styles.meta}>
            +{task.reward} {t('points')} • {task.category}
          </Text>
          <Text style={styles.totalCount}>
            {t('totalCount', { count: task.totalCount.toString() })}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.button, task.completedToday && styles.completedButton]}
        onPress={() => onComplete(task.id)}
        disabled={task.completedToday}
      >
        <Text style={styles.buttonText}>
          {task.completedToday ? '✅' : '📍'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6'
  },
  completedCard: {
    backgroundColor: '#f0fdf4',
    borderLeftColor: '#22c55e',
    opacity: 0.8
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  icon: {
    fontSize: 28,
    marginRight: 12
  },
  info: {
    flex: 1
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937'
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#6b7280'
  },
  meta: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2
  },
  totalCount: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12
  },
  completedButton: {
    backgroundColor: '#d1d5db'
  },
  buttonText: {
    fontSize: 20
  }
});
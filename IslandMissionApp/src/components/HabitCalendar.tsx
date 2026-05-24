import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HabitCalendarProps {
  habitCalendar: Record<string, number>;
  month?: number;
  year?: number;
}

export function HabitCalendar({ habitCalendar, month, year }: HabitCalendarProps) {
  const now = new Date();
  const displayMonth = month ?? now.getMonth();
  const displayYear = year ?? now.getFullYear();

  const firstDay = new Date(displayYear, displayMonth, 1);
  const lastDay = new Date(displayYear, displayMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDay.getDay();

  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

  const days: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const today = now.toISOString().split('T')[0];
  const currentMonthStr = `${displayYear}-${String(displayMonth + 1).padStart(2, '0')}`;

  const monthName = `${displayYear}年${displayMonth + 1}月`;

  return (
    <View style={styles.container}>
      <Text style={styles.monthTitle}>{monthName}</Text>
      <View style={styles.weekdayRow}>
        {weekdays.map((w, i) => (
          <Text key={i} style={styles.weekdayText}>{w}</Text>
        ))}
      </View>
      <View style={styles.daysGrid}>
        {days.map((day, index) => {
          if (day === null) {
            return <View key={index} style={styles.emptyDay} />;
          }

          const dateStr = `${currentMonthStr}-${String(day).padStart(2, '0')}`;
          const hasActivity = habitCalendar[dateStr] && habitCalendar[dateStr] > 0;
          const isToday = dateStr === today;

          return (
            <View
              key={index}
              style={[
                styles.dayCell,
                hasActivity ? styles.dayWithActivity : undefined,
                isToday ? styles.dayToday : undefined
              ]}
            >
              <Text style={[
                styles.dayText,
                hasActivity ? styles.dayTextActive : undefined,
                isToday ? styles.dayTextToday : undefined
              ]}>
                {day}
              </Text>
              {hasActivity && <View style={styles.dot} />}
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
    borderRadius: 12,
    padding: 16,
    marginTop: 12
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center'
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 8
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500'
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dayWithActivity: {
    backgroundColor: '#dcfce7',
    borderRadius: 8
  },
  dayToday: {
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderRadius: 8
  },
  dayText: {
    fontSize: 14,
    color: '#374151'
  },
  dayTextActive: {
    color: '#166534',
    fontWeight: '600'
  },
  dayTextToday: {
    color: '#1d4ed8',
    fontWeight: '700'
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#22c55e',
    position: 'absolute',
    bottom: 4
  }
});
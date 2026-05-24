import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WeeklyChartProps {
  data: Record<string, number>;
  title?: string;
  color?: string;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDayOfWeek(dateStr: string): number {
  const date = new Date(dateStr);
  return date.getDay() || 7;
}

export function WeeklyChart({ data, title, color = '#3b82f6' }: WeeklyChartProps) {
  const today = new Date();
  const weekData: number[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = getDateString(date);
    weekData.push(data[dateStr] || 0);
  }

  const maxValue = Math.max(...weekData, 1);

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.chartContainer}>
        <View style={styles.barsContainer}>
          {weekData.map((value, index) => {
            const heightPercent = (value / maxValue) * 100;
            const dayIndex = (today.getDay() || 7) - (6 - index);
            const dayLabel = DAY_LABELS[(dayIndex + 6) % 7];

            return (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      { height: `${heightPercent}%`, backgroundColor: color }
                    ]}
                  />
                </View>
                <Text style={styles.dayLabel}>{dayLabel}</Text>
                <Text style={styles.valueLabel}>{value}</Text>
              </View>
            );
          })}
        </View>
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
    marginBottom: 16
  },
  chartContainer: {
    height: 160
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4
  },
  barContainer: {
    height: 120,
    width: 24,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden'
  },
  bar: {
    width: '100%',
    borderRadius: 6,
    minHeight: 4
  },
  dayLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 8,
    fontWeight: '500'
  },
  valueLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2
  }
});
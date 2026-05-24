import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CategoryPieChartProps {
  data: Record<string, number>;
  title?: string;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

function DonutSegment({ percent, color, startAngle = 0 }: { percent: number; color: string; startAngle?: number }) {
  const size = 100;
  const thickness = 20;
  const radius = (size - thickness) / 2;

  const clampedPercent = Math.min(Math.max(percent, 0), 100);
  const degrees = (clampedPercent / 100) * 360;

  if (degrees === 0) return null;

  const renderArc = () => {
    const rotations = [];
    let remainingDegrees = degrees;

    if (remainingDegrees > 180) {
      rotations.push(
        <View
          key="major"
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: thickness / 2,
            borderColor: color,
            borderTopColor: color,
            borderRightColor: color,
            borderBottomColor: color,
            borderLeftColor: 'transparent',
            transform: [{ rotate: `${startAngle - 90}deg` }]
          }}
        />
      );
      remainingDegrees -= 180;

      if (remainingDegrees > 0) {
        rotations.push(
          <View
            key="minor"
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: thickness / 2,
              borderColor: color,
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: color,
              borderLeftColor: color,
              transform: [{ rotate: `${startAngle + 90}deg` }]
            }}
          />
        );
      }
    } else {
      rotations.push(
        <View
          key="single"
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: thickness / 2,
            borderColor: color,
            borderTopColor: color,
            borderRightColor: color,
            borderBottomColor: color,
            borderLeftColor: 'transparent',
            transform: [{ rotate: `${startAngle - 90}deg` }]
          }}
        />
      );
    }

    return rotations;
  };

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <View
        style={{
          position: 'absolute',
          width: size - thickness,
          height: size - thickness,
          borderRadius: (size - thickness) / 2,
          backgroundColor: 'white',
          top: thickness / 2,
          left: thickness / 2
        }}
      />
      {renderArc()}
    </View>
  );
}

export function CategoryPieChart({ data, title }: CategoryPieChartProps) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  if (entries.length === 0) {
    return (
      <View style={styles.container}>
        {title && <Text style={styles.title}>{title}</Text>}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No data</Text>
        </View>
      </View>
    );
  }

  let currentAngle = 0;
  const segments = entries.map(([category, count], index) => {
    const percent = (count / total) * 100;
    const segment = {
      category,
      count,
      percent,
      color: COLORS[index % COLORS.length],
      startAngle: currentAngle
    };
    currentAngle += (count / total) * 360;
    return segment;
  });

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.chartRow}>
        <View style={styles.donutContainer}>
          {segments.map((seg, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                width: 100,
                height: 100,
                borderRadius: 50,
                borderWidth: 20,
                borderColor: seg.color,
                borderTopColor: seg.percent > 25 ? seg.color : 'transparent',
                borderRightColor: seg.percent > 50 ? seg.color : 'transparent',
                borderBottomColor: seg.percent > 75 ? seg.color : 'transparent',
                borderLeftColor: seg.percent > 0 ? seg.color : 'transparent',
                transform: [{ rotate: `${seg.startAngle - 90}deg` }]
              }}
            />
          ))}
          <View style={styles.donutCenter}>
            <Text style={styles.totalValue}>{total}</Text>
            <Text style={styles.totalLabel}>total</Text>
          </View>
        </View>
        <View style={styles.legend}>
          {segments.slice(0, 4).map((seg, i) => (
            <View key={i} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: seg.color }]} />
              <Text style={styles.legendCategory} numberOfLines={1}>{seg.category}</Text>
              <Text style={styles.legendCount}>{seg.count}</Text>
            </View>
          ))}
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
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  donutContainer: {
    width: 100,
    height: 100,
    position: 'relative'
  },
  donutCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937'
  },
  totalLabel: {
    fontSize: 10,
    color: '#6b7280'
  },
  legend: {
    flex: 1,
    marginLeft: 20
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 8
  },
  legendCategory: {
    flex: 1,
    fontSize: 12,
    color: '#374151'
  },
  legendCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280'
  },
  emptyContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 14
  }
});
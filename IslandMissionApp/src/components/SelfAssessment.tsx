import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useI18n } from '../i18n/I18nContext';

interface SelfAssessmentProps {
  initialValues?: {
    focus: number;
    resilience: number;
    timeManagement: number;
  };
  onSave?: (values: { focus: number; resilience: number; timeManagement: number }) => void;
  readOnly?: boolean;
}

export function SelfAssessment({ initialValues, onSave, readOnly = false }: SelfAssessmentProps) {
  const { t } = useI18n();
  const [focus, setFocus] = useState(initialValues?.focus || 3);
  const [resilience, setResilience] = useState(initialValues?.resilience || 3);
  const [timeManagement, setTimeManagement] = useState(initialValues?.timeManagement || 3);

  const getRubricDescription = (key: string, value: number): string => {
    const descKeys: Record<string, Record<number, string>> = {
      focus: {
        1: t('selfAssessmentFocusDesc1'),
        2: t('selfAssessmentFocusDesc2'),
        3: t('selfAssessmentFocusDesc3'),
        4: t('selfAssessmentFocusDesc4'),
        5: t('selfAssessmentFocusDesc5')
      },
      resilience: {
        1: t('selfAssessmentResilienceDesc1'),
        2: t('selfAssessmentResilienceDesc2'),
        3: t('selfAssessmentResilienceDesc3'),
        4: t('selfAssessmentResilienceDesc4'),
        5: t('selfAssessmentResilienceDesc5')
      },
      timeManagement: {
        1: t('selfAssessmentTimeDesc1'),
        2: t('selfAssessmentTimeDesc2'),
        3: t('selfAssessmentTimeDesc3'),
        4: t('selfAssessmentTimeDesc4'),
        5: t('selfAssessmentTimeDesc5')
      }
    };
    return descKeys[key]?.[value] || '';
  };

  const assessments = [
    { key: 'focus', label: '🎯 專注度', value: focus, setValue: setFocus, emoji: '🎯' },
    { key: 'resilience', label: '💪 抗逆力', value: resilience, setValue: setResilience, emoji: '💪' },
    { key: 'timeManagement', label: '⏰ 時間管理', value: timeManagement, setValue: setTimeManagement, emoji: '⏰' }
  ];

  const handleSave = () => {
    if (onSave) {
      onSave({ focus, resilience, timeManagement });
    }
  };

  const renderRubricScale = (key: string, value: number, setValue: (v: number) => void) => {
    if (readOnly) {
      return (
        <View style={styles.readOnlyScale}>
          {[1, 2, 3, 4, 5].map(score => (
            <View
              key={score}
              style={[styles.readOnlyScore, score <= value ? styles.scoreFilled : styles.scoreEmpty]}
            >
              <Text style={styles.scoreText}>{score}</Text>
            </View>
          ))}
        </View>
      );
    }

    return (
      <View style={styles.scaleContainer}>
        <View style={styles.scaleButtons}>
          {[1, 2, 3, 4, 5].map(score => (
            <TouchableOpacity
              key={score}
              style={[
                styles.scaleButton,
                score === value && styles.scaleButtonSelected
              ]}
              onPress={() => setValue(score)}
            >
              <Text style={[
                styles.scaleButtonText,
                score === value && styles.scaleButtonTextSelected
              ]}>
                {score}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.rubricDescription}>{getRubricDescription(key, value)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 自我評估</Text>
      <Text style={styles.subtitle}>回顧過去一週的表現</Text>

      {assessments.map(({ key, label, value, setValue, emoji }) => (
        <View key={key} style={styles.assessmentItem}>
          <Text style={styles.assessmentLabel}>{label}</Text>
          {renderRubricScale(key, value, setValue)}
        </View>
      ))}

      {!readOnly && onSave && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>💾 儲存評估</Text>
        </TouchableOpacity>
      )}
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
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16
  },
  assessmentItem: {
    marginBottom: 20
  },
  assessmentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8
  },
  scaleContainer: {
    gap: 8
  },
  scaleButtons: {
    flexDirection: 'row',
    gap: 8
  },
  scaleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent'
  },
  scaleButtonSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#2563eb'
  },
  scaleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280'
  },
  scaleButtonTextSelected: {
    color: 'white'
  },
  rubricDescription: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic'
  },
  readOnlyScale: {
    flexDirection: 'row',
    gap: 8
  },
  readOnlyScore: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scoreFilled: {
    backgroundColor: '#3b82f6'
  },
  scoreEmpty: {
    backgroundColor: '#e5e7eb'
  },
  scoreText: {
    color: 'white',
    fontWeight: '600'
  },
  saveButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useUserStore } from '../stores/userStore';
import { useGameStore } from '../stores/gameStore';
import { useI18n } from '../i18n/I18nContext';
import { calculateWeeklySummary, formatWeeklySummaryText } from '../services/WeeklySummary';
import { calculateHeroReview, formatHeroReviewText, HeroReviewData } from '../services/WeeklyReview';
import { HabitCalendar } from '../components/HabitCalendar';
import { SelfAssessment } from '../components/SelfAssessment';
import { AbilityProgress } from '../components/AbilityProgress';

export function AdminScreen() {
  const { t } = useI18n();
  const userStore = useUserStore();
  const gameStore = useGameStore();
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [newParentMessage, setNewParentMessage] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  const [rewardReason, setRewardReason] = useState('');
  const [newPin, setNewPin] = useState('');
  const [newTask, setNewTask] = useState({ name: '', reward: '10', category: '自訂' });
  const [newReward, setNewReward] = useState({ name: '', cost: '100', icon: '🎁' });

  const verifyPin = () => {
    if (userStore.verifyPin(pinInput)) {
      setAdminUnlocked(true);
      setPinError('');
    } else {
      setPinError(t('pinError'));
    }
  };

  const lockAdmin = () => {
    setAdminUnlocked(false);
    setPinInput('');
  };

  const saveParentMsg = async () => {
    await userStore.saveParentMessage(newParentMessage);
    Alert.alert('💌', t('saveMessage') + ' ✓');
    setNewParentMessage('');
  };

  const addRewardPoints = () => {
    const amount = parseInt(rewardAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('⚠️', '請輸入有效數字');
      return;
    }
    userStore.addPoints(amount, rewardReason || '家長獎勵');
    Alert.alert('🎉', `+${amount} ${t('points')}`);
    setRewardAmount('');
    setRewardReason('');
  };

  const savePin = () => {
    if (newPin.length === 4) {
      userStore.setPin(newPin);
      Alert.alert('🔐', t('pinSet'));
      setNewPin('');
    } else {
      Alert.alert('⚠️', 'PIN 需要 4 位數字');
    }
  };

  const clearPin = () => {
    userStore.clearPin();
    Alert.alert('🔐', t('pinCleared'));
  };

  const addNewTask = () => {
    if (!newTask.name.trim()) {
      Alert.alert('⚠️', '請輸入任務名稱');
      return;
    }
    userStore.addTask({
      name: newTask.name,
      reward: parseInt(newTask.reward) || 10,
      category: newTask.category
    });
    Alert.alert('✅', '任務已新增');
    setNewTask({ name: '', reward: '10', category: '自訂' });
  };

  const addNewReward = () => {
    if (!newReward.name.trim()) {
      Alert.alert('⚠️', '請輸入禮物名稱');
      return;
    }
    userStore.addReward({
      name: newReward.name,
      cost: parseInt(newReward.cost) || 100,
      icon: newReward.icon || '🎁'
    });
    Alert.alert('✅', '禮物已新增');
    setNewReward({ name: '', cost: '100', icon: '🎁' });
  };

  const handleResetData = () => {
    Alert.alert(
      '⚠️',
      t('resetConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => userStore.resetAll() }
      ]
    );
  };

  const handleExportData = async () => {
    const data = await userStore.exportData();
    Alert.alert('📤', JSON.stringify(data, null, 2));
  };

  if (!adminUnlocked) {
    return (
      <View style={styles.lockScreen}>
        <Text style={styles.lockIcon}>🔐</Text>
        <Text style={styles.lockTitle}>{t('adminConsole')}</Text>
        <Text style={styles.lockSubtitle}>{t('needPin')}</Text>
        <TextInput
          style={styles.pinInput}
          value={pinInput}
          onChangeText={setPinInput}
          placeholder={t('enterPin')}
          keyboardType="number-pad"
          maxLength={4}
          secureTextEntry
        />
        {pinError ? <Text style={styles.pinError}>{pinError}</Text> : null}
        <TouchableOpacity style={styles.unlockButton} onPress={verifyPin}>
          <Text style={styles.unlockButtonText}>{t('confirm')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.setPinButton} onPress={() => {
          if (!userStore.settings?.adminPin) {
            setNewPin('1234');
            userStore.setPin('1234');
            Alert.alert('🔐', 'PIN 已設定為 1234');
          }
        }}>
          <Text style={styles.setPinText}>設定預設 PIN</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const categories = [t('exercise'), t('school'), t('study'), t('chores'), t('habit'), t('custom')];

  const pendingCount = userStore.pendingRewards.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>🔧 {t('adminConsole')}</Text>
        <TouchableOpacity onPress={lockAdmin}>
          <Text style={styles.lockBtn}>🔒 {t('lock')}</Text>
        </TouchableOpacity>
      </View>

      {pendingCount > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏳ {t('pendingRewards') || '待確認獎勵'} ({pendingCount})</Text>
          {userStore.pendingRewards.map(pending => (
            <View key={pending.id} style={styles.pendingItem}>
              <View style={styles.pendingInfo}>
                <Text style={styles.pendingTask}>{pending.taskName}</Text>
                <Text style={styles.pendingMeta}>
                  +{pending.reward} pts | {pending.category}
                </Text>
              </View>
              <View style={styles.pendingActions}>
                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={() => {
                    userStore.approvePendingReward(pending.id);
                    Alert.alert('✅', '已確認獎勵');
                  }}
                >
                  <Text style={styles.approveButtonText}>✓</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => {
                    userStore.rejectPendingReward(pending.id);
                  }}
                >
                  <Text style={styles.rejectButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💌 {t('parentMessage')}</Text>
        <TextInput
          style={styles.textArea}
          value={newParentMessage}
          onChangeText={setNewParentMessage}
          placeholder={t('parentMessagePlaceholder')}
          multiline
        />
        <TouchableOpacity style={styles.primaryButton} onPress={saveParentMsg}>
          <Text style={styles.primaryButtonText}>{t('saveMessage')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎁 {t('rewardChild')}</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={rewardAmount}
            onChangeText={setRewardAmount}
            placeholder={t('points')}
            keyboardType="number-pad"
          />
          <TextInput
            style={[styles.input, styles.flex1]}
            value={rewardReason}
            onChangeText={setRewardReason}
            placeholder={t('reason')}
          />
          <TouchableOpacity style={styles.addButton} onPress={addRewardPoints}>
            <Text style={styles.addButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>➕ {t('addTask')}</Text>
        <TextInput
          style={styles.input}
          value={newTask.name}
          onChangeText={(v) => setNewTask({ ...newTask, name: v })}
          placeholder={t('taskName')}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={newTask.reward}
            onChangeText={(v) => setNewTask({ ...newTask, reward: v })}
            placeholder={t('rewardPoints')}
            keyboardType="number-pad"
          />
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => {
              const cats = ['自訂', '運動', '學校', '學習', '家務', '習慣'];
              const current = newTask.category;
              const idx = cats.indexOf(current);
              const next = cats[(idx + 1) % cats.length];
              setNewTask({ ...newTask, category: next });
            }}
          >
            <Text>{newTask.category}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={addNewTask}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎁 {t('addReward')}</Text>
        <TextInput
          style={styles.input}
          value={newReward.name}
          onChangeText={(v) => setNewReward({ ...newReward, name: v })}
          placeholder={t('rewardName')}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={newReward.cost}
            onChangeText={(v) => setNewReward({ ...newReward, cost: v })}
            placeholder={t('cost')}
            keyboardType="number-pad"
          />
          <TextInput
            style={styles.iconInput}
            value={newReward.icon}
            onChangeText={(v) => setNewReward({ ...newReward, icon: v })}
            placeholder="🎁"
          />
          <TouchableOpacity style={styles.addButton} onPress={addNewReward}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔐 {t('setPin')}</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={newPin}
            onChangeText={setNewPin}
            placeholder={t('newPin')}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
          />
          <TouchableOpacity style={styles.pinButton} onPress={savePin}>
            <Text style={styles.pinButtonText}>✓</Text>
          </TouchableOpacity>
          {userStore.settings?.adminPin && (
            <TouchableOpacity style={styles.clearPinButton} onPress={clearPin}>
              <Text style={styles.clearPinText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 {t('weeklySummary') || '每週摘要'}</Text>
        <TouchableOpacity
          style={styles.summaryButton}
          onPress={() => {
            const summary = calculateWeeklySummary(
              userStore.activityLog,
              userStore.tasks,
              userStore.habitCalendar
            );
            const text = formatWeeklySummaryText(summary);
            Alert.alert('📊 每週摘要', text);
          }}
        >
          <Text style={styles.summaryButtonText}>📈 查看本週摘要</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 習慣日曆</Text>
        <Text style={styles.calendarSubtitle}>
          連續 {userStore.getStreakDays()} 日完成任務 🔥
        </Text>
        <HabitCalendar habitCalendar={userStore.habitCalendar} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 {t('weeklyHeroReview') || '每週英雄回顧'}</Text>
        <Text style={styles.calendarSubtitle}>檢視每週進度與成長</Text>
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => {
            const summary = calculateWeeklySummary(
              userStore.activityLog,
              userStore.tasks,
              userStore.habitCalendar
            );
            const review = calculateHeroReview(summary, gameStore.abilities);
            const text = formatHeroReviewText(review);
            Alert.alert('📊 ' + t('weeklyHeroReview'), text);
          }}
        >
          <Text style={styles.reviewButtonText}>📊 生成英雄回顧</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 四維能力儀表板</Text>
        <AbilityProgress abilities={gameStore.abilities} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 自我評估</Text>
        <SelfAssessment readOnly />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💾 {t('dataManage')}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.exportButton} onPress={handleExportData}>
            <Text style={styles.exportButtonText}>📤 JSON</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.exportButton, styles.resetButton]} onPress={handleResetData}>
            <Text style={styles.exportButtonText}>🔄 {t('resetData')}</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  lockScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f9fafb'
  },
  lockIcon: {
    fontSize: 64,
    marginBottom: 16
  },
  lockTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937'
  },
  lockSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    marginBottom: 24
  },
  pinInput: {
    width: '80%',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 8
  },
  pinError: {
    color: '#ef4444',
    marginTop: 8,
    fontSize: 14
  },
  unlockButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24
  },
  unlockButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  },
  setPinButton: {
    marginTop: 16
  },
  setPinText: {
    color: '#6b7280',
    fontSize: 14
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937'
  },
  lockBtn: {
    fontSize: 14,
    color: '#ef4444',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8
  },
  flex1: {
    flex: 2
  },
  iconInput: {
    width: 50,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlign: 'center'
  },
  addButton: {
    backgroundColor: '#22c55e',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600'
  },
  selectButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db'
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  pinButton: {
    backgroundColor: '#3b82f6',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pinButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600'
  },
  clearPinButton: {
    backgroundColor: '#ef4444',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  clearPinText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600'
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12
  },
  exportButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  resetButton: {
    backgroundColor: '#ef4444'
  },
  exportButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
  },
  summaryButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  summaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  pendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  pendingInfo: {
    flex: 1
  },
  pendingTask: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937'
  },
  pendingMeta: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2
  },
  pendingActions: {
    flexDirection: 'row',
    gap: 8
  },
  approveButton: {
    backgroundColor: '#22c55e',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  approveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  },
  rejectButton: {
    backgroundColor: '#ef4444',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rejectButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  },
  calendarSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12
  },
  reviewButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  reviewButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});
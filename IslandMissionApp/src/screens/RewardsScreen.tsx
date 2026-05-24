import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import { useUserStore } from '../stores/userStore';
import { useI18n } from '../i18n/I18nContext';

export function RewardsScreen() {
  const { t } = useI18n();
  const userStore = useUserStore();
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [pinError, setPinError] = useState(false);

  const handleClaim = (rewardId: string) => {
    const reward = userStore.rewards.find(r => r.id === rewardId);
    if (!reward) return;

    if (!reward.available) {
      Alert.alert('❌', '這個禮物暫時不可用');
      return;
    }

    if (userStore.userPoints < reward.cost) {
      Alert.alert('💸', t('insufficient', { cost: reward.cost.toString() }));
      return;
    }

    if (userStore.settings?.adminPin) {
      setSelectedReward(rewardId);
      setShowPinModal(true);
      setPinInput('');
      setPinError(false);
    } else {
      confirmClaim(rewardId);
    }
  };

  const confirmClaim = (rewardId: string) => {
    const reward = userStore.rewards.find(r => r.id === rewardId);
    if (!reward) return;

    Alert.alert(
      '🎁',
      `確定要兌換「${reward.name}」嗎？需要 ${reward.cost} ${t('points')}。`,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('exchange'),
          onPress: () => {
            const success = userStore.claimReward(rewardId);
            if (success) {
              Alert.alert('🎉', `已兌換「${reward.name}」！`);
            }
          }
        }
      ]
    );
  };

  const handlePinConfirm = () => {
    if (userStore.verifyPin(pinInput)) {
      setShowPinModal(false);
      setPinInput('');
      setPinError(false);
      if (selectedReward) {
        confirmClaim(selectedReward);
      }
    } else {
      setPinError(true);
    }
  };

  const handleClosePinModal = () => {
    setShowPinModal(false);
    setPinInput('');
    setPinError(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.headerTitle}>🎁 {t('rewardStore')}</Text>
          <Text style={styles.headerSubtitle}>{t('pointsToExchange')}</Text>
        </View>
        <View style={styles.pointsDisplay}>
          <Text style={styles.pointsValue}>{userStore.userPoints}</Text>
          <Text style={styles.pointsLabel}>{t('points')}</Text>
        </View>
      </View>

      <FlatList
        data={userStore.rewards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const canClaim = item.available && userStore.userPoints >= item.cost;
          return (
            <View style={[styles.rewardCard, !canClaim && styles.disabledCard]}>
              <Text style={styles.rewardIcon}>{item.icon}</Text>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardName}>{item.name}</Text>
                <Text style={styles.rewardCost}>
                  {item.cost} {t('points')}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.claimButton, !canClaim && styles.disabledButton]}
                onPress={() => handleClaim(item.id)}
                disabled={!canClaim}
                accessibilityLabel={!item.available ? 'unavailable' : !canClaim ? 'not enough points' : 'claim reward'}
              >
                <Text style={styles.claimButtonText}>
                  {!item.available ? '❌' : !canClaim ? '💸' : '🎁'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <Modal visible={showPinModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🔐 {t('needPin')}</Text>
            <Text style={styles.modalSubtitle}>請家長輸入 PIN 確認兌換</Text>
            <TextInput
              style={[styles.pinInput, pinError && styles.pinInputError]}
              value={pinInput}
              onChangeText={setPinInput}
              placeholder={t('enterPin')}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
            />
            {pinError && <Text style={styles.pinErrorText}>{t('pinError')}</Text>}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={handleClosePinModal}>
                <Text>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmButton} onPress={handlePinConfirm}>
                <Text style={styles.modalConfirmText}>{t('confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  headerCard: {
    backgroundColor: '#f3e8ff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#a855f7'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937'
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2
  },
  pointsDisplay: {
    alignItems: 'flex-end'
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#a855f7'
  },
  pointsLabel: {
    fontSize: 12,
    color: '#6b7280'
  },
  list: {
    padding: 16,
    paddingBottom: 100
  },
  rewardCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  disabledCard: {
    opacity: 0.5
  },
  rewardIcon: {
    fontSize: 36,
    marginRight: 12
  },
  rewardInfo: {
    flex: 1
  },
  rewardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937'
  },
  rewardCost: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2
  },
  claimButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#a855f7',
    justifyContent: 'center',
    alignItems: 'center'
  },
  disabledButton: {
    backgroundColor: '#d1d5db'
  },
  claimButtonText: {
    fontSize: 20
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '85%'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16
  },
  pinInput: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 8
  },
  pinInputError: {
    borderColor: '#ef4444'
  },
  pinErrorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#e5e7eb'
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#3b82f6'
  },
  modalConfirmText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  }
});
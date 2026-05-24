import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput, Modal } from 'react-native';
import { useUserStore } from '../stores/userStore';
import { useI18n } from '../i18n/I18nContext';
import { langs, LangCode } from '../i18n/translations';

export function SettingsScreen() {
  const { t, lang, setLang } = useI18n();
  const userStore = useUserStore();
  const [showNameModal, setShowNameModal] = useState(false);
  const [editName, setEditName] = useState('');

  const handleEditName = () => {
    setEditName(userStore.currentUser?.name || '');
    setShowNameModal(true);
  };

  const handleSaveName = () => {
    if (editName.trim()) {
      userStore.updateName(editName.trim());
      setShowNameModal(false);
    }
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ {t('settings')}</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.row} onPress={handleEditName}>
          <Text style={styles.rowLabel}>👤 {t('userName')}</Text>
          <Text style={styles.rowValue}>{userStore.currentUser?.name}</Text>
        </TouchableOpacity>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>💰 {t('pointsBalance')}</Text>
          <Text style={[styles.rowValue, styles.pointsValue]}>
            {userStore.userPoints} {t('points')}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>📅 {t('accountCreated')}</Text>
          <Text style={styles.rowValue}>{userStore.currentUser?.createdAt}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌐 Language / 語言</Text>
        {langs.map((l) => (
          <TouchableOpacity
            key={l.code}
            style={[styles.langOption, lang === l.code && styles.langOptionActive]}
            onPress={() => setLang(l.code as LangCode)}
          >
            <Text style={styles.langFlag}>{l.flag}</Text>
            <Text style={styles.langName}>{l.name}</Text>
            {lang === l.code && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>🔊 {t('sound')}</Text>
          <Text style={styles.rowValue}>
            {userStore.settings?.sound ? t('on') : t('off')}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>💾 {t('dataStatus')}</Text>
          <Text style={[styles.rowValue, { color: '#22c55e' }]}>✅ {t('saved')}</Text>
        </View>

        <TouchableOpacity
          style={[styles.row, styles.toggleRow]}
          onPress={() => {
            userStore.setParentApprovalMode(!userStore.settings.parentApprovalMode);
          }}
        >
          <View>
            <Text style={styles.rowLabel}>👨‍👩‍👧 家長確認模式</Text>
            <Text style={styles.toggleDescription}>
              完成任務後需要家長確認才能獲得積分
            </Text>
          </View>
          <View style={[
            styles.toggle,
            userStore.settings.parentApprovalMode && styles.toggleActive
          ]}>
            <Text style={styles.toggleText}>
              {userStore.settings.parentApprovalMode ? '開' : '關'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>⏱️ 今日使用時間</Text>
          <Text style={styles.rowValue}>
            {userStore.getUsageMinutes()} 分鐘
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💾 {t('dataManage')}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.exportButton} onPress={handleExportData}>
            <Text style={styles.buttonText}>📤 {t('exportData')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.exportButton, styles.resetButton]} onPress={handleResetData}>
            <Text style={styles.buttonText}>🔄 {t('resetData')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={showNameModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('userName')}</Text>
            <TextInput
              style={styles.modalInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="請輸入名字"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowNameModal(false)}>
                <Text>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveName}>
                <Text style={styles.modalSaveText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937'
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
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  rowLabel: {
    fontSize: 16,
    color: '#374151'
  },
  rowValue: {
    fontSize: 16,
    color: '#6b7280'
  },
  pointsValue: {
    color: '#22c55e',
    fontWeight: '600'
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f9fafb'
  },
  langOptionActive: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#3b82f6'
  },
  langFlag: {
    fontSize: 20,
    marginRight: 12
  },
  langName: {
    fontSize: 16,
    color: '#374151',
    flex: 1
  },
  checkmark: {
    fontSize: 18,
    color: '#3b82f6',
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
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600'
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
    width: '80%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center'
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#e5e7eb'
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#3b82f6'
  },
  modalSaveText: {
    color: 'white',
    fontWeight: '600'
  },
  toggleRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8
  },
  toggleDescription: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4
  },
  toggle: {
    backgroundColor: '#d1d5db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center'
  },
  toggleActive: {
    backgroundColor: '#22c55e'
  },
  toggleText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14
  }
});
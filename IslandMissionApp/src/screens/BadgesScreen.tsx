import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useUserStore } from '../stores/userStore';
import { useI18n } from '../i18n/I18nContext';
import { BadgeCard } from '../components/BadgeCard';

export function BadgesScreen() {
  const { t } = useI18n();
  const userStore = useUserStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏅 {t('badgeWall')}</Text>
        <Text style={styles.subtitle}>{t('collectBadges')}</Text>
        <View style={styles.countContainer}>
          <Text style={styles.countValue}>{userStore.unlockedBadges.length}</Text>
          <Text style={styles.countSeparator}>/</Text>
          <Text style={styles.countTotal}>{userStore.badges.length}</Text>
        </View>
      </View>

      <FlatList
        data={userStore.badges}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => <BadgeCard badge={item} />}
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
    backgroundColor: '#fef3c7',
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937'
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8
  },
  countValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#f59e0b'
  },
  countSeparator: {
    fontSize: 24,
    color: '#9ca3af',
    marginHorizontal: 4
  },
  countTotal: {
    fontSize: 24,
    color: '#6b7280'
  },
  list: {
    padding: 16,
    paddingBottom: 100
  },
  row: {
    justifyContent: 'space-between'
  }
});
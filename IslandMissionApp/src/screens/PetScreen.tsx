import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useGameStore } from '../stores/gameStore';
import { useI18n } from '../i18n/I18nContext';
import { PetCard } from '../components/PetCard';

export function PetScreen() {
  const { t } = useI18n();
  const gameStore = useGameStore();

  const handleFeed = () => {
    gameStore.feedPet(20);
  };

  const handlePlay = () => {
    gameStore.playWithPet(20);
  };

  const petTemplates = gameStore.petTemplates;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>🐾 {t('pet')}</Text>
      </View>

      {gameStore.pet ? (
        <>
          <PetCard
            pet={gameStore.pet as any}
            onFeed={handleFeed}
            onPlay={handlePlay}
          />

          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>🎮 {t('abilityProgress')}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{gameStore.pet.totalFed || 0}</Text>
                <Text style={styles.statLabel}>{t('totalFed')}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{gameStore.pet.totalPlayed || 0}</Text>
                <Text style={styles.statLabel}>{t('totalPlayed')}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{gameStore.pet.daysAdopted || 0}</Text>
                <Text style={styles.statLabel}>{t('daysWithPet')}</Text>
              </View>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.adoptionSection}>
          <Text style={styles.adoptionTitle}>{t('adoptPetTip')}</Text>
          <View style={styles.petGrid}>
            {petTemplates.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={styles.petOption}
                onPress={() => gameStore.selectPet(template.id)}
              >
                <Text style={styles.petOptionIcon}>{template.emoji}</Text>
                <Text style={styles.petOptionName}>{template.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
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
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937'
  },
  statsSection: {
    marginTop: 24
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12
  },
  statBox: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937'
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4
  },
  adoptionSection: {
    marginTop: 20
  },
  adoptionTitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16
  },
  petGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  petOption: {
    width: '47%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  petOptionIcon: {
    fontSize: 48
  },
  petOptionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 8
  }
});
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { I18nProvider, useI18n } from './src/i18n/I18nContext';
import { useUserStore } from './src/stores/userStore';
import { useGameStore } from './src/stores/gameStore';
import { HomeScreen } from './src/screens/HomeScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import { RewardsScreen } from './src/screens/RewardsScreen';
import { BadgesScreen } from './src/screens/BadgesScreen';
import { PetScreen } from './src/screens/PetScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { AdminScreen } from './src/screens/AdminScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { WeeklyReviewScreen } from './src/screens/WeeklyReviewScreen';
import { timeTracker, DAILY_LIMIT_MINUTES } from './src/services/TimeTracker';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  home: '🏠',
  tasks: '📋',
  rewards: '🎁',
  badges: '🏅',
  stats: '📊',
  pet: '🐾',
  settings: '⚙️',
  admin: '🔧'
};

function TimeReminderModal({ visible, dailyMinutes, onClose }: { visible: boolean; dailyMinutes: number; onClose: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.reminderOverlay}>
        <View style={styles.reminderContent}>
          <Text style={styles.reminderIcon}>⏰</Text>
          <Text style={styles.reminderTitle}>使用時間提醒</Text>
          <Text style={styles.reminderText}>
            今日使用時間已達 {dailyMinutes} 分鐘，建议休息一下！
          </Text>
          <Text style={styles.reminderSubtext}>
            健康使用習慣很重要，记得适时放松眼睛和身体
          </Text>
          <TouchableOpacity style={styles.reminderButton} onPress={onClose}>
            <Text style={styles.reminderButtonText}>我知道了</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function MainNavigator() {
  const { t } = useI18n();
  const userStore = useUserStore();
  const gameStore = useGameStore();
  const [isReady, setIsReady] = useState(false);
  const [showTimeReminder, setShowTimeReminder] = useState(false);
  const [dailyMinutes, setDailyMinutes] = useState(0);

  useEffect(() => {
    const init = async () => {
      await userStore.init();
      await gameStore.init();
      setIsReady(true);
      timeTracker.start();
    };
    init();

    const checkInterval = setInterval(async () => {
      const result = await timeTracker.checkTimeLimit();
      if (result.shouldShowReminder) {
        setDailyMinutes(result.dailyMinutes);
        setShowTimeReminder(true);
        timeTracker.markReminderShown();
      }
    }, 60000);

    return () => {
      clearInterval(checkInterval);
      timeTracker.stop();
    };
  }, []);

  const handleCloseReminder = () => {
    setShowTimeReminder(false);
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>🏅 IslandMissionApp</Text>
      </View>
    );
  }

  return (
    <>
      <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: () => (
          <Text style={styles.tabIcon}>{TAB_ICONS[route.name] || '📌'}</Text>
        ),
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
        headerShown: false,
        tabBarStyle: {
          height: 80,
          paddingTop: 8,
          paddingBottom: 24,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb'
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500'
        }
      })}
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{ tabBarLabel: t('home') }}
      />
      <Tab.Screen
        name="tasks"
        component={TasksScreen}
        options={{ tabBarLabel: t('tasks') }}
      />
      <Tab.Screen
        name="rewards"
        component={RewardsScreen}
        options={{ tabBarLabel: t('rewards') }}
      />
      <Tab.Screen
        name="badges"
        component={BadgesScreen}
        options={{ tabBarLabel: t('badges') }}
      />
      <Tab.Screen
        name="stats"
        component={StatsScreen}
        options={{ tabBarLabel: t('stats') }}
      />
      <Tab.Screen
        name="pet"
        component={PetScreen}
        options={{ tabBarLabel: t('pet') }}
      />
      <Tab.Screen
        name="admin"
        component={AdminScreen}
        options={{ tabBarLabel: t('admin') }}
      />
      <Tab.Screen
        name="settings"
        component={SettingsScreen}
        options={{ tabBarLabel: t('settings') }}
      />
    </Tab.Navigator>
    <TimeReminderModal
      visible={showTimeReminder}
      dailyMinutes={dailyMinutes}
      onClose={handleCloseReminder}
    />
    </>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </View>
    </I18nProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '600',
    color: '#3b82f6'
  },
  tabIcon: {
    fontSize: 24
  },
  reminderOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  reminderContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 28,
    width: '85%',
    alignItems: 'center'
  },
  reminderIcon: {
    fontSize: 56,
    marginBottom: 16
  },
  reminderTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12
  },
  reminderText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8
  },
  reminderSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20
  },
  reminderButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12
  },
  reminderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});
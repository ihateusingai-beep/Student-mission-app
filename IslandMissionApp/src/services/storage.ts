import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER: 'challengehero_user',
  TASKS: 'challengehero_tasks',
  REWARDS: 'challengehero_rewards',
  BADGES: 'challengehero_badges',
  LOGS: 'challengehero_logs',
  SETTINGS: 'challengehero_settings',
  LANG: 'challengehero_lang',
  PET: 'challengehero_pet',
  LEADERBOARD: 'challengehero_leaderboard',
  THEME: 'challengehero_theme',
  UNLOCKED_THEMES: 'challengehero_unlocked_themes',
  ABILITIES: 'challengehero_abilities',
  DAILY_MISSION: 'challengehero_daily_mission',
  LUCK_WHEEL: 'challengehero_luck_wheel',
  CERTIFICATES: 'challengehero_certificates',
  SPINS: 'challengehero_spins',
  PARENT_MESSAGE: 'challengehero_parent_message',
  PENDING_REWARDS: 'challengehero_pending_rewards',
  USAGE_STATS: 'challengehero_usage_stats',
  HABIT_CALENDAR: 'challengehero_habit_calendar',
  MILESTONES: 'challengehero_milestones',
};

class Storage {
  today: string;

  constructor() {
    this.today = new Date().toDateString();
  }

  async loadUser(): Promise<any | null> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch (e) { console.warn('// silent skip: load user failed:', e); }
    return null;
  }

  async saveUser(user: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) { console.warn('// silent skip: save user failed:', e); }
  }

  async loadLanguage(): Promise<string> {
    const val = await AsyncStorage.getItem(STORAGE_KEYS.LANG);
    return val || 'zh-HK';
  }

  async saveLanguage(lang: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.LANG, lang);
  }

  async loadPet(): Promise<any | null> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.PET);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  }

  async savePet(pet: any): Promise<void> {
    try { await AsyncStorage.setItem(STORAGE_KEYS.PET, JSON.stringify(pet)); } catch (e) {}
  }

  async loadLeaderboard(): Promise<any[]> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  }

  async saveLeaderboard(board: any[]): Promise<void> {
    try { await AsyncStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(board)); } catch (e) {}
  }

  async loadTheme(): Promise<string> {
    const val = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    return val || 'default';
  }

  async saveTheme(theme: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  async loadUnlockedThemes(): Promise<string[]> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.UNLOCKED_THEMES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['default'];
  }

  async saveUnlockedThemes(themes: string[]): Promise<void> {
    try { await AsyncStorage.setItem(STORAGE_KEYS.UNLOCKED_THEMES, JSON.stringify(themes)); } catch (e) {}
  }

  async loadAbilities(): Promise<any | null> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.ABILITIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  }

  async saveAbilities(abilities: any): Promise<void> {
    try { await AsyncStorage.setItem(STORAGE_KEYS.ABILITIES, JSON.stringify(abilities)); } catch (e) {}
  }

  async loadDailyMission(): Promise<any | null> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_MISSION);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  }

  async saveDailyMission(mission: any): Promise<void> {
    try { await AsyncStorage.setItem(STORAGE_KEYS.DAILY_MISSION, JSON.stringify(mission)); } catch (e) {}
  }

  async loadLuckWheel(): Promise<any | null> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.LUCK_WHEEL);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  }

  async saveLuckWheel(wheel: any): Promise<void> {
    try { await AsyncStorage.setItem(STORAGE_KEYS.LUCK_WHEEL, JSON.stringify(wheel)); } catch (e) {}
  }

  async loadCertificates(): Promise<string[]> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.CERTIFICATES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  }

  async saveCertificates(certs: string[]): Promise<void> {
    try { await AsyncStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certs)); } catch (e) {}
  }

  async loadSpins(): Promise<{date: string, count: number}> {
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.SPINS);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.date === new Date().toDateString()) {
        return data;
      }
    }
    return { date: new Date().toDateString(), count: 0 };
  }

  async saveSpins(data: {date: string, count: number}): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.SPINS, JSON.stringify(data));
  }

  async loadTasks(): Promise<any[] | null> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
      const data = saved ? JSON.parse(saved) : null;
      if (data?.lastDate !== this.today) {
        if (data?.tasks) {
          data.tasks.forEach((t: any) => t.completedToday = false);
          data.lastDate = this.today;
          await this.saveTasks(data.tasks);
        }
        return data?.tasks ?? null;
      }
      return data?.tasks ?? null;
    } catch (e) { console.warn('// silent skip: load tasks failed:', e); }
    return null;
  }

  async saveTasks(tasks: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify({ tasks, lastDate: this.today }));
    } catch (e) { console.warn('// silent skip: save tasks failed:', e); }
  }

  async loadRewards(): Promise<any[] | null> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.REWARDS);
      if (saved) return JSON.parse(saved);
    } catch (e) { console.warn('// silent skip: load rewards failed:', e); }
    return null;
  }

  async saveRewards(rewards: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
    } catch (e) { console.warn('// silent skip: save rewards failed:', e); }
  }

  async loadBadges(): Promise<any[] | null> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.BADGES);
      if (saved) return JSON.parse(saved);
    } catch (e) { console.warn('// silent skip: load badges failed:', e); }
    return null;
  }

  async saveBadges(badges: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
    } catch (e) { console.warn('// silent skip: save badges failed:', e); }
  }

  async loadLogs(): Promise<any[] | null> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) { console.warn('// silent skip: load logs failed:', e); }
    return null;
  }

  async saveLogs(logs: any[]): Promise<void> {
    try {
      const trimmed = logs.slice(0, 50);
      await AsyncStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(trimmed));
    } catch (e) { console.warn('// silent skip: save logs failed:', e); }
  }

  async loadSettings(): Promise<any> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) { console.warn('// silent skip: load settings failed:', e); }
    return { sound: true, streak: 0, lastActiveDate: null };
  }

  async saveSettings(settings: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) { console.warn('// silent skip: save settings failed:', e); }
  }

  async updateStreak(): Promise<number> {
    const settings = await this.loadSettings();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (settings.lastActiveDate === today) {
    } else if (settings.lastActiveDate === yesterdayStr) {
      settings.streak = (settings.streak || 0) + 1;
    } else {
      settings.streak = 1;
    }
    settings.lastActiveDate = today;
    await this.saveSettings(settings);
    return settings.streak;
  }

  async clearAll(): Promise<void> {
    const keys = Object.values(STORAGE_KEYS);
    for (const key of keys) {
      await AsyncStorage.removeItem(key);
    }
  }

  async exportData(): Promise<any> {
    return {
      user: await this.loadUser(),
      tasks: await this.loadTasks(),
      rewards: await this.loadRewards(),
      badges: await this.loadBadges(),
      logs: await this.loadLogs(),
      settings: await this.loadSettings(),
      exportedAt: new Date().toISOString()
    };
  }

  async importData(data: any): Promise<void> {
    if (data.user) await this.saveUser(data.user);
    if (data.tasks) await this.saveTasks(data.tasks);
    if (data.rewards) await this.saveRewards(data.rewards);
    if (data.badges) await this.saveBadges(data.badges);
    if (data.logs) await this.saveLogs(data.logs);
    if (data.settings) await this.saveSettings(data.settings);
  }

  async loadParentMessage(): Promise<string> {
    try {
      const val = await AsyncStorage.getItem(STORAGE_KEYS.PARENT_MESSAGE);
      return val || '';
    } catch (e) {}
    return '';
  }

  async saveParentMessage(msg: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PARENT_MESSAGE, msg);
    } catch (e) {}
  }

  async loadPendingRewards(): Promise<any[]> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_REWARDS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  }

  async savePendingRewards(rewards: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PENDING_REWARDS, JSON.stringify(rewards));
    } catch (e) {}
  }

  async loadUsageStats(): Promise<{ dailyMinutes: number; lastActiveDate: string | null; totalSessions: number }> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.USAGE_STATS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { dailyMinutes: 0, lastActiveDate: null, totalSessions: 0 };
  }

  async saveUsageStats(stats: { dailyMinutes: number; lastActiveDate: string | null; totalSessions: number }): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USAGE_STATS, JSON.stringify(stats));
    } catch (e) {}
  }

  async loadHabitCalendar(): Promise<Record<string, number>> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.HABIT_CALENDAR);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  }

  async saveHabitCalendar(calendar: Record<string, number>): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HABIT_CALENDAR, JSON.stringify(calendar));
    } catch (e) {}
  }

  async loadMilestones(): Promise<any[]> {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.MILESTONES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  }

  async saveMilestones(milestones: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(milestones));
    } catch (e) {}
  }

  async updateUsageTime(minutes: number): Promise<void> {
    const today = new Date().toDateString();
    const stats = await this.loadUsageStats();

    let newStats;
    if (stats.lastActiveDate === today) {
      newStats = {
        ...stats,
        dailyMinutes: stats.dailyMinutes + minutes,
        totalSessions: stats.totalSessions + 1
      };
    } else {
      newStats = {
        dailyMinutes: minutes,
        lastActiveDate: today,
        totalSessions: 1
      };
    }

    await this.saveUsageStats(newStats);
  }
}

export const storage = new Storage();
export { STORAGE_KEYS };
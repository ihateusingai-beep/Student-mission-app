import { create } from 'zustand';
import { storage } from '../services/storage';
import { useGameStore } from './gameStore';
import { User, Task, Reward, Badge, ActivityLog, Settings, PendingReward, UsageStats, Milestone, MilestoneType } from '../types';

const DEFAULT_TASKS: Task[] = [
  { id: 't1', name: '運動30分鐘', reward: 10, category: '運動', completedToday: false, totalCount: 15 },
  { id: 't2', name: '自己上學', reward: 10, category: '學校', completedToday: false, totalCount: 20 },
  { id: 't3', name: '讀英文書2頁', reward: 15, category: '學習', completedToday: false, totalCount: 8 },
  { id: 't4', name: '讀中文圖書1章', reward: 15, category: '學習', completedToday: false, totalCount: 12 },
  { id: 't5', name: '倒垃圾', reward: 5, category: '家務', completedToday: false, totalCount: 25 },
  { id: 't6', name: '念一本英文書', reward: 100, category: '學習', completedToday: false, totalCount: 3 },
  { id: 't7', name: '10點睡覺', reward: 50, category: '習慣', completedToday: false, totalCount: 7 },
];

const DEFAULT_REWARDS: Reward[] = [
  { id: 'r1', name: '打機1小時', cost: 80, available: true, icon: '🎮' },
  { id: 'r2', name: '睇片1小時', cost: 50, available: true, icon: '📺' },
  { id: 'r3', name: '睇卡通1套', cost: 60, available: true, icon: '📺' },
  { id: 'r4', name: '公園玩30分鐘', cost: 40, available: true, icon: '🛝' },
  { id: 'r5', name: '食雪糕', cost: 30, available: true, icon: '🍦' },
  { id: 'r6', name: '食快餐', cost: 100, available: true, icon: '🍔' },
  { id: 'r7', name: '睇戲', cost: 150, available: true, icon: '🎬' },
  { id: 'r8', name: '添新文具', cost: 120, available: true, icon: '✏️' },
  { id: 'r9', name: '添新書', cost: 100, available: true, icon: '📚' },
  { id: 'r10', name: '去主題公園', cost: 500, available: true, icon: '🎡' },
  { id: 'r11', name: '養寵物', cost: 300, available: false, icon: '🐱' },
  { id: 'r12', name: '參加興趣班', cost: 400, available: false, icon: '🎨' },
];

const DEFAULT_BADGES: Badge[] = [
  { id: 'b1', name: '羽毛球高手', desc: '羽毛球高手認證', progress: 4, max: 10, icon: '🏸', unlocked: false, category: '運動' },
  { id: 'b2', name: '早睡Body好', desc: '早睡習慣', progress: 0, max: 3, icon: '😴', unlocked: false, category: '習慣' },
  { id: 'b3', name: '運動員', desc: '離開沙發開始運動', progress: 3, max: 10, icon: '🛋️', unlocked: false, category: '運動' },
  { id: 'b4', name: '汗水製造者', desc: '持續運動', progress: 3, max: 30, icon: '💦', unlocked: false, category: '運動' },
  { id: 'b5', name: '過動生物', desc: '運動量極高', progress: 3, max: 100, icon: '⚡', unlocked: false, category: '運動' },
  { id: 'b6', name: '海拔收集大師', desc: '收集海拔', progress: 1, max: 10, icon: '🏔️', unlocked: false, category: '運動' },
];

const DEFAULT_MILESTONES: Milestone[] = [
  { id: 'first_step', name: 'First Step', desc: 'Complete first task', icon: '👶', earnedAt: null, targetValue: 1, currentValue: 0 },
  { id: 'week_warrior', name: 'Week Warrior', desc: '7-day streak', icon: '🔥', earnedAt: null, targetValue: 7, currentValue: 0 },
  { id: 'month_master', name: 'Month Master', desc: '30-day streak', icon: '⭐', earnedAt: null, targetValue: 30, currentValue: 0 },
  { id: 'century_club', name: 'Century Club', desc: '100 tasks completed', icon: '💯', earnedAt: null, targetValue: 100, currentValue: 0 },
  { id: 'category_champion', name: 'Category Champion', desc: '50 tasks in one category', icon: '🏆', earnedAt: null, targetValue: 50, currentValue: 0 },
  { id: 'perfect_week', name: 'Perfect Week', desc: '100% completion for a week', icon: '🌟', earnedAt: null, targetValue: 1, currentValue: 0 },
  { id: 'early_bird', name: 'Early Bird', desc: 'Complete task before 9am', icon: '🐦', earnedAt: null, targetValue: 1, currentValue: 0 },
  { id: 'night_owl', name: 'Night Owl', desc: 'Complete task after 9pm', icon: '🦉', earnedAt: null, targetValue: 1, currentValue: 0 },
  { id: 'point_millionaire', name: 'Point Millionaire', desc: 'Earn 1000 total points', icon: '💰', earnedAt: null, targetValue: 1000, currentValue: 0 },
];

interface UserState {
  currentUser: User | null;
  tasks: Task[];
  rewards: Reward[];
  badges: Badge[];
  activityLog: ActivityLog[];
  settings: Settings;
  userPoints: number;
  completedCount: number;
  remainingTasks: number;
  unlockedBadges: Badge[];
  recentLogs: ActivityLog[];
  parentMessage: string;
  pendingRewards: PendingReward[];
  usageStats: UsageStats;
  habitCalendar: Record<string, number>;
  milestones: Milestone[];
  init: () => Promise<void>;
  completeTask: (taskId: string) => number;
  claimReward: (rewardId: string) => boolean;
  addTask: (taskData: Partial<Task>) => Task;
  removeTask: (taskId: string) => void;
  addReward: (rewardData: Partial<Reward>) => Reward;
  removeReward: (rewardId: string) => void;
  updateName: (name: string) => void;
  addPoints: (amount: number, reason: string) => void;
  addLog: (action: string, detail: string, points: number) => void;
  verifyPin: (input: string) => boolean;
  setPin: (pin: string) => boolean;
  clearPin: () => void;
  loadParentMessage: () => Promise<void>;
  saveParentMessage: (msg: string) => Promise<void>;
  saveAll: () => Promise<void>;
  exportData: () => Promise<any>;
  importData: (data: any) => Promise<void>;
  resetAll: () => Promise<void>;
  approvePendingReward: (pendingId: string) => void;
  rejectPendingReward: (pendingId: string) => void;
  setParentApprovalMode: (enabled: boolean) => void;
  updateUsageTime: (minutes: number) => Promise<void>;
  getUsageMinutes: () => number;
  recordHabitCompletion: (date: string) => Promise<void>;
  getStreakDays: () => number;
  checkMilestones: () => Milestone[];
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null,
  tasks: [],
  rewards: [],
  badges: [],
  activityLog: [],
  settings: { sound: true, streak: 0, lastActiveDate: null, adminPin: null, parentApprovalMode: false },
  userPoints: 0,
  completedCount: 0,
  remainingTasks: 0,
  unlockedBadges: [],
  recentLogs: [],
  parentMessage: '',
  pendingRewards: [],
  usageStats: { dailyMinutes: 0, lastActiveDate: null, totalSessions: 0 },
  habitCalendar: {},
  milestones: [],

  init: async () => {
    const savedUser = await storage.loadUser();
    const user = savedUser || {
      id: 'u_' + Date.now(),
      name: '小朋友',
      points: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    if (!savedUser) await storage.saveUser(user);

    const savedTasks = await storage.loadTasks();
    const tasks = savedTasks || DEFAULT_TASKS.map(t => ({ ...t }));
    if (!savedTasks) await storage.saveTasks(tasks);

    const savedRewards = await storage.loadRewards();
    const rewards = savedRewards || DEFAULT_REWARDS.map(r => ({ ...r }));
    if (!savedRewards) await storage.saveRewards(rewards);

    const savedBadges = await storage.loadBadges();
    const badges = savedBadges || DEFAULT_BADGES.map(b => ({ ...b }));
    if (!savedBadges) await storage.saveBadges(badges);

    const savedLogs = await storage.loadLogs();
    const logs = savedLogs || [];

    const savedSettings = await storage.loadSettings();
    const settings = savedSettings || { sound: true, streak: 0, lastActiveDate: null, adminPin: null };

    const streak = await storage.updateStreak();
    settings.streak = streak;

    const parentMsg = await storage.loadParentMessage();
    const pendingRewardsData = await storage.loadPendingRewards();
    const usageStatsData = await storage.loadUsageStats();
    const habitCalendarData = await storage.loadHabitCalendar();
    const savedMilestones = await storage.loadMilestones();
    const milestones = savedMilestones.length > 0 ? savedMilestones : DEFAULT_MILESTONES.map(m => ({ ...m }));

    const completedCount = tasks.filter(t => t.completedToday).length;

    set({
      currentUser: user,
      tasks,
      rewards,
      badges,
      activityLog: logs,
      settings,
      userPoints: user.points,
      completedCount,
      remainingTasks: tasks.length - completedCount,
      unlockedBadges: badges.filter(b => b.unlocked),
      recentLogs: logs.slice(0, 10),
      parentMessage: parentMsg,
      pendingRewards: pendingRewardsData.filter((p: any) => p.status === 'pending'),
      usageStats: usageStatsData,
      habitCalendar: habitCalendarData,
      milestones
    });
  },

  completeTask: (taskId: string) => {
    const { tasks, currentUser, badges, settings, pendingRewards, milestones } = get();
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.completedToday) return 0;

    const newTasks = tasks.map(t =>
      t.id === taskId ? { ...t, completedToday: true, totalCount: t.totalCount + 1 } : t
    );

    const newBadges = badges.map(badge => {
      if (badge.unlocked || badge.progress >= badge.max) return badge;
      if (badge.category && badge.category !== task.category) return badge;
      const newProgress = badge.progress + 1;
      const unlocked = newProgress >= badge.max;
      return { ...badge, progress: newProgress, unlocked };
    });

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    get().recordHabitCompletion(today);

    const currentPoints = currentUser?.points || 0;
    const currentStreak = get().getStreakDays();
    const totalTasksCompleted = get().activityLog.filter(l => l.action === '完成任務').length + 1;

    const updatedMilestones = milestones.map(m => {
      if (m.earnedAt) return m;
      let newValue = m.currentValue;
      switch (m.id) {
        case 'first_step':
          newValue = 1;
          break;
        case 'week_warrior':
        case 'month_master':
          newValue = currentStreak;
          break;
        case 'century_club':
          newValue = totalTasksCompleted;
          break;
        case 'category_champion':
          newValue = Math.max(newValue, task.totalCount + 1);
          break;
        case 'early_bird':
          if (now.getHours() < 9) newValue = 1;
          break;
        case 'night_owl':
          if (now.getHours() >= 21) newValue = 1;
          break;
        case 'point_millionaire':
          newValue = currentPoints;
          break;
      }
      return { ...m, currentValue: newValue };
    });

    if (settings.parentApprovalMode) {
      const pending: PendingReward = {
        id: 'pr_' + Date.now(),
        taskId: task.id,
        taskName: task.name,
        reward: task.reward,
        category: task.category,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      const newPending = [...pendingRewards, pending];
      const updatedTasks = newTasks.map(t =>
        t.id === taskId ? { ...t, completedToday: false } : t
      );
      set({
        tasks: updatedTasks,
        badges: newBadges,
        completedCount: updatedTasks.filter(t => t.completedToday).length,
        remainingTasks: updatedTasks.filter(t => !t.completedToday).length,
        unlockedBadges: newBadges.filter(b => b.unlocked),
        pendingRewards: newPending,
        milestones: updatedMilestones
      });
      storage.saveTasks(updatedTasks);
      storage.saveBadges(newBadges);
      storage.savePendingRewards(newPending);
      storage.saveMilestones(updatedMilestones);
      return 0;
    }

    const multiplier = useGameStore.getState().getTodayMultiplier();
    const finalReward = Math.floor(task.reward * multiplier);
    const newPoints = (currentUser?.points || 0) + finalReward;
    const newUser = currentUser ? { ...currentUser, points: newPoints } : null;

    const time = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newLog: ActivityLog = { id: Date.now(), time, action: '完成任務', detail: task.name, points: finalReward };
    const newLogs = [newLog, ...get().activityLog].slice(0, 200);

    set({
      tasks: newTasks,
      currentUser: newUser,
      userPoints: newPoints,
      activityLog: newLogs,
      badges: newBadges,
      completedCount: newTasks.filter(t => t.completedToday).length,
      remainingTasks: newTasks.filter(t => !t.completedToday).length,
      unlockedBadges: newBadges.filter(b => b.unlocked),
      recentLogs: newLogs.slice(0, 10),
      milestones: updatedMilestones
    });

    storage.saveUser(newUser!);
    storage.saveTasks(newTasks);
    storage.saveBadges(newBadges);
    storage.saveLogs(newLogs);
    storage.saveMilestones(updatedMilestones);

    return finalReward;
  },

  claimReward: (rewardId: string) => {
    const { rewards, currentUser, userPoints } = get();
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || !reward.available || userPoints < reward.cost) return false;

    const newPoints = userPoints - reward.cost;
    const newUser = currentUser ? { ...currentUser, points: newPoints } : null;

    const now = new Date();
    const time = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newLog: ActivityLog = { id: Date.now(), time, action: '兌換商品', detail: reward.name, points: -reward.cost };
    const newLogs = [newLog, ...get().activityLog].slice(0, 200);

    set({
      currentUser: newUser,
      userPoints: newPoints,
      activityLog: newLogs,
      recentLogs: newLogs.slice(0, 10)
    });

    storage.saveUser(newUser!);
    storage.saveLogs(newLogs);

    return true;
  },

  addTask: (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: 't' + Date.now(),
      name: taskData.name || '新任務',
      reward: taskData.reward || 10,
      category: taskData.category || '自訂',
      completedToday: false,
      totalCount: 0
    };
    const newTasks = [...get().tasks, newTask];
    set({ tasks: newTasks, remainingTasks: newTasks.filter(t => !t.completedToday).length });
    storage.saveTasks(newTasks);
    return newTask;
  },

  removeTask: (taskId: string) => {
    const newTasks = get().tasks.filter(t => t.id !== taskId);
    set({ tasks: newTasks, remainingTasks: newTasks.filter(t => !t.completedToday).length });
    storage.saveTasks(newTasks);
  },

  addReward: (rewardData: Partial<Reward>) => {
    const newReward: Reward = {
      id: 'r' + Date.now(),
      name: rewardData.name || '新禮物',
      cost: rewardData.cost || 100,
      available: true,
      icon: rewardData.icon || '🎁'
    };
    const newRewards = [...get().rewards, newReward];
    set({ rewards: newRewards });
    storage.saveRewards(newRewards);
    return newReward;
  },

  removeReward: (rewardId: string) => {
    const newRewards = get().rewards.filter(r => r.id !== rewardId);
    set({ rewards: newRewards });
    storage.saveRewards(newRewards);
  },

  updateName: (name: string) => {
    const { currentUser } = get();
    if (!currentUser) return;
    const updated = { ...currentUser, name };
    set({ currentUser: updated });
    storage.saveUser(updated);
  },

  addPoints: (amount: number, reason: string) => {
    const { currentUser, userPoints } = get();
    const newPoints = userPoints + amount;
    const newUser = currentUser ? { ...currentUser, points: newPoints } : null;

    const now = new Date();
    const time = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newLog: ActivityLog = { id: Date.now(), time, action: '獎勵', detail: reason, points: amount };
    const newLogs = [newLog, ...get().activityLog].slice(0, 200);

    set({ currentUser: newUser, userPoints: newPoints, activityLog: newLogs, recentLogs: newLogs.slice(0, 10) });
    storage.saveUser(newUser!);
    storage.saveLogs(newLogs);
  },

  addLog: (action: string, detail: string, points: number) => {
    const now = new Date();
    const time = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newLog: ActivityLog = { id: Date.now(), time, action, detail, points };
    const newLogs = [newLog, ...get().activityLog].slice(0, 200);
    set({ activityLog: newLogs, recentLogs: newLogs.slice(0, 10) });
    storage.saveLogs(newLogs);
  },

  verifyPin: (input: string) => {
    const { settings } = get();
    if (settings.adminPin === null || settings.adminPin === undefined) return false;
    return settings.adminPin === input;
  },

  setPin: (pin: string) => {
    if (pin && pin.length === 4) {
      const newSettings = { ...get().settings, adminPin: pin };
      set({ settings: newSettings });
      storage.saveSettings(newSettings);
      return true;
    }
    return false;
  },

  clearPin: () => {
    const newSettings = { ...get().settings, adminPin: null };
    set({ settings: newSettings });
    storage.saveSettings(newSettings);
  },

  loadParentMessage: async () => {
    const msg = await storage.loadParentMessage();
    set({ parentMessage: msg });
  },

  saveParentMessage: async (msg: string) => {
    await storage.saveParentMessage(msg);
    set({ parentMessage: msg });
  },

  saveAll: async () => {
    const { currentUser, tasks, rewards, badges } = get();
    if (currentUser) await storage.saveUser(currentUser);
    await storage.saveTasks(tasks);
    await storage.saveRewards(rewards);
    await storage.saveBadges(badges);
  },

  exportData: async () => {
    return await storage.exportData();
  },

  importData: async (data: any) => {
    await storage.importData(data);
    await get().init();
  },

  resetAll: async () => {
    const { currentUser } = get();
    const newUser = currentUser ? { ...currentUser, points: 0 } : null;
    const newTasks = DEFAULT_TASKS.map(t => ({ ...t, completedToday: false, totalCount: 0 }));
    const newBadges = DEFAULT_BADGES.map(b => ({ ...b, progress: 0, unlocked: false }));

    set({
      currentUser: newUser,
      tasks: newTasks,
      activityLog: [],
      badges: newBadges,
      userPoints: 0,
      completedCount: 0,
      remainingTasks: newTasks.length,
      pendingRewards: [],
      habitCalendar: {}
    });

    if (newUser) await storage.saveUser(newUser);
    await storage.saveTasks(newTasks);
    await storage.saveBadges(newBadges);
    await storage.saveLogs([]);
    await storage.savePendingRewards([]);
    await storage.saveHabitCalendar({});
  },

  approvePendingReward: (pendingId: string) => {
    const { pendingRewards, currentUser, userPoints } = get();
    const pending = pendingRewards.find(p => p.id === pendingId);
    if (!pending || pending.status !== 'pending') return;

    const newPoints = userPoints + pending.reward;
    const newUser = currentUser ? { ...currentUser, points: newPoints } : null;

    const now = new Date();
    const time = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newLog: ActivityLog = { id: Date.now(), time, action: '家長確認', detail: pending.taskName, points: pending.reward };
    const newLogs = [newLog, ...get().activityLog].slice(0, 200);

    const newPending = pendingRewards.map(p =>
      p.id === pendingId ? { ...p, status: 'approved' as const } : p
    );

    set({
      currentUser: newUser,
      userPoints: newPoints,
      activityLog: newLogs,
      recentLogs: newLogs.slice(0, 10),
      pendingRewards: newPending.filter(p => p.status === 'pending')
    });

    storage.saveUser(newUser!);
    storage.savePendingRewards(newPending);
    storage.saveLogs(newLogs);
  },

  rejectPendingReward: (pendingId: string) => {
    const { pendingRewards } = get();
    const newPending = pendingRewards.map(p =>
      p.id === pendingId ? { ...p, status: 'rejected' as const } : p
    );
    set({ pendingRewards: newPending.filter(p => p.status === 'pending') });
    storage.savePendingRewards(newPending);
  },

  setParentApprovalMode: (enabled: boolean) => {
    const newSettings = { ...get().settings, parentApprovalMode: enabled };
    set({ settings: newSettings });
    storage.saveSettings(newSettings);
  },

  updateUsageTime: async (minutes: number) => {
    const today = new Date().toDateString();
    const { usageStats } = get();

    let newStats: UsageStats;
    if (usageStats.lastActiveDate === today) {
      newStats = {
        ...usageStats,
        dailyMinutes: usageStats.dailyMinutes + minutes,
        totalSessions: usageStats.totalSessions + 1
      };
    } else {
      newStats = {
        dailyMinutes: minutes,
        lastActiveDate: today,
        totalSessions: 1
      };
    }

    set({ usageStats: newStats });
    await storage.saveUsageStats(newStats);
  },

  getUsageMinutes: () => {
    const today = new Date().toDateString();
    const { usageStats } = get();
    if (usageStats.lastActiveDate === today) {
      return usageStats.dailyMinutes;
    }
    return 0;
  },

  recordHabitCompletion: async (date: string) => {
    const { habitCalendar } = get();
    const newCalendar = { ...habitCalendar, [date]: (habitCalendar[date] || 0) + 1 };
    set({ habitCalendar: newCalendar });
    await storage.saveHabitCalendar(newCalendar);
  },

  getStreakDays: () => {
    const { habitCalendar } = get();
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (habitCalendar[dateStr] && habitCalendar[dateStr] > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  },

  checkMilestones: () => {
    const { milestones } = get();
    const newlyEarned: Milestone[] = [];
    const today = new Date().toISOString();

    const updated = milestones.map(m => {
      if (m.earnedAt) return m;
      if (m.currentValue >= m.targetValue) {
        const earned = { ...m, earnedAt: today };
        newlyEarned.push(earned);
        return earned;
      }
      return m;
    });

    if (newlyEarned.length > 0) {
      set({ milestones: updated });
      storage.saveMilestones(updated);
    }

    return newlyEarned;
  }
}));
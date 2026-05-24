import { create } from 'zustand';
import { storage } from '../services/storage';
import { PetTemplate, PetState, Ability, DailyMission, Theme, LeaderboardEntry, LuckWheel, WheelOption, Certificate } from '../types';

const PET_TEMPLATES: PetTemplate[] = [
  { id: 'cat', name: '🐱 小貓', emoji: '🐱' },
  { id: 'dog', name: '🐕 小狗', emoji: '🐕' },
  { id: 'hamster', name: '🐹 倉鼠', emoji: '🐹' },
  { id: 'rabbit', name: '🐰 兔仔', emoji: '🐰' },
  { id: 'chick', name: '🐣 雞仔', emoji: '🐣' }
];

const WHEEL_OPTIONS: WheelOption[] = [
  { multiplier: 1, label: '1x', color: '#94a3b8', weight: 30 },
  { multiplier: 1.5, label: '1.5x', color: '#22c55e', weight: 25 },
  { multiplier: 2, label: '2x', color: '#3b82f6', weight: 20 },
  { multiplier: 2.5, label: '2.5x', color: '#8b5cf6', weight: 12 },
  { multiplier: 3, label: '3x', color: '#f59e0b', weight: 8 },
  { multiplier: 0.5, label: '0.5x', color: '#ef4444', weight: 5 }
];

const CERTIFICATE_TEMPLATES: Certificate[] = [
  { id: 'first_task', name: '初戰告捷', desc: '完成第一個任務', icon: '🎯', requirement: 'tasks_1' },
  { id: 'streak_7', name: '連續達人', desc: '連續7日達成', icon: '🔥', requirement: 'streak_7' },
  { id: 'streak_30', name: '一個月坚持', desc: '連續30日達成', icon: '🏆', requirement: 'streak_30' },
  { id: 'points_100', name: '點數達人', desc: '累積100點', icon: '💰', requirement: 'points_100' },
  { id: 'points_500', name: '點數英雄', desc: '累積500點', icon: '⭐', requirement: 'points_500' },
  { id: 'badges_5', name: '徽章獵人', desc: '收集5個徽章', icon: '🏅', requirement: 'badges_5' },
  { id: 'all_categories', name: '全能挑戰者', desc: '完成所有類別任務', icon: '🌟', requirement: 'all_categories' },
  { id: 'pet_master', name: '寵物大師', desc: '寵物進化到Lv.3', icon: '🐲', requirement: 'pet_lv3' }
];

interface GameState {
  abilities: Record<string, Ability>;
  leaderboard: LeaderboardEntry[];
  petTemplates: PetTemplate[];
  petState: PetState;
  pet: PetState & { name: string; emoji: string; avatar: string; type: string; level: number } | null;
  dailyMission: DailyMission | null;
  dailyMissionDone: boolean;
  themes: Theme[];
  unlockedThemes: string[];
  currentTheme: string;
  luckWheel: LuckWheel;
  wheelOptions: WheelOption[];
  certificates: string[];
  certificateTemplates: Certificate[];
  init: () => Promise<void>;
  updateAbility: (category: string, points: number) => void;
  addAbilityXp: (category: string, points: number) => void;
  addPetExp: (exp: number) => boolean;
  selectPet: (petId: string) => void;
  feedPet: (amount?: number) => void;
  playWithPet: (happiness?: number) => void;
  getPetLevel: (exp: number) => number;
  getPetEvolutionEmoji: (petId: string, level: number) => string;
  generateDailyMission: () => void;
  checkDailyMission: (completedCategories: string[]) => number;
  unlockTheme: (themeId: string) => boolean;
  buyTheme: (themeId: string, cost: number, userPoints: number) => boolean;
  setTheme: (themeId: string) => void;
  canSpinWheel: () => boolean;
  spinWheel: () => WheelOption | null;
  getTodayMultiplier: () => number;
  checkCertificates: (userData: { totalPoints: number; currentStreak: number; totalTasks: number; badges: number; pet: any }) => Certificate[];
  setLeaderboard: (entries: LeaderboardEntry[]) => void;
  getUnlockedCertificates: () => Certificate[];
  getLockedCertificates: () => Certificate[];
  getLeaderboard: (type: string) => LeaderboardEntry[];
  setCurrentUserId: (userId: string) => void;
  leaderboardRank: number;
  currentUserId: string | null;
}

function getPetLevel(exp: number): number {
  if (exp >= 151) return 3;
  if (exp >= 51) return 2;
  return 1;
}

function getPetEvolutionEmoji(petId: string, level: number): string {
  const baseEmojis: Record<string, string> = { cat: '🐱', dog: '🐕', hamster: '🐹', rabbit: '🐰', chick: '🐣' };
  const evolvedEmojis: Record<string, string[]> = {
    cat: ['🐱', '😺', '🦁'],
    dog: ['🐕', '🐶', '🐺'],
    hamster: ['🐹', '🐨', '🐼'],
    rabbit: ['🐰', '🐇', '🦔'],
    chick: ['🐣', '🐥', '🦅']
  };
  const emojis = evolvedEmojis[petId] || [baseEmojis[petId] || '🐾'];
  return emojis[Math.min(level - 1, emojis.length - 1)];
}

export const useGameStore = create<GameState>((set, get) => ({
  abilities: {
    strength: { name: '💪 運動力', value: 0, max: 100, desc: '運動相關任務' },
    intelligence: { name: '🧠 學習力', value: 0, max: 100, desc: '學習相關任務' },
    diligence: { name: '🧹 家務力', value: 0, max: 100, desc: '家務相關任務' },
    discipline: { name: '🌙 習慣力', value: 0, max: 100, desc: '習慣養成' },
    school: { name: '🏫 學校力', value: 0, max: 100, desc: '學校相關任務' }
  },
  leaderboard: [],
  petTemplates: PET_TEMPLATES,
  petState: {
    id: null,
    hunger: 100,
    happiness: 100,
    exp: 0,
    totalFed: 0,
    totalPlayed: 0,
    daysAdopted: 0,
    lastDecayDate: null
  },
  pet: null,
  dailyMission: null,
  dailyMissionDone: false,
  themes: [
    { id: 'default', name: '🌲 森林', cost: 0, desc: '預設主題' },
    { id: 'ocean', name: '🌊 海洋', cost: 500, desc: '深海主題' },
    { id: 'space', name: '🌌 太空', cost: 800, desc: '星空主題' },
    { id: 'candy', name: '🍬 糖果', cost: 1000, desc: '繽紛主題' },
    { id: 'fire', name: '🔥 火焰', cost: 1500, desc: '火紅主題' },
    { id: 'rainbow', name: '🌈 彩虹', cost: 2000, desc: 'rainbow' }
  ],
  unlockedThemes: ['default'],
  currentTheme: 'default',
  luckWheel: {
    spinCount: 0,
    lastSpinDate: null,
    todayMultiplier: 1,
    todayBonus: 0,
    spinHistory: []
  },
  wheelOptions: WHEEL_OPTIONS,
  certificates: [],
  certificateTemplates: CERTIFICATE_TEMPLATES,
  leaderboardRank: 0,
  currentUserId: null,

  init: async () => {
    const savedPet = await storage.loadPet();
    const petState = savedPet && savedPet.id !== null && savedPet.id !== undefined
      ? {
          id: savedPet.id,
          hunger: savedPet.hunger ?? 100,
          happiness: savedPet.happiness ?? 100,
          exp: savedPet.exp ?? 0,
          totalFed: savedPet.totalFed ?? 0,
          totalPlayed: savedPet.totalPlayed ?? 0,
          daysAdopted: savedPet.daysAdopted ?? 0,
          lastDecayDate: savedPet.lastDecayDate ?? null
        }
      : {
          id: null,
          hunger: 100,
          happiness: 100,
          exp: 0,
          totalFed: 0,
          totalPlayed: 0,
          daysAdopted: 0,
          lastDecayDate: null
        };

    let pet: any = null;
    if (petState.id) {
      const template = PET_TEMPLATES.find(p => p.id === petState.id);
      if (template) {
        const level = getPetLevel(petState.exp);
        pet = {
          ...petState,
          name: template.name,
          emoji: template.emoji,
          avatar: getPetEvolutionEmoji(petState.id, level),
          type: template.id,
          level
        };
      }
    }

    const savedLeaderboard = await storage.loadLeaderboard();
    const savedTheme = await storage.loadTheme();
    const savedUnlockedThemes = await storage.loadUnlockedThemes();
    const savedWheel = await storage.loadLuckWheel();
    const savedCerts = await storage.loadCertificates();
    const savedAbilities = await storage.loadAbilities();

    const defaultAbilities = {
      strength: { name: '💪 運動力', value: 0, max: 100, desc: '運動相關任務' },
      intelligence: { name: '🧠 學習力', value: 0, max: 100, desc: '學習相關任務' },
      diligence: { name: '🧹 家務力', value: 0, max: 100, desc: '家務相關任務' },
      discipline: { name: '🌙 習慣力', value: 0, max: 100, desc: '習慣養成' },
      school: { name: '🏫 學校力', value: 0, max: 100, desc: '學校相關任務' }
    };
    const loadedAbilities = savedAbilities
      ? { ...defaultAbilities, ...savedAbilities }
      : defaultAbilities;

    const DECAY_RATE = 10;
    const today = new Date().toISOString().split('T')[0];
    let updatedPetState = petState;
    if (petState.id && petState.lastDecayDate) {
      const lastDecay = petState.lastDecayDate;
      if (lastDecay !== today) {
        const lastDate = new Date(lastDecay);
        const daysPassed = Math.floor((new Date(today).getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysPassed > 0) {
          const decay = Math.min(daysPassed * DECAY_RATE, 100);
          updatedPetState = {
            ...petState,
            hunger: Math.max(0, petState.hunger - decay),
            happiness: Math.max(0, petState.happiness - decay),
            lastDecayDate: today
          };
        }
      }
    }

    set({
      abilities: loadedAbilities,
      petState: updatedPetState,
      pet: pet ? { ...pet, hunger: updatedPetState.hunger, happiness: updatedPetState.happiness } : null,
      leaderboard: savedLeaderboard || [],
      currentTheme: savedTheme || 'default',
      unlockedThemes: savedUnlockedThemes || ['default'],
      luckWheel: savedWheel || { spinCount: 0, lastSpinDate: null, todayMultiplier: 1, todayBonus: 0, spinHistory: [] },
      certificates: savedCerts || []
    });

    get().generateDailyMission();
  },

  updateAbility: (category: string, points: number) => {
    const { abilities } = get();
    const key = category === '運動' ? 'strength'
      : category === '學校' ? 'school'
      : category === '學習' ? 'intelligence'
      : category === '家務' ? 'diligence'
      : category === '習慣' ? 'discipline'
      : 'strength';

    if (abilities[key]) {
      const newValue = Math.min(abilities[key].value + points, abilities[key].max);
      const newAbilities = { ...abilities, [key]: { ...abilities[key], value: newValue } };
      set({ abilities: newAbilities });
      storage.saveAbilities(newAbilities);
    }
  },

  addAbilityXp: (category: string, points: number) => {
    get().updateAbility(category, points);
  },

  addPetExp: (exp: number) => {
    const { petState } = get();
    if (!petState.id) return false;

    const oldLevel = getPetLevel(petState.exp);
    const newExp = petState.exp + exp;
    const newLevel = getPetLevel(newExp);

    const newPetState = { ...petState, exp: newExp };
    const template = PET_TEMPLATES.find(p => p.id === petState.id);

    const newPet = template ? {
      ...newPetState,
      name: template.name,
      emoji: template.emoji,
      avatar: getPetEvolutionEmoji(petState.id, newLevel),
      type: template.id,
      level: newLevel
    } : null;

    set({ petState: newPetState, pet: newPet });
    storage.savePet(newPetState);

    return newLevel > oldLevel;
  },

  selectPet: (petId: string) => {
    const template = PET_TEMPLATES.find(p => p.id === petId);
    if (!template) return;

    const petState: PetState = {
      id: petId,
      hunger: 100,
      happiness: 100,
      exp: 0,
      totalFed: 0,
      totalPlayed: 0,
      daysAdopted: 0,
      lastDecayDate: null
    };

    const pet = {
      ...petState,
      name: template.name,
      emoji: template.emoji,
      avatar: template.emoji,
      type: template.id,
      level: 1
    };

    set({ petState, pet });
    storage.savePet(petState);
  },

  feedPet: (amount: number = 20) => {
    const { petState } = get();
    if (!petState.id) return;

    const newPetState = {
      ...petState,
      hunger: Math.min(100, petState.hunger + amount),
      totalFed: (petState.totalFed || 0) + 1
    };

    const template = PET_TEMPLATES.find(p => p.id === petState.id);
    const level = getPetLevel(newPetState.exp);

    set({
      petState: newPetState,
      pet: template ? {
        ...newPetState,
        name: template.name,
        emoji: template.emoji,
        avatar: getPetEvolutionEmoji(petState.id, level),
        type: template.id,
        level
      } : null
    });
    storage.savePet(newPetState);
  },

  playWithPet: (happiness: number = 20) => {
    const { petState } = get();
    if (!petState.id) return;

    const newPetState = {
      ...petState,
      happiness: Math.min(100, petState.happiness + happiness),
      totalPlayed: (petState.totalPlayed || 0) + 1
    };

    const template = PET_TEMPLATES.find(p => p.id === petState.id);
    const level = getPetLevel(newPetState.exp);

    set({
      petState: newPetState,
      pet: template ? {
        ...newPetState,
        name: template.name,
        emoji: template.emoji,
        avatar: getPetEvolutionEmoji(petState.id, level),
        type: template.id,
        level
      } : null
    });
    storage.savePet(newPetState);
  },

  getPetLevel,
  getPetEvolutionEmoji,

  generateDailyMission: () => {
    const missions: DailyMission[] = [
      { name: '🌟 神秘任務', desc: '完成任意2個任務', bonus: 30, type: 'any_2' },
      { name: '💎 幸運之星', desc: '完成運動任務', bonus: 50, type: 'exercise' },
      { name: '📚 學習之星', desc: '完成學習任務', bonus: 50, type: 'study' },
      { name: '🏃 運動之星', desc: '完成2項運動', bonus: 40, type: 'exercise_2' },
      { name: '🎯 終極挑戰', desc: '完成3個任務', bonus: 80, type: 'any_3' }
    ];
    const mission = missions[Math.floor(Math.random() * missions.length)];
    set({ dailyMission: mission, dailyMissionDone: false });
    storage.saveDailyMission(mission);
  },

  checkDailyMission: (completedCategories: string[]) => {
    const { dailyMission, dailyMissionDone } = get();
    if (!dailyMission || dailyMissionDone) return 0;

    let completed = false;
    switch (dailyMission.type) {
      case 'any_2':
        completed = completedCategories.length >= 2;
        break;
      case 'any_3':
        completed = completedCategories.length >= 3;
        break;
      case 'exercise':
        completed = completedCategories.includes('運動');
        break;
      case 'study':
        completed = completedCategories.includes('學習') || completedCategories.includes('School');
        break;
      case 'exercise_2':
        completed = completedCategories.filter(c => c === '運動').length >= 2;
        break;
    }

    if (completed) {
      set({ dailyMissionDone: true });
      return dailyMission.bonus;
    }
    return 0;
  },

  unlockTheme: (themeId: string) => {
    const { unlockedThemes } = get();
    const theme = get().themes.find(t => t.id === themeId);
    if (!theme || theme.cost !== 0) return false;
    if (!unlockedThemes.includes(themeId)) {
      set({ unlockedThemes: [...unlockedThemes, themeId] });
      storage.saveUnlockedThemes(unlockedThemes);
    }
    return true;
  },

  buyTheme: (themeId: string, cost: number, userPoints: number) => {
    const { unlockedThemes } = get();
    if (userPoints < cost || unlockedThemes.includes(themeId)) return false;

    const newUnlocked = [...unlockedThemes, themeId];
    set({ unlockedThemes: newUnlocked });
    storage.saveUnlockedThemes(newUnlocked);
    return true;
  },

  setTheme: (themeId: string) => {
    const { unlockedThemes } = get();
    if (unlockedThemes.includes(themeId)) {
      set({ currentTheme: themeId });
      storage.saveTheme(themeId);
    }
  },

  canSpinWheel: () => {
    const today = new Date().toDateString();
    return get().luckWheel.lastSpinDate !== today;
  },

  spinWheel: () => {
    if (!get().canSpinWheel()) return null;

    const totalWeight = WHEEL_OPTIONS.reduce((sum, opt) => sum + opt.weight, 0);
    let random = Math.random() * totalWeight;

    let selected = WHEEL_OPTIONS[0];
    for (const option of WHEEL_OPTIONS) {
      random -= option.weight;
      if (random <= 0) {
        selected = option;
        break;
      }
    }

    const newWheel: LuckWheel = {
      spinCount: get().luckWheel.spinCount + 1,
      lastSpinDate: new Date().toDateString(),
      todayMultiplier: selected.multiplier,
      todayBonus: 0,
      spinHistory: [
        { date: new Date().toISOString(), multiplier: selected.multiplier, label: selected.label },
        ...get().luckWheel.spinHistory
      ].slice(0, 10)
    };

    set({ luckWheel: newWheel });
    storage.saveLuckWheel(newWheel);
    return selected;
  },

  getTodayMultiplier: () => {
    const today = new Date().toDateString();
    if (get().luckWheel.lastSpinDate === today) {
      return get().luckWheel.todayMultiplier;
    }
    return 1;
  },

  checkCertificates: (userData) => {
    const { certificates } = get();
    const newCerts: Certificate[] = [];

    for (const template of CERTIFICATE_TEMPLATES) {
      if (certificates.includes(template.id)) continue;

      let earned = false;
      switch (template.requirement) {
        case 'tasks_1':
          earned = userData.totalTasks >= 1;
          break;
        case 'streak_7':
          earned = userData.currentStreak >= 7;
          break;
        case 'streak_30':
          earned = userData.currentStreak >= 30;
          break;
        case 'points_100':
          earned = userData.totalPoints >= 100;
          break;
        case 'points_500':
          earned = userData.totalPoints >= 500;
          break;
        case 'badges_5':
          earned = userData.badges >= 5;
          break;
        case 'pet_lv3':
          earned = userData.pet && userData.pet.level >= 3;
          break;
        case 'all_categories':
          break;
      }

      if (earned) {
        newCerts.push(template);
      }
    }

    if (newCerts.length > 0) {
      const newCertificates = [...certificates, ...newCerts.map(c => c.id)];
      set({ certificates: newCertificates });
      storage.saveCertificates(newCertificates);
    }

    return newCerts;
  },

  getUnlockedCertificates: () => {
    return CERTIFICATE_TEMPLATES.filter(c => get().certificates.includes(c.id));
  },

  setLeaderboard: (entries: LeaderboardEntry[]) => {
    set({ leaderboard: entries });
    storage.saveLeaderboard(entries);
  },

  getLockedCertificates: () => {
    return CERTIFICATE_TEMPLATES.filter(c => !get().certificates.includes(c.id));
  },

  getLeaderboard: (type: string) => {
    return get().leaderboard;
  },

  setCurrentUserId: (userId: string) => {
    set({ currentUserId: userId });
    const index = get().leaderboard.findIndex(u => u.id === userId);
    const rank = index > -1 ? index + 1 : 0;
    set({ leaderboardRank: rank });
    storage.saveLeaderboard(get().leaderboard);
  }
}));
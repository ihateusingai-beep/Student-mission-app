export interface User {
  id: string;
  name: string;
  points: number;
  createdAt: string;
}

export interface Task {
  id: string;
  name: string;
  reward: number;
  category: string;
  completedToday: boolean;
  totalCount: number;
}

export interface Reward {
  id: string;
  name: string;
  cost: number;
  available: boolean;
  icon: string;
}

export interface Badge {
  id: string;
  name: string;
  desc: string;
  progress: number;
  max: number;
  icon: string;
  unlocked: boolean;
  category?: string;
}

export interface ActivityLog {
  id: number;
  time: string;
  action: string;
  detail: string;
  points: number;
}

export interface Settings {
  sound: boolean;
  streak: number;
  lastActiveDate: string | null;
  adminPin: string | null;
  parentApprovalMode: boolean;
}

export interface Pet {
  id: string;
  name: string;
  emoji: string;
  avatar: string;
  type: string;
  hunger: number;
  happiness: number;
  exp: number;
  totalFed: number;
  totalPlayed: number;
  daysAdopted: number;
  level: number;
}

export interface PetTemplate {
  id: string;
  name: string;
  emoji: string;
}

export interface PetState {
  id: string | null;
  hunger: number;
  happiness: number;
  exp: number;
  totalFed: number;
  totalPlayed: number;
  daysAdopted: number;
  lastDecayDate: string | null;
}

export interface Ability {
  name: string;
  value: number;
  max: number;
  desc: string;
}

export interface DailyMission {
  name: string;
  desc: string;
  bonus: number;
  type: string;
}

export interface Theme {
  id: string;
  name: string;
  cost: number;
  desc: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  streak: number;
  tasksCompleted: number;
  improvement?: number;
  lastUpdated: string;
}

export interface LuckWheel {
  spinCount: number;
  lastSpinDate: string | null;
  todayMultiplier: number;
  todayBonus: number;
  spinHistory: Array<{
    date: string;
    multiplier: number;
    label: string;
  }>;
}

export interface WheelOption {
  multiplier: number;
  label: string;
  color: string;
  weight: number;
}

export interface Certificate {
  id: string;
  name: string;
  desc: string;
  icon: string;
  requirement: string;
}

export interface CertificateEarned {
  id: string;
  name: string;
  requirement: string;
  earnedAt: string;
  type: 'streak' | 'achievement' | 'level' | 'milestone';
}

export interface PendingReward {
  id: string;
  taskId: string;
  taskName: string;
  reward: number;
  category: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface UsageStats {
  dailyMinutes: number;
  lastActiveDate: string | null;
  totalSessions: number;
}

export interface AbilityXP {
  intelligence: number;
  strength: number;
  diligence: number;
  discipline: number;
}

export interface LevelInfo {
  level: number;
  title: string;
  currentXP: number;
  xpToNextLevel: number;
}

export interface SelfAssessment {
  focus: number;
  resilience: number;
  timeManagement: number;
}

export interface WeeklyReview {
  weekNumber: number;
  tasksCompleted: number;
  tasksTotal: number;
  xpEarned: number;
  streakDays: number;
  abilityProgress: AbilityXP;
  selfAssessment: SelfAssessment;
  achievements: string[];
  areasForImprovement: string[];
  nextWeekGoals: string[];
}

export type MilestoneType = 
  | 'first_step' 
  | 'week_warrior' 
  | 'month_master' 
  | 'century_club' 
  | 'category_champion' 
  | 'perfect_week' 
  | 'early_bird' 
  | 'night_owl' 
  | 'point_millionaire';

export interface Milestone {
  id: MilestoneType;
  name: string;
  desc: string;
  icon: string;
  earnedAt: string | null;
  targetValue: number;
  currentValue: number;
}
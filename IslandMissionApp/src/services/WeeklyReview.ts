import { ActivityLog } from '../types';

export interface WeeklySummaryData {
  totalTasksCompleted: number;
  totalPointsEarned: number;
  totalPointsSpent: number;
  categoryBreakdown: Record<string, number>;
  dailyCompletion: Record<string, number>;
  streakDays: number;
  averageTasksPerDay: number;
}

export const XP_PER_LEVEL = 100;

function parseLogDate(logTime: string, now: Date): Date {
  const [month, day] = logTime.split(' ')[0].split('/').map(Number);
  let year = now.getFullYear();
  const logDate = new Date(year, month - 1, day);
  if (logDate > now) {
    year--;
    return new Date(year, month - 1, day);
  }
  return logDate;
}

function toISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateWeeklySummary(
  logs: ActivityLog[],
  tasks: any[],
  habitCalendar: Record<string, number>
): WeeklySummaryData {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const stats = { tasks: 0, earned: 0, spent: 0 };
  const categoryBreakdown: Record<string, number> = {};
  const dailyCompletion: Record<string, number> = {};

  logs.forEach(log => {
    const logDate = parseLogDate(log.time, now);
    if (logDate >= weekAgo) {
      if (log.action === '完成任務') {
        stats.tasks++;
        const dateStr = toISODateString(logDate);
        dailyCompletion[dateStr] = (dailyCompletion[dateStr] || 0) + 1;

        const task = tasks.find((t: any) => t.name === log.detail);
        if (task?.category) {
          categoryBreakdown[task.category] = (categoryBreakdown[task.category] || 0) + 1;
        }
      }
      if (log.points > 0) {
        stats.earned += log.points;
      } else if (log.points < 0) {
        stats.spent += Math.abs(log.points);
      }
    }
  });

  let streakDays = 0;
  let currentDate = new Date(now);
  while (true) {
    const dateStr = toISODateString(currentDate);
    if (habitCalendar[dateStr] && habitCalendar[dateStr] > 0) {
      streakDays++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  const daysWithData = Object.keys(dailyCompletion).length || 1;
  const averageTasksPerDay = Math.round((stats.tasks / daysWithData) * 10) / 10;

  return {
    totalTasksCompleted: stats.tasks,
    totalPointsEarned: stats.earned,
    totalPointsSpent: stats.spent,
    categoryBreakdown,
    dailyCompletion,
    streakDays,
    averageTasksPerDay
  };
}

export function formatWeeklySummaryText(summary: WeeklySummaryData, lang: string = 'zh-HK'): string {
  const lines = [
    '📊 本週摘要',
    '',
    `✅ 完成任務：${summary.totalTasksCompleted} 個`,
    `⭐ 獲得成就值：${summary.totalPointsEarned}`,
    `🎁 使用成就值：${summary.totalPointsSpent}`,
    `🔥 連續達成：${summary.streakDays} 日`,
    `📈 平均每日：${summary.averageTasksPerDay} 個任務`,
    ''
  ];

  if (Object.keys(summary.categoryBreakdown).length > 0) {
    lines.push('📋 分類完成：');
    Object.entries(summary.categoryBreakdown).forEach(([cat, count]) => {
      lines.push(`   ${cat}: ${count} 個`);
    });
  }

  return lines.join('\n');
}

export interface HeroReviewData {
  weekNumber: number;
  tasksCompleted: number;
  tasksTotal: number;
  completionRate: number;
  xpEarned: number;
  streakDays: number;
  abilityLevels: {
    intelligence: number;
    strength: number;
    diligence: number;
    discipline: number;
  };
  abilityProgress: {
    intelligence: number;
    strength: number;
    diligence: number;
    discipline: number;
  };
  selfAssessment: {
    focus: number;
    resilience: number;
    timeManagement: number;
  };
  strengths: string[];
  improvements: string[];
  nextWeekGoals: string[];
}

const LEVEL_TITLES = [
  '新手島民', '新手島民', '新手島民', '新手島民', '新手島民',
  '初級修行者', '初級修行者', '初級修行者', '初級修行者', '初級修行者',
  '中級修行者', '中級修行者', '中級修行者', '中級修行者', '中級修行者', '中級修行者', '中級修行者', '中級修行者', '中級修行者', '中級修行者',
  '高級修行者', '高級修行者', '高級修行者', '高級修行者', '高級修行者', '高級修行者', '高級修行者', '高級修行者', '高級修行者', '高級修行者',
  '島民大師'
];

export function getLevelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)] || '島民大師';
}

export function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function calculateAbilityLevel(value: number): number {
  return Math.floor(value / XP_PER_LEVEL) + 1;
}

export function calculateHeroReview(
  summary: WeeklySummaryData,
  abilities: Record<string, { value: number }>,
  selfAssessment?: { focus?: number; resilience?: number; timeManagement?: number },
  tasksTotal?: number
): HeroReviewData {
  const now = new Date();
  const weekNumber = getISOWeekNumber(now);

  const totalTasks = tasksTotal ?? summary.totalTasksCompleted;

  const completionRate = totalTasks > 0
    ? Math.round((summary.totalTasksCompleted / totalTasks) * 100)
    : 0;

  const abilityLevels = {
    intelligence: calculateAbilityLevel(abilities.intelligence?.value || 0),
    strength: calculateAbilityLevel(abilities.strength?.value || 0),
    diligence: calculateAbilityLevel(abilities.diligence?.value || 0),
    discipline: calculateAbilityLevel(abilities.discipline?.value || 0)
  };

  const abilityProgress = {
    intelligence: Math.round((abilities.intelligence?.value || 0) % XP_PER_LEVEL),
    strength: Math.round((abilities.strength?.value || 0) % XP_PER_LEVEL),
    diligence: Math.round((abilities.diligence?.value || 0) % XP_PER_LEVEL),
    discipline: Math.round((abilities.discipline?.value || 0) % XP_PER_LEVEL)
  };

  const categoryEntries = Object.entries(summary.categoryBreakdown);
  const topCategories = categoryEntries.sort((a, b) => b[1] - a[1]).slice(0, 3);

  const strengths: string[] = [];
  if (summary.streakDays >= 3) strengths.push('🔥 連續達成習慣');
  if (summary.categoryBreakdown['運動'] && summary.categoryBreakdown['運動'] >= 3) strengths.push('🏃 運動表現良好');
  if (summary.categoryBreakdown['學習'] && summary.categoryBreakdown['學習'] >= 3) strengths.push('📚 學習態度積極');
  if (summary.categoryBreakdown['家務'] && summary.categoryBreakdown['家務'] >= 2) strengths.push('🧹 家務參與度高');
  if (summary.averageTasksPerDay >= 3) strengths.push('⭐ 高效完成任務');

  const improvements: string[] = [];
  if (summary.streakDays < 3) improvements.push('△ 希望能建立更穩定的習慣');
  if (!summary.categoryBreakdown['運動']) improvements.push('△ 運動時間可以增加');
  if (!summary.categoryBreakdown['學習']) improvements.push('△ 學習時間可以增加');
  if (summary.averageTasksPerDay < 2) improvements.push('△ 嘗試每天多完成一個任務');

  const nextWeekGoals: string[] = [];
  if (summary.streakDays < 7) nextWeekGoals.push('爭取7天連續達成');
  if (summary.averageTasksPerDay < 3) nextWeekGoals.push('每天完成3個或以上任務');
  if (!topCategories.find(([c]) => c === '學習')) nextWeekGoals.push('增加學習任務完成次數');

  return {
    weekNumber,
    tasksCompleted: summary.totalTasksCompleted,
    tasksTotal: totalTasks,
    completionRate,
    xpEarned: summary.totalPointsEarned,
    streakDays: summary.streakDays,
    abilityLevels,
    abilityProgress,
    selfAssessment: {
      focus: selfAssessment?.focus || 3,
      resilience: selfAssessment?.resilience || 3,
      timeManagement: selfAssessment?.timeManagement || 3
    },
    strengths: strengths.length > 0 ? strengths : ['△ 需要更多數據才能分析'],
    improvements: improvements.length > 0 ? improvements : ['✓ 繼續保持當前節奏'],
    nextWeekGoals: nextWeekGoals.length > 0 ? nextWeekGoals : ['保持當前良好的表現']
  };
}

export function formatHeroReviewText(review: HeroReviewData, lang: string = 'zh-HK'): string {
  const title = lang === 'en' ? `Week ${review.weekNumber} Hero Review`
    : lang === 'zh-CN' ? `第${review.weekNumber}週英雄回顧`
    : `第${review.weekNumber}週英雄回顧`;

  const titleLine = '📊 ' + title;
  const divider = '=================='.substring(0, title.length);

  const lines = [
    titleLine,
    divider,
    '',
    '【修煉統計】',
    `✅ 完成任務：${review.tasksCompleted}/${review.tasksTotal} (${review.completionRate}%)`,
    `⭐ 獲得點數：${review.xpEarned}`,
    `🔥 連續完成：${review.streakDays}天`,
    '',
    '【四維發展】',
    `🧠 智力：Lv ${review.abilityLevels.intelligence} (${review.abilityProgress.intelligence}%)`,
    `💪 體能：Lv ${review.abilityLevels.strength} (${review.abilityProgress.strength}%)`,
    `📚 勤奮：Lv ${review.abilityLevels.diligence} (${review.abilityProgress.diligence}%)`,
    `😴 自律：Lv ${review.abilityLevels.discipline} (${review.abilityProgress.discipline}%)`,
    '',
    '【自我評估】',
    `🎯 專注度：${review.selfAssessment.focus}/5`,
    `💪 抗逆力：${review.selfAssessment.resilience}/5`,
    `⏰ 時間管理：${review.selfAssessment.timeManagement}/5`,
    '',
    '【做得好的】'
  ];

  review.strengths.forEach(s => lines.push('✔ ' + s));

  lines.push('', '【可以改進的】');
  review.improvements.forEach(i => lines.push(i));

  lines.push('', '【下週目標】');
  review.nextWeekGoals.forEach((g, i) => lines.push(`${i + 1}. ${g}`));

  return lines.join('\n');
}
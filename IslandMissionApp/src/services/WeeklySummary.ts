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
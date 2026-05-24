import { storage } from './storage';

const DAILY_LIMIT_MINUTES = 30;

export interface TimeTrackerState {
  isTracking: boolean;
  startTime: number | null;
  sessionMinutes: number;
  hasShownReminder: boolean;
}

class TimeTracker {
  private state: TimeTrackerState = {
    isTracking: false,
    startTime: null,
    sessionMinutes: 0,
    hasShownReminder: false
  };

  private intervalId: NodeJS.Timeout | null = null;

  start() {
    if (this.state.isTracking) return;

    this.state.startTime = Date.now();
    this.state.isTracking = true;
    this.state.sessionMinutes = 0;
    this.state.hasShownReminder = false;

    this.intervalId = setInterval(() => {
      this.tick();
    }, 60000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.state.startTime && this.state.isTracking) {
      const elapsed = Math.floor((Date.now() - this.state.startTime) / 60000);
      if (elapsed > 0) {
        storage.updateUsageTime(elapsed);
      }
    }

    this.state.isTracking = false;
    this.state.startTime = null;
    this.state.sessionMinutes = 0;
  }

  private tick() {
    if (!this.state.startTime) return;

    const elapsed = Math.floor((Date.now() - this.state.startTime) / 60000);
    this.state.sessionMinutes = elapsed;
  }

  getSessionMinutes(): number {
    return this.state.sessionMinutes;
  }

  async checkTimeLimit(): Promise<{ exceeded: boolean; dailyMinutes: number; shouldShowReminder: boolean }> {
    const dailyMinutes = await this.getDailyMinutes();
    const sessionMinutes = this.state.sessionMinutes;
    const totalToday = dailyMinutes + sessionMinutes;

    return {
      exceeded: totalToday >= DAILY_LIMIT_MINUTES,
      dailyMinutes: totalToday,
      shouldShowReminder: totalToday >= DAILY_LIMIT_MINUTES && !this.state.hasShownReminder
    };
  }

  markReminderShown() {
    this.state.hasShownReminder = true;
  }

  async getDailyMinutes(): Promise<number> {
    const stats = await storage.loadUsageStats();
    const today = new Date().toDateString();

    if (stats.lastActiveDate === today) {
      return stats.dailyMinutes;
    }
    return 0;
  }

  getLimitMinutes(): number {
    return DAILY_LIMIT_MINUTES;
  }
}

export const timeTracker = new TimeTracker();
export { DAILY_LIMIT_MINUTES };
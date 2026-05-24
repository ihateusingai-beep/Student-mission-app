// 島民小英雄 - 本地存儲系統
// 使用 localStorage + JSON 持久化

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
}

class LocalStorage {
  constructor() {
    this.today = new Date().toDateString()
  }

  // 初始化/獲取用戶數據
  loadUser() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER)
      if (saved) return JSON.parse(saved)
    } catch (e) { console.error('Load user failed:', e) }
    return null
  }

  // 獲取語言設置
  loadLanguage() {
    return localStorage.getItem(STORAGE_KEYS.LANG) || 'zh-HK'
  }

  saveLanguage(lang) {
    localStorage.setItem(STORAGE_KEYS.LANG, lang)
  }

  // 寵物
  loadPet() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PET)
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return null
  }

  savePet(pet) {
    try { localStorage.setItem(STORAGE_KEYS.PET, JSON.stringify(pet)) } catch (e) {}
  }

  // 排行榜
  loadLeaderboard() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEADERBOARD)
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return []
  }

  saveLeaderboard(board) {
    try { localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(board)) } catch (e) {}
  }

  // 主題
  loadTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'default'
  }

  saveTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  }

  loadUnlockedThemes() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UNLOCKED_THEMES)
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return ['default']
  }

  saveUnlockedThemes(themes) {
    try { localStorage.setItem(STORAGE_KEYS.UNLOCKED_THEMES, JSON.stringify(themes)) } catch (e) {}
  }

  // 能力值
  loadAbilities() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ABILITIES)
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return null
  }

  saveAbilities(abilities) {
    try { localStorage.setItem(STORAGE_KEYS.ABILITIES, JSON.stringify(abilities)) } catch (e) {}
  }

  // 神秘任務
  loadDailyMission() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DAILY_MISSION)
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return null
  }

  saveDailyMission(mission) {
    try { localStorage.setItem(STORAGE_KEYS.DAILY_MISSION, JSON.stringify(mission)) } catch (e) {}
  }

  // 運氣轉盤
  loadLuckWheel() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LUCK_WHEEL)
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return null
  }

  saveLuckWheel(wheel) {
    try { localStorage.setItem(STORAGE_KEYS.LUCK_WHEEL, JSON.stringify(wheel)) } catch (e) {}
  }

  // 證書
  loadCertificates() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CERTIFICATES)
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return []
  }

  saveCertificates(certs) {
    try { localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certs)) } catch (e) {}
  }

  // 幸運轉盤 spins 記錄
  loadSpins() {
    const saved = localStorage.getItem(STORAGE_KEYS.SPINS)
    if (saved) {
      const data = JSON.parse(saved)
      // 檢查是否同一天
      if (data.date === new Date().toDateString()) {
        return data
      }
    }
    return { date: new Date().toDateString(), count: 0 }
  }

  saveSpins(data) {
    localStorage.setItem(STORAGE_KEYS.SPINS, JSON.stringify(data))
  }

  saveUser(user) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    } catch (e) { console.error('Save user failed:', e) }
  }

  // 任務
  loadTasks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS)
      const data = saved ? JSON.parse(saved) : null
      // 檢查是否新一天，自動重置
      if (data?.lastDate !== this.today) {
        if (data?.tasks) {
          data.tasks.forEach(t => t.completedToday = false)
          data.lastDate = this.today
          this.saveTasks(data.tasks)
        }
        return data?.tasks ?? null
      }
      return data?.tasks ?? null
    } catch (e) { console.error('Load tasks failed:', e) }
    return null
  }

  saveTasks(tasks) {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify({ tasks, lastDate: this.today }))
    } catch (e) { console.error('Save tasks failed:', e) }
  }

  // 獎勵
  loadRewards() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REWARDS)
      if (saved) return JSON.parse(saved)
    } catch (e) { console.error('Load rewards failed:', e) }
    return null
  }

  saveRewards(rewards) {
    try {
      localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards))
    } catch (e) { console.error('Save rewards failed:', e) }
  }

  // 徽章
  loadBadges() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BADGES)
      if (saved) return JSON.parse(saved)
    } catch (e) { console.error('Load badges failed:', e) }
    return null
  }

  saveBadges(badges) {
    try {
      localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges))
    } catch (e) { console.error('Save badges failed:', e) }
  }

  // 活動日誌
  loadLogs() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS)
      if (saved) return JSON.parse(saved)
    } catch (e) { console.error('Load logs failed:', e) }
    return null
  }

  saveLogs(logs) {
    try {
      // 只保留最近 50 條
      const trimmed = logs.slice(0, 50)
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(trimmed))
    } catch (e) { console.error('Save logs failed:', e) }
  }

  // 設定
  loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      if (saved) return JSON.parse(saved)
    } catch (e) { console.error('Load settings failed:', e) }
    return { sound: true, streak: 0, lastActiveDate: null }
  }

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
    } catch (e) { console.error('Save settings failed:', e) }
  }

  // 更新 streak
  updateStreak() {
    const settings = this.loadSettings()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (settings.lastActiveDate === yesterday.toDateString()) {
      settings.streak = (settings.streak || 0) + 1
    } else if (settings.lastActiveDate !== this.today) {
      settings.streak = 1 // 新開始
    }
    settings.lastActiveDate = this.today
    this.saveSettings(settings)
    return settings.streak
  }

  // 清除所有數據
  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  }

  // 導出數據（家長/備份用）
  exportData() {
    return {
      user: this.loadUser(),
      tasks: this.loadTasks(),
      rewards: this.loadRewards(),
      badges: this.loadBadges(),
      logs: this.loadLogs(),
      settings: this.loadSettings(),
      exportedAt: new Date().toISOString()
    }
  }

  // 導入數據
  importData(data) {
    if (data.user) this.saveUser(data.user)
    if (data.tasks) this.saveTasks(data.tasks)
    if (data.rewards) this.saveRewards(data.rewards)
    if (data.badges) this.saveBadges(data.badges)
    if (data.logs) this.saveLogs(data.logs)
    if (data.settings) this.saveSettings(data.settings)
  }
}

export const storage = new LocalStorage()

// 導出為 CSV（for Excel）
export function exportToCSV() {
  const data = storage.loadLogs()
  if (!data || data.length === 0) return null
  
  const headers = ['時間', '類型', '內容', '積分']
  const rows = data.map(log => [
    log.time || '',
    log.type || '',
    log.text || '',
    log.points || '0'
  ])
  
  const csv = [headers, ...rows].map(row => 
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n')
  
  return csv
}
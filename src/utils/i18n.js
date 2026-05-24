// 🌐 翻譯 composable
import { ref, computed } from 'vue'
import { storage } from '../utils/storage'

const translations = {
  'zh-HK': {
    home: '首頁', tasks: '任務', rewards: '商店', badges: '徽章', admin: '家長', settings: '設定',
    goodMorning: '早晨！', tasksRemaining: '個任務等你完成', completed: '完成', remaining: '剩餘', badgesUnlocked: '徽章',
    dailyTasks: '今日任務', recentActivity: '最近活動', totalCount: '累計 {{count}} 次', checkIn: '打卡', done: '已完成',
    dailyTask: '每日任務', rewardStore: '獎勵商店', pointsToExchange: '點數換取心儀既獎勵', exchange: '兌換', notEnough: '積分唔夠',
    badgeWall: '徽章牆', collectBadges: '收集徽章解鎖成就', progress: '進度', adminConsole: '家長控制台',
    needPin: '需要 PIN 才能進入', enterPin: '輸入 PIN', confirm: '確認', pinError: 'PIN 錯誤', lock: '鎖定',
    rewardChild: '獎勵小朋友', points: '積分', reason: '原因', addTask: '新增任務', taskName: '任務名稱',
    rewardPoints: '積分', addReward: '新增獎勵', rewardName: '獎勵名稱', cost: '所需積分', icon: '圖示',
    setPin: '設定 PIN', newPin: '新 PIN (4位)', clearPin: '清除', dataManage: '數據管理',
    exportData: '📤 匯出', importData: '📥 匯入', resetData: '🔄 重置',
    userName: '用戶名稱', pointsBalance: '積分餘額', accountCreated: '帳戶建立', sound: '音效', on: '開', off: '關',
    notification: '通知', enableNotify: '開啟通知', dataStatus: '數據狀態', saved: '已儲存', pwa: 'PWA', installable: '可安裝',
    save: '儲存', cancel: '取消', goodJob: '好嘢！', logout: '登出系統', levelUp: '升 level 啦！', awesome: '勁爆！', cool: '正！',
    resetConfirm: '確定要重置所有數據嗎？呢個動作冇得撈！', pinSet: 'PIN 已設定！', pinCleared: 'PIN 已清除',
    importFailed: '匯入失敗：', badgeUnlocked: '徽章解鎖！', insufficient: '積分唔夠喎，要 {{cost}} 分了', noData: '暫時未有數據',
    exercise: '運動', school: '學校', study: '學習', chores: '家務', habit: '習慣', custom: '自訂',
    streak: '連續達成', days: '日', challengeHero: '挑戰小英雄', pointsLabel: '積分',
    tapToSee: '撳入去見佢',
    // New features
    abilities: '能力', myAbilities: '我的能力', abilityDesc: '完成任務獲取能力值', abilityProgress: '能力進度',
    pet: '寵物', noPet: '你仲未養寵物', adoptPetTip: '選擇一隻陪你成長既寵物', feed: '餵食', play: '陪佢玩', hunger: '飢餓', happiness: '開心指數',
    totalFed: '總餵食', totalPlayed: '總陪玩', daysWithPet: '相處日數',
    leaderboard: '排行榜', weeklyRank: '本週排名', yourRank: '你既排名', weekly: '本週', allTime: '總榜', tasksDone: '個任務',
    consolationPrizes: '安慰獎', participation: '參與獎', improvement: '進步獎',
    dailyMystery: '神秘任務', dailyMissionTip: '每日更新，獎勵 Bonus', missionHistory: '任務歷史', bonusReward: '獎勵',
    waiting: '請稍候',
    petStats: '寵物狀態',
    themes: '主題', themeTip: '改變 app 既外觀',
    leaderboardRank: '#',
    // New features
    wheel: '運氣轉盤', spinWheel: '轉一轉', todayLuck: '今日運氣', multiplier: '倍', spinHistory: '轉盤記錄', cantSpin: '聽日再嚟',
    certificate: '證書', certificates: '證書牆', certificateEarned: '證書獲得', print: '列印', newFeature: '新功能解鎖',
    stats: '數據', statsTip: '一目了然', totalPoints: '總積分', totalTasks: '總任務', weeklyTrend: '每週趨勢', categoryBreakdown: '分類比例', achievementProgress: '成就進度', achievements: '成就'
  },
  'en': {
    home: 'Home', tasks: 'Tasks', rewards: 'Rewards', badges: 'Badges', admin: 'Parent', settings: 'Settings',
    goodMorning: 'Good Morning!', tasksRemaining: 'tasks to complete', completed: 'Done', remaining: 'Left', badgesUnlocked: 'Badges',
    dailyTasks: "Today's Tasks", recentActivity: 'Recent Activity', totalCount: '{{count}} times', checkIn: 'Check In', done: 'Done',
    dailyTask: 'Daily Tasks', rewardStore: 'Rewards Store', pointsToExchange: 'Exchange points for rewards', exchange: 'Get', notEnough: 'Not enough',
    badgeWall: 'Badge Wall', collectBadges: 'Collect badges to unlock achievements', progress: 'Progress', adminConsole: 'Parent Console',
    needPin: 'PIN required to enter', enterPin: 'Enter PIN', confirm: 'Confirm', pinError: 'Wrong PIN', lock: 'Lock',
    rewardChild: 'Reward Child', points: 'Points', reason: 'Reason', addTask: 'Add Task', taskName: 'Task Name',
    rewardPoints: 'Points', addReward: 'Add Reward', rewardName: 'Reward Name', cost: 'Cost', icon: 'Icon',
    setPin: 'Set PIN', newPin: 'New PIN (4 digits)', clearPin: 'Clear', dataManage: 'Data',
    exportData: '📤 Export', importData: '📥 Import', resetData: '🔄 Reset',
    userName: 'Name', pointsBalance: 'Balance', accountCreated: 'Member since', sound: 'Sound', on: 'On', off: 'Off',
    notification: 'Notifications', enableNotify: 'Enable', dataStatus: 'Data', saved: 'Saved', pwa: 'PWA', installable: 'Installable',
    save: 'Save', cancel: 'Cancel', goodJob: 'Great!', logout: 'Logout',
    resetConfirm: 'Reset ALL data? This cannot be undone!', pinSet: 'PIN set!', pinCleared: 'PIN cleared',
    importFailed: 'Import failed: ', badgeUnlocked: 'Badge Unlocked!', insufficient: 'Not enough points. Need {{cost}}', noData: 'No data yet',
    exercise: 'Exercise', school: 'School', study: 'Study', chores: 'Chores', habit: 'Habit', custom: 'Custom',
    streak: 'Streak', days: 'days', challengeHero: 'Challenge Hero', pointsLabel: 'Pts',
    tapToSee: 'Tap to see',
    // New features
    abilities: 'Abilities', myAbilities: 'My Abilities', abilityDesc: 'Complete tasks to gain XP', abilityProgress: 'Progress',
    pet: 'Pet', noPet: 'No pet yet', adoptPetTip: 'Choose a companion', feed: 'Feed', play: 'Play', hunger: 'Hunger', happiness: 'Happiness',
    totalFed: 'Times Fed', totalPlayed: 'Times Played', daysWithPet: 'Days Together',
    leaderboard: 'Leaderboard', weeklyRank: 'Weekly', yourRank: 'Your Rank', weekly: 'Weekly', allTime: 'All Time', tasksDone: 'tasks',
    consolationPrizes: 'Prizes', participation: 'Join', improvement: 'Improve',
    dailyMystery: 'Mystery', dailyMissionTip: 'Daily bonus task', missionHistory: 'History', bonusReward: 'Reward',
    waiting: 'Please wait',
    petStats: 'Pet Stats',
    themes: 'Themes', themeTip: 'Change look',
    leaderboardRank: '#',
    // New features
    wheel: 'Lucky Wheel', spinWheel: 'Spin', todayLuck: "Today's Luck", multiplier: 'x', spinHistory: 'History', cantSpin: 'Come back tomorrow',
    certificate: 'Certificate', certificates: 'Certificates', certificateEarned: 'Earned', print: 'Print', newFeature: 'New Unlock',
    stats: 'Stats', statsTip: 'Overview', totalPoints: 'Total Points', totalTasks: 'Total Tasks', weeklyTrend: 'Weekly Trend', categoryBreakdown: 'Categories', achievementProgress: 'Achievements', achievements: 'Awards'
  },
  'zh-CN': {
    home: '首页', tasks: '任务', rewards: '商店', badges: '徽章', admin: '家长', settings: '设置',
    goodMorning: '早上好！', tasksRemaining: '个任务等你完成', completed: '完成', remaining: '剩余', badgesUnlocked: '徽章',
    dailyTasks: '今日任务', recentActivity: '最近活动', totalCount: '累计 {{count}} 次', checkIn: '打卡', done: '已完成',
    dailyTask: '每日任务', rewardStore: '奖励商店', pointsToExchange: '用点数换取奖励', exchange: '兑换', notEnough: '积分不足',
    badgeWall: '徽章墙', collectBadges: '收集徽章解锁成就', progress: '进度', adminConsole: '家长控制台',
    needPin: '需要 PIN 才能进入', enterPin: '输入 PIN', confirm: '确认', pinError: 'PIN 错误', lock: '锁定',
    rewardChild: '奖励小朋友', points: '积分', reason: '原因', addTask: '新增任务', taskName: '任务名称',
    rewardPoints: '积分', addReward: '新增奖励', rewardName: '奖励名称', cost: '所需积分', icon: '图标',
    setPin: '设定 PIN', newPin: '新 PIN (4位)', clearPin: '清除', dataManage: '数据管理',
    exportData: '📤 导出', importData: '📥 导入', resetData: '🔄 重置',
    userName: '用户名称', pointsBalance: '积分余额', accountCreated: '帐号建立', sound: '音效', on: '开', off: '关',
    notification: '通知', enableNotify: '开启通知', dataStatus: '数据状态', saved: '已储存', pwa: 'PWA', installable: '可安装',
    save: '储存', cancel: '取消', goodJob: '好嘢！', logout: '登出系统',
    resetConfirm: '確定要重置所有數據嗎？呢個動作冇得撈！', pinSet: 'PIN 已設定！', pinCleared: 'PIN 已清除',
    importFailed: '匯入失敗：', badgeUnlocked: '徽章解鎖！', insufficient: '積分唔夠喎，要 {{cost}} 分了', noData: '暫時未有數據',
    exercise: '運動', school: '學校', study: '學習', chores: '家務', habit: '習慣', custom: '自訂',
    streak: '連續', days: '日', challengeHero: '挑戰小英雄', pointsLabel: '積分',
    tapToSee: '点击进入',
    // New features
    abilities: '能力', myAbilities: '我的能力', abilityDesc: '完成任务获取能力值', abilityProgress: '能力进度',
    pet: '宠物', noPet: '还未养宠物', adoptPetTip: '选择一只陪你成长', feed: '喂食', play: '陪玩', hunger: '饥饿', happiness: '开心值',
    totalFed: '总喂食', totalPlayed: '总陪玩', daysWithPet: '相处日数',
    leaderboard: '排行榜', weeklyRank: '本周排名', yourRank: '你的排名', weekly: '本周', allTime: '总榜', tasksDone: '个任务',
    consolationPrizes: '安慰奖', participation: '参与奖', improvement: '进步奖',
    dailyMystery: '神秘任务', dailyMissionTip: '每日更新，奖励 Bonus', missionHistory: '任务历史', bonusReward: '奖励',
    waiting: '请稍候',
    petStats: '宠物状态',
    themes: '主题', themeTip: '改变外观',
    leaderboardRank: '#',
    // New features
    wheel: '运气转盘', spinWheel: '转一转', todayLuck: '今日运气', multiplier: '倍', spinHistory: '转盘记录', cantSpin: '听日再来',
    certificate: '证书', certificates: '证书墙', certificateEarned: '证书获得', print: '列印', newFeature: '新功能解锁',
    stats: '数据', statsTip: '一目了然', totalPoints: '总积分', totalTasks: '总任务', weeklyTrend: '每周趋势', categoryBreakdown: '分类比例', achievementProgress: '成就进度', achievements: '成就'
  }
}

const categoryIcons = {
  '運動': '🏃', 'Exercise': '🏃', '运动': '🏃',
  '學校': '🏫', 'School': '🏫', '学校': '🏫',
  '學習': '📚', 'Study': '📚', '学习': '📚',
  '家務': '🧹', 'Chores': '🧹', '家务': '🧹',
  '習慣': '😴', 'Habit': '😴', '习惯': '😴',
  '自訂': '⭐', 'Custom': '⭐', '自订': '⭐'
}

// 當前語言
export const currentLang = ref(storage.loadLanguage())

// 翻譯函數
export function t(key, params = {}) {
  const langData = translations[currentLang.value] || translations['zh-HK']
  let text = langData[key] || translations['zh-HK'][key] || key
  
  Object.keys(params).forEach(param => {
    text = text.replace('{{' + param + '}}', params[param])
  })
  
  return text
}

// 設置語言
export function setLang(lang) {
  if (translations[lang]) {
    currentLang.value = lang
    storage.saveLanguage(lang)
  }
}

// 獲取類別圖示
export function getCategoryIcon(category) {
  return categoryIcons[category] || '📌'
}

// 語言列表
export const langs = [
  { code: 'zh-HK', name: '🇭🇰 繁體中文', flag: '🇭🇰' },
  { code: 'zh-CN', name: '🇨🇳 简体中文', flag: '🇨🇳' },
  { code: 'en', name: '🇬🇧 English', flag: '🇬🇧' }
]
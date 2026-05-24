export type LangCode = 'zh-HK' | 'zh-CN' | 'en';

export interface TranslationKeys {
  home: string;
  tasks: string;
  rewards: string;
  badges: string;
  admin: string;
  settings: string;
  goodMorning: string;
  tasksRemaining: string;
  completed: string;
  remaining: string;
  badgesUnlocked: string;
  dailyTasks: string;
  recentActivity: string;
  totalCount: string;
  checkIn: string;
  done: string;
  dailyTask: string;
  rewardStore: string;
  pointsToExchange: string;
  exchange: string;
  notEnough: string;
  badgeWall: string;
  collectBadges: string;
  progress: string;
  adminConsole: string;
  needPin: string;
  enterPin: string;
  confirm: string;
  pinError: string;
  lock: string;
  rewardChild: string;
  points: string;
  reason: string;
  addTask: string;
  taskName: string;
  rewardPoints: string;
  addReward: string;
  rewardName: string;
  cost: string;
  icon: string;
  setPin: string;
  newPin: string;
  clearPin: string;
  dataManage: string;
  exportData: string;
  importData: string;
  resetData: string;
  userName: string;
  pointsBalance: string;
  accountCreated: string;
  sound: string;
  on: string;
  off: string;
  notification: string;
  enableNotify: string;
  dataStatus: string;
  saved: string;
  pwa: string;
  installable: string;
  save: string;
  cancel: string;
  goodJob: string;
  logout: string;
  levelUp: string;
  awesome: string;
  cool: string;
  resetConfirm: string;
  pinSet: string;
  pinCleared: string;
  importFailed: string;
  badgeUnlocked: string;
  insufficient: string;
  noData: string;
  exercise: string;
  school: string;
  study: string;
  chores: string;
  habit: string;
  custom: string;
  streak: string;
  days: string;
  challengeHero: string;
  pointsLabel: string;
  abilities: string;
  myAbilities: string;
  abilityDesc: string;
  abilityProgress: string;
  pet: string;
  noPet: string;
  adoptPetTip: string;
  feed: string;
  play: string;
  hunger: string;
  happiness: string;
  totalFed: string;
  totalPlayed: string;
  daysWithPet: string;
  leaderboard: string;
  weeklyRank: string;
  yourRank: string;
  weekly: string;
  allTime: string;
  tasksDone: string;
  consolationPrizes: string;
  participation: string;
  improvement: string;
  dailyMystery: string;
  dailyMissionTip: string;
  missionHistory: string;
  bonusReward: string;
  themes: string;
  themeTip: string;
  leaderboardRank: string;
  wheel: string;
  spinWheel: string;
  todayLuck: string;
  multiplier: string;
  spinHistory: string;
  cantSpin: string;
  certificate: string;
  certificates: string;
  certificateEarned: string;
  print: string;
  newFeature: string;
  stats: string;
  statsTip: string;
  totalPoints: string;
  totalTasks: string;
  weeklyTrend: string;
  categoryBreakdown: string;
  achievementProgress: string;
  achievements: string;
  todayProgress: string;
  completedTasks: string;
  allCompleted: string;
  keepGoing: string;
  level: string;
  levelAbbr: string;
  xp: string;
  xpProgress: string;
  parentMessage: string;
  parentMessagePlaceholder: string;
  saveMessage: string;
  latestMessage: string;
  dailySummary: string;
  summaryCompleted: string;
  summaryPoints: string;
  greatJob: string;
  comingTomorrow: string;
  congratulations: string;
  allDoneCelebration: string;
  petMood: string;
  petHappy: string;
  petNormal: string;
  petSad: string;
  weeklySummary: string;
  pendingRewards: string;
  usageTime: string;
  selfAssessmentFocus: string;
  selfAssessmentResilience: string;
  selfAssessmentTime: string;
  weeklyHeroReview: string;
  heroReviewTitle: string;
  fourDimensionAbilities: string;
  intelligence: string;
  strength: string;
  diligence: string;
  discipline: string;
  continueDays: string;
  areasForImprovement: string;
  nextWeekGoals: string;
  selfAssessment: string;
  viewCertificate: string;
  selfAssessmentFocusDesc1: string;
  selfAssessmentFocusDesc2: string;
  selfAssessmentFocusDesc3: string;
  selfAssessmentFocusDesc4: string;
  selfAssessmentFocusDesc5: string;
  selfAssessmentResilienceDesc1: string;
  selfAssessmentResilienceDesc2: string;
  selfAssessmentResilienceDesc3: string;
  selfAssessmentResilienceDesc4: string;
  selfAssessmentResilienceDesc5: string;
  selfAssessmentTimeDesc1: string;
  selfAssessmentTimeDesc2: string;
  selfAssessmentTimeDesc3: string;
  selfAssessmentTimeDesc4: string;
  selfAssessmentTimeDesc5: string;
  milestoneFirstStep: string;
  milestoneWeekWarrior: string;
  milestoneMonthMaster: string;
  milestoneCenturyClub: string;
  milestoneCategoryChampion: string;
  milestonePerfectWeek: string;
  milestoneEarlyBird: string;
  milestoneNightOwl: string;
  milestonePointMillionaire: string;
  milestoneFirstStepDesc: string;
  milestoneWeekWarriorDesc: string;
  milestoneMonthMasterDesc: string;
  milestoneCenturyClubDesc: string;
  milestoneCategoryChampionDesc: string;
  milestonePerfectWeekDesc: string;
  milestoneEarlyBirdDesc: string;
  milestoneNightOwlDesc: string;
  milestonePointMillionaireDesc: string;
  viewFullReport: string;
  weeklyProgress: string;
  abilitiesOverview: string;
  recentAchievements: string;
  statsDashboard: string;
}

const translations: Record<LangCode, TranslationKeys> = {
  'zh-HK': {
    home: '首頁', tasks: '清單', rewards: '禮物', badges: '成就', admin: '家長', settings: '設定',
    goodMorning: '早晨！', tasksRemaining: '個待辨事項等你完成', completed: '完成', remaining: '剩餘', badgesUnlocked: '成就章',
    dailyTasks: '今日清單', recentActivity: '最近活動', totalCount: '累計 {{count}} 次', checkIn: '完成了 ✓', done: '已完成',
    dailyTask: '每日清單', rewardStore: '願望清單', pointsToExchange: '用成就值換取心儀禮物', exchange: '換取', notEnough: '成就值唔夠',
    badgeWall: '成就牆', collectBadges: '收集成就章解鎖特别成就', progress: '進度', adminConsole: '家長支援台',
    needPin: '需要 PIN 才能進入', enterPin: '輸入 PIN', confirm: '確認', pinError: 'PIN 錯誤', lock: '鎖定',
    rewardChild: '獎勵小朋友', points: '成就值', reason: '原因', addTask: '新增待辨事項', taskName: '事項名稱',
    rewardPoints: '成就值', addReward: '新增禮物', rewardName: '禮物名稱', cost: '所需成就值', icon: '圖示',
    setPin: '設定 PIN', newPin: '新 PIN (4位)', clearPin: '清除', dataManage: '數據管理',
    exportData: '匯出', importData: '匯入', resetData: '重置',
    userName: '用戶名稱', pointsBalance: '成就值餘額', accountCreated: '帳戶建立', sound: '音效', on: '開', off: '關',
    notification: '通知', enableNotify: '開啟通知', dataStatus: '數據狀態', saved: '已儲存', pwa: 'PWA', installable: '可安裝',
    save: '儲存', cancel: '取消', goodJob: '好嘢！', logout: '登出系統', levelUp: '升 level 啦！', awesome: '勁爆！', cool: '正！',
    resetConfirm: '確定要重置所有數據嗎？呢個動作冇得撈！', pinSet: 'PIN 已設定！', pinCleared: 'PIN 已清除',
    importFailed: '匯入失敗：', badgeUnlocked: '成就章解鎖！', insufficient: '成就值唔夠喎，要 {{cost}} 分了', noData: '暫時未有數據',
    exercise: '運動', school: '學校', study: '學習', chores: '家務', habit: '習慣', custom: '自訂',
    streak: '連續', days: '日', challengeHero: '島民小英雄', pointsLabel: '成就值',
    abilities: '能力', myAbilities: '我的能力', abilityDesc: '完成待辨事項獲取能力值', abilityProgress: '能力進度',
    pet: '寵物', noPet: '你仲未養寵物', adoptPetTip: '選擇一隻陪你成長既寵物', feed: '餵食', play: '陪佢玩', hunger: '飢餓', happiness: '開心指數',
    totalFed: '總餵食', totalPlayed: '總陪玩', daysWithPet: '相處日數',
    leaderboard: '成就榜', weeklyRank: '本週排名', yourRank: '你既排名', weekly: '本週', allTime: '總榜', tasksDone: '個待辨事項',
    consolationPrizes: '安慰獎', participation: '參與獎', improvement: '進步獎',
    dailyMystery: '每日挑戰', dailyMissionTip: '每日更新，獎勵 Bonus', missionHistory: '歷史記錄', bonusReward: '獎勵',
    themes: '主題', themeTip: '改變 app 既外觀',
    leaderboardRank: '#',
    wheel: '運氣轉盤', spinWheel: '轉一轉', todayLuck: '今日運氣', multiplier: '倍', spinHistory: '轉盤記錄', cantSpin: '聽日再嚟',
    certificate: '證書', certificates: '證書牆', certificateEarned: '證書獲得', print: '列印', newFeature: '新功能解鎖',
    stats: '數據', statsTip: '一目了然', totalPoints: '總成就值', totalTasks: '總待辨事項', weeklyTrend: '每週趨勢', categoryBreakdown: '分類比例', achievementProgress: '成就進度', achievements: '成就',
    todayProgress: '今日完成度', completedTasks: '已完成', allCompleted: '全部完成！', keepGoing: '繼續努力！',
    level: '等級', levelAbbr: '級', xp: 'XP', xpProgress: '經驗值進度',
    parentMessage: '家長鼓勵', parentMessagePlaceholder: '寫下鼓勵說話...', saveMessage: '送出鼓勵', latestMessage: '最新鼓勵',
    dailySummary: '今日摘要', summaryCompleted: '今日完成', summaryPoints: '獲得成就值', greatJob: '好叻！', comingTomorrow: '明日預覽',
    congratulations: '恭喜！', allDoneCelebration: '今日全部完成！',
    petMood: '心情', petHappy: '開心', petNormal: '一般', petSad: '傷心',
    weeklySummary: '每週摘要', pendingRewards: '待確認', usageTime: '使用時間',
    selfAssessmentFocus: '專注度', selfAssessmentResilience: '抗逆力', selfAssessmentTime: '時間管理',
    weeklyHeroReview: '每週英雄回顧', heroReviewTitle: '英雄回顧', fourDimensionAbilities: '四維能力',
    intelligence: '智力', strength: '體能', diligence: '勤奮', discipline: '自律',
    continueDays: '連續完成', areasForImprovement: '可以改進的', nextWeekGoals: '下週目標',
    selfAssessment: '自我評估', viewCertificate: '查看證書',
    selfAssessmentFocusDesc1: '經常分心，需要很多提醒',
    selfAssessmentFocusDesc2: '有時分心，但能完成任務',
    selfAssessmentFocusDesc3: '大部分時間專注',
    selfAssessmentFocusDesc4: '能長時間專注',
    selfAssessmentFocusDesc5: '完全沉浸，忘記時間',
    selfAssessmentResilienceDesc1: '遇到困難就放棄',
    selfAssessmentResilienceDesc2: '需要幫助才能繼續',
    selfAssessmentResilienceDesc3: '有時能自己克服',
    selfAssessmentResilienceDesc4: '大部分困難能自己處理',
    selfAssessmentResilienceDesc5: '把困難當學習機會',
    selfAssessmentTimeDesc1: '經常拖延或超時',
    selfAssessmentTimeDesc2: '有時需要催促',
    selfAssessmentTimeDesc3: '大部分時候按時完成',
    selfAssessmentTimeDesc4: '善用時間，效率高',
    selfAssessmentTimeDesc5: '時間管理大師',
    milestoneFirstStep: '第一步', milestoneWeekWarrior: '週冠軍', milestoneMonthMaster: '月大師',
    milestoneCenturyClub: '百人俱樂部', milestoneCategoryChampion: '分類冠軍', milestonePerfectWeek: '完美週',
    milestoneEarlyBird: '早起的鳥', milestoneNightOwl: '夜貓子', milestonePointMillionaire: '千點富翁',
    milestoneFirstStepDesc: '完成第一個任務', milestoneWeekWarriorDesc: '連續7天', milestoneMonthMasterDesc: '連續30天',
    milestoneCenturyClubDesc: '完成100個任務', milestoneCategoryChampionDesc: '單一分類完成50個任務',
    milestonePerfectWeekDesc: '一週100%完成', milestoneEarlyBirdDesc: '早上9點前完成任務',
    milestoneNightOwlDesc: '晚上9點後完成任務', milestonePointMillionaireDesc: '累積1000成就值',
    viewFullReport: '查看完整報告', weeklyProgress: '每週進度', abilitiesOverview: '能力概覽',
    recentAchievements: '最近成就', statsDashboard: '數據面板'
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
    exportData: 'Export', importData: 'Import', resetData: 'Reset',
    userName: 'Name', pointsBalance: 'Balance', accountCreated: 'Member since', sound: 'Sound', on: 'On', off: 'Off',
    notification: 'Notifications', enableNotify: 'Enable', dataStatus: 'Data', saved: 'Saved', pwa: 'PWA', installable: 'Installable',
    save: 'Save', cancel: 'Cancel', goodJob: 'Great!', logout: 'Logout', levelUp: 'Level up!', awesome: 'Awesome!', cool: 'Cool!',
    resetConfirm: 'Reset ALL data? This cannot be undone!', pinSet: 'PIN set!', pinCleared: 'PIN cleared',
    importFailed: 'Import failed: ', badgeUnlocked: 'Badge Unlocked!', insufficient: 'Not enough points. Need {{cost}}', noData: 'No data yet',
    exercise: 'Exercise', school: 'School', study: 'Study', chores: 'Chores', habit: 'Habit', custom: 'Custom',
    streak: 'Streak', days: 'days', challengeHero: 'Challenge Hero', pointsLabel: 'Pts',
    abilities: 'Abilities', myAbilities: 'My Abilities', abilityDesc: 'Complete tasks to gain XP', abilityProgress: 'Progress',
    pet: 'Pet', noPet: 'No pet yet', adoptPetTip: 'Choose a companion', feed: 'Feed', play: 'Play', hunger: 'Hunger', happiness: 'Happiness',
    totalFed: 'Times Fed', totalPlayed: 'Times Played', daysWithPet: 'Days Together',
    leaderboard: 'Leaderboard', weeklyRank: 'Weekly', yourRank: 'Your Rank', weekly: 'Weekly', allTime: 'All Time', tasksDone: 'tasks',
    consolationPrizes: 'Prizes', participation: 'Join', improvement: 'Improve',
    dailyMystery: 'Mystery', dailyMissionTip: 'Daily bonus task', missionHistory: 'History', bonusReward: 'Reward',
    themes: 'Themes', themeTip: 'Change look',
    leaderboardRank: '#',
    wheel: 'Lucky Wheel', spinWheel: 'Spin', todayLuck: "Today's Luck", multiplier: 'x', spinHistory: 'History', cantSpin: 'Come back tomorrow',
    certificate: 'Certificate', certificates: 'Certificates', certificateEarned: 'Earned', print: 'Print', newFeature: 'New Unlock',
    stats: 'Stats', statsTip: 'Overview', totalPoints: 'Total Points', totalTasks: 'Total Tasks', weeklyTrend: 'Weekly Trend', categoryBreakdown: 'Categories', achievementProgress: 'Achievements', achievements: 'Awards',
    todayProgress: 'Today Progress', completedTasks: 'Done', allCompleted: 'All Done!', keepGoing: 'Keep Going!',
    level: 'Level', levelAbbr: 'Lv', xp: 'XP', xpProgress: 'XP Progress',
    parentMessage: 'Parent Message', parentMessagePlaceholder: 'Write an encouraging message...', saveMessage: 'Send', latestMessage: 'Latest',
    dailySummary: 'Daily Summary', summaryCompleted: 'Completed', summaryPoints: 'Points Earned', greatJob: 'Great Job!', comingTomorrow: 'Tomorrow',
    congratulations: 'Congratulations!', allDoneCelebration: 'All done today!',
    petMood: 'Mood', petHappy: 'Happy', petNormal: 'Normal', petSad: 'Sad',
    weeklySummary: 'Weekly Summary', pendingRewards: 'Pending', usageTime: 'Usage Time',
    selfAssessmentFocus: 'Focus', selfAssessmentResilience: 'Resilience', selfAssessmentTime: 'Time Management',
    weeklyHeroReview: 'Weekly Hero Review', heroReviewTitle: 'Hero Review', fourDimensionAbilities: '4 Abilities',
    intelligence: 'Intelligence', strength: 'Strength', diligence: 'Diligence', discipline: 'Discipline',
    continueDays: 'Streak', areasForImprovement: 'Improvements', nextWeekGoals: 'Next Week Goals',
    selfAssessment: 'Self-Assessment', viewCertificate: 'View Certificate',
    selfAssessmentFocusDesc1: 'Often distracted, needs many reminders',
    selfAssessmentFocusDesc2: 'Sometimes distracted but completes tasks',
    selfAssessmentFocusDesc3: 'Focused most of the time',
    selfAssessmentFocusDesc4: 'Can focus for long periods',
    selfAssessmentFocusDesc5: 'Completely immersed, loses track of time',
    selfAssessmentResilienceDesc1: 'Gives up when facing difficulties',
    selfAssessmentResilienceDesc2: 'Needs help to continue',
    selfAssessmentResilienceDesc3: 'Sometimes overcomes on own',
    selfAssessmentResilienceDesc4: 'Handles most difficulties independently',
    selfAssessmentResilienceDesc5: 'Treats difficulties as learning opportunities',
    selfAssessmentTimeDesc1: 'Often procrastinates or runs late',
    selfAssessmentTimeDesc2: 'Sometimes needs reminders',
    selfAssessmentTimeDesc3: 'Completes most tasks on time',
    selfAssessmentTimeDesc4: 'Good time management, high efficiency',
    selfAssessmentTimeDesc5: 'Time management master',
    milestoneFirstStep: 'First Step', milestoneWeekWarrior: 'Week Warrior', milestoneMonthMaster: 'Month Master',
    milestoneCenturyClub: 'Century Club', milestoneCategoryChampion: 'Category Champion', milestonePerfectWeek: 'Perfect Week',
    milestoneEarlyBird: 'Early Bird', milestoneNightOwl: 'Night Owl', milestonePointMillionaire: 'Point Millionaire',
    milestoneFirstStepDesc: 'Complete first task', milestoneWeekWarriorDesc: '7-day streak', milestoneMonthMasterDesc: '30-day streak',
    milestoneCenturyClubDesc: 'Complete 100 tasks', milestoneCategoryChampionDesc: '50 tasks in one category',
    milestonePerfectWeekDesc: '100% completion for a week', milestoneEarlyBirdDesc: 'Complete task before 9am',
    milestoneNightOwlDesc: 'Complete task after 9pm', milestonePointMillionaireDesc: 'Earn 1000 total points',
    viewFullReport: 'View Full Report', weeklyProgress: 'Weekly Progress', abilitiesOverview: 'Abilities Overview',
    recentAchievements: 'Recent Achievements', statsDashboard: 'Stats Dashboard'
  },
  'zh-CN': {
    home: '首頁', tasks: '清單', rewards: '禮物', badges: '成就', admin: '家長', settings: '設定',
    goodMorning: '早上好！', tasksRemaining: '個待辦事項等你完成', completed: '完成', remaining: '剩餘', badgesUnlocked: '成就章',
    dailyTasks: '今日清單', recentActivity: '最近活動', totalCount: '累計 {{count}} 次', checkIn: '完成了 ✓', done: '已完成',
    dailyTask: '每日清單', rewardStore: '願望清單', pointsToExchange: '用成就值換取心儀禮物', exchange: '換取', notEnough: '成就值不夠',
    badgeWall: '成就牆', collectBadges: '收集成就章解鎖特別成就', progress: '進度', adminConsole: '家長支援台',
    needPin: '需要 PIN 才能進入', enterPin: '輸入 PIN', confirm: '確認', pinError: 'PIN 錯誤', lock: '鎖定',
    rewardChild: '獎勵小朋友', points: '成就值', reason: '原因', addTask: '新增待辦事項', taskName: '事項名稱',
    rewardPoints: '成就值', addReward: '新增禮物', rewardName: '禮物名稱', cost: '所需成就值', icon: '圖示',
    setPin: '設定 PIN', newPin: '新 PIN (4位)', clearPin: '清除', dataManage: '數據管理',
    exportData: '匯出', importData: '匯入', resetData: '重置',
    userName: '用戶名稱', pointsBalance: '成就值餘額', accountCreated: '帳戶建立', sound: '音效', on: '開', off: '關',
    notification: '通知', enableNotify: '開啟通知', dataStatus: '數據狀態', saved: '已儲存', pwa: 'PWA', installable: '可安裝',
    save: '儲存', cancel: '取消', goodJob: '好嘢！', logout: '登出系統', levelUp: '升 level 啦！', awesome: '勁爆！', cool: '正！',
    resetConfirm: '確定要重置所有數據嗎？這個動作冇得撈！', pinSet: 'PIN 已設定！', pinCleared: 'PIN 已清除',
    importFailed: '匯入失敗：', badgeUnlocked: '成就章解鎖！', insufficient: '成就值不夠喎，要 {{cost}} 分了', noData: '暫時未有數據',
    exercise: '運動', school: '學校', study: '學習', chores: '家務', habit: '習慣', custom: '自訂',
    streak: '連續', days: '日', challengeHero: '島民小英雄', pointsLabel: '成就值',
    abilities: '能力', myAbilities: '我的能力', abilityDesc: '完成待辦事項獲取能力值', abilityProgress: '能力進度',
    pet: '寵物', noPet: '還未養寵物', adoptPetTip: '選擇一隻陪你成長', feed: '餵食', play: '陪玩', hunger: '飢餓', happiness: '開心值',
    totalFed: '總餵食', totalPlayed: '總陪玩', daysWithPet: '相處日數',
    leaderboard: '成就榜', weeklyRank: '本週排名', yourRank: '你的排名', weekly: '本週', allTime: '總榜', tasksDone: '個待辦事項',
    consolationPrizes: '安慰獎', participation: '參與獎', improvement: '進步獎',
    dailyMystery: '每日挑戰', dailyMissionTip: '每日更新，獎勵 Bonus', missionHistory: '歷史記錄', bonusReward: '獎勵',
    themes: '主題', themeTip: '改變外觀',
    leaderboardRank: '#',
    wheel: '運氣轉盤', spinWheel: '轉一轉', todayLuck: '今日運氣', multiplier: '倍', spinHistory: '轉盤記錄', cantSpin: '聽日再來',
    certificate: '證書', certificates: '證書牆', certificateEarned: '證書獲得', print: '列印', newFeature: '新功能解鎖',
    stats: '數據', statsTip: '一目了然', totalPoints: '總成就值', totalTasks: '總待辦事項', weeklyTrend: '每週趨勢', categoryBreakdown: '分類比例', achievementProgress: '成就進度', achievements: '成就',
    todayProgress: '今日完成度', completedTasks: '已完成', allCompleted: '全部完成！', keepGoing: '繼續努力！',
    level: '等級', levelAbbr: '級', xp: 'XP', xpProgress: '經驗值進度',
    parentMessage: '家長鼓勵', parentMessagePlaceholder: '寫下鼓勵說話...', saveMessage: '送出鼓勵', latestMessage: '最新鼓勵',
    dailySummary: '今日摘要', summaryCompleted: '今日完成', summaryPoints: '獲得成就值', greatJob: '好嘢！', comingTomorrow: '明日預覽',
    congratulations: '恭喜！', allDoneCelebration: '今日全部完成！',
    petMood: '心情', petHappy: '開心', petNormal: '一般', petSad: '傷心',
    weeklySummary: '每週摘要', pendingRewards: '待確認', usageTime: '使用時間',
    selfAssessmentFocus: '专注度', selfAssessmentResilience: '抗逆力', selfAssessmentTime: '时间管理',
    weeklyHeroReview: '每週英雄回顾', heroReviewTitle: '英雄回顾', fourDimensionAbilities: '四维能力',
    intelligence: '智力', strength: '体能', diligence: '勤奋', discipline: '自律',
    continueDays: '连续完成', areasForImprovement: '可以改进的', nextWeekGoals: '下週目标',
    selfAssessment: '自我评估', viewCertificate: '查看证书',
    selfAssessmentFocusDesc1: '经常分心，需要很多提醒',
    selfAssessmentFocusDesc2: '有时分心，但能完成任务',
    selfAssessmentFocusDesc3: '大部分时间专注',
    selfAssessmentFocusDesc4: '能长时间专注',
    selfAssessmentFocusDesc5: '完全沉浸，忘记时间',
    selfAssessmentResilienceDesc1: '遇到困难就放弃',
    selfAssessmentResilienceDesc2: '需要帮助才能继续',
    selfAssessmentResilienceDesc3: '有时能自己克服',
    selfAssessmentResilienceDesc4: '大部分困难能自己处理',
    selfAssessmentResilienceDesc5: '把困难当学习机会',
    selfAssessmentTimeDesc1: '经常拖延或超时',
    selfAssessmentTimeDesc2: '有时需要催促',
    selfAssessmentTimeDesc3: '大部分时候按时完成',
    selfAssessmentTimeDesc4: '善用时间，效率高',
    selfAssessmentTimeDesc5: '时间管理大师',
    milestoneFirstStep: '第一步', milestoneWeekWarrior: '週冠军', milestoneMonthMaster: '月大师',
    milestoneCenturyClub: '百人俱乐部', milestoneCategoryChampion: '分类冠军', milestonePerfectWeek: '完美週',
    milestoneEarlyBird: '早起的鸟', milestoneNightOwl: '夜猫子', milestonePointMillionaire: '千点富翁',
    milestoneFirstStepDesc: '完成第一个任务', milestoneWeekWarriorDesc: '连续7天', milestoneMonthMasterDesc: '连续30天',
    milestoneCenturyClubDesc: '完成100个任务', milestoneCategoryChampionDesc: '单一分类完成50个任务',
    milestonePerfectWeekDesc: '一週100%完成', milestoneEarlyBirdDesc: '早上9点前完成任务',
    milestoneNightOwlDesc: '晚上9点后完成任务', milestonePointMillionaireDesc: '累计1000成就值',
    viewFullReport: '查看完整报告', weeklyProgress: '每週进度', abilitiesOverview: '能力概览',
    recentAchievements: '最近成就', statsDashboard: '数据面板'
  }
};

const categoryIcons: Record<string, string> = {
  '運動': '🏃', 'Exercise': '🏃', '运动': '🏃',
  '學校': '🏫', 'School': '🏫', '学校': '🏫',
  '學習': '📚', 'Study': '📚', '学习': '📚',
  '家務': '🧹', 'Chores': '🧹', '家务': '🧹',
  '習慣': '😴', 'Habit': '😴', '习惯': '😴',
  '自訂': '⭐', 'Custom': '⭐', '自订': '⭐'
};

export const langs = [
  { code: 'zh-HK' as LangCode, name: '繁體中文', flag: '🇭🇰' },
  { code: 'zh-CN' as LangCode, name: '简体中文', flag: '🇨🇳' },
  { code: 'en' as LangCode, name: 'English', flag: '🇬🇧' }
];

export function t(key: keyof TranslationKeys, params: Record<string, string | number> = {}, lang: LangCode = 'zh-HK'): string {
  const langData = translations[lang] || translations['zh-HK'];
  let text = langData[key] || translations['zh-HK'][key] || key;

  Object.keys(params).forEach(param => {
    text = text.replace(`{{${param}}}`, String(params[param]));
  });

  return text;
}

export function getCategoryIcon(category: string): string {
  return categoryIcons[category] || '📌';
}

export const translationsObject = translations;
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { storage } from '../utils/storage'

const DEFAULT_TASKS = [
  { id: 't1', name: '運動30分鐘', reward: 10, category: '運動', completedToday: false, totalCount: 15 },
  { id: 't2', name: '自己上學', reward: 10, category: '學校', completedToday: false, totalCount: 20 },
  { id: 't3', name: '讀英文書2頁', reward: 15, category: '學習', completedToday: false, totalCount: 8 },
  { id: 't4', name: '讀中文圖書1章', reward: 15, category: '學習', completedToday: false, totalCount: 12 },
  { id: 't5', name: '倒垃圾', reward: 5, category: '家務', completedToday: false, totalCount: 25 },
  { id: 't6', name: '念一本英文書', reward: 100, category: '學習', completedToday: false, totalCount: 3 },
  { id: 't7', name: '10點睡覺', reward: 50, category: '習慣', completedToday: false, totalCount: 7 },
]

const DEFAULT_REWARDS = [
  { id: 'r1', name: '遊戲時間（60分鐘）', cost: 100, available: true, icon: '🎮', image: 'gift_box', isMoney: false },
  { id: 'r2', name: '遊戲時間（15分鐘）', cost: 15, available: true, icon: '🎮', image: 'lollipop', isMoney: false },
  { id: 'r3', name: '玩具時間（30分鐘）', cost: 50, available: true, icon: '🧸', image: 'treasure', isMoney: false },
  { id: 'r4', name: '睡晚30分鐘', cost: 80, available: true, icon: '😴', image: 'flowers', isMoney: false },
  { id: 'r5', name: '圖書借閱券', cost: 20, available: true, icon: '📚', image: 'icecream', isMoney: false },
  { id: 'r6', name: '零食兌換券', cost: 30, available: true, icon: '🍪', image: 'treasure', isMoney: false },
]

const DEFAULT_BADGES = [
  // === 每日重置型（短週期）===
  { id: 'daily_1', name: '早起鳥', desc: '7點前起身', progress: 0, max: 1, icon: '🌅', unlocked: false, category: 'daily', resetDaily: true },
  { id: 'daily_2', name: '每日達人', desc: '每日完成3個任務', progress: 0, max: 1, icon: '⭐', unlocked: false, category: 'daily', resetDaily: true },
  { id: 'daily_3', name: '活力滿分', desc: '每日運動', progress: 0, max: 1, icon: '💪', unlocked: false, category: 'daily', resetDaily: true },

  // === 階梯型（中週期）===
  { id: 'ladder_1', name: '初試啼聲', desc: '完成1個任務', progress: 0, max: 1, icon: '🎯', unlocked: false, category: 'ladder' },
  { id: 'ladder_2', name: '小試牛刀', desc: '完成5個任務', progress: 0, max: 5, icon: '🔥', unlocked: false, category: 'ladder' },
  { id: 'ladder_3', name: '十項全能', desc: '完成10個任務', progress: 0, max: 10, icon: '🏆', unlocked: false, category: 'ladder' },
  { id: 'ladder_4', name: '百折不撓', desc: '完成20個任務', progress: 0, max: 20, icon: '💎', unlocked: false, category: 'ladder' },
  { id: 'ladder_5', name: '千錘百鍊', desc: '完成50個任務', progress: 0, max: 50, icon: '👑', unlocked: false, category: 'ladder' },

  // === 永久成就型（長週期）===
  { id: 'perm_1', name: '學習專家', desc: '完成10個學習任務', progress: 0, max: 10, icon: '📚', unlocked: false, category: '學習' },
  { id: 'perm_2', name: '運動健將', desc: '完成10個運動任務', progress: 0, max: 10, icon: '🏃', unlocked: false, category: '運動' },
  { id: 'perm_3', name: '家務達人', desc: '完成10個家務任務', progress: 0, max: 10, icon: '🧹', unlocked: false, category: '家務' },
  { id: 'perm_4', name: '早起連線', desc: '14天連續早起', progress: 0, max: 14, icon: '🌞', unlocked: false, category: 'streak' },
  { id: 'perm_5', name: '情緒達人', desc: '7天無發脾氣', progress: 0, max: 7, icon: '😁', unlocked: false, category: 'habit' },
  { id: 'perm_6', name: '徽章收藏家', desc: '解鎖10個徽章', progress: 0, max: 10, icon: '🏅', unlocked: false, category: 'meta' },
]

// 通知提醒
class ReminderManager {
  constructor() {
    this.permission = 'default'
    this.check()
  }

  async check() {
    if ('Notification' in window) {
      this.permission = Notification.permission
    }
  }

  async request() {
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission()
    }
    return this.permission === 'granted'
  }

  send(title, options = {}) {
    if (this.permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        ...options
      })
    }
  }

  scheduleTaskReminder(taskName, hour = 20) {
    // 使用 setTimeout 模拟提醒（實際可用 Web Push API）
    const now = new Date()
    const target = new Date()
    target.setHours(hour, 0, 0, 0)
    if (target < now) target.setDate(target.getDate() + 1)
    const delay = target - now
    setTimeout(() => {
      this.send('⏰ 任務提醒', {
        body: `「${taskName}」仲未做，快啲去打卡啦！`
      })
    }, delay)
  }
}

export const reminderManager = new ReminderManager()

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null)
  const tasks = ref([])
  const rewards = ref([])
  const badges = ref([])
  const activityLog = ref([])
  const settings = ref({ sound: true, streak: 0, adminPin: '1234' })
  // 徽章解鎖回調
  let onBadgeUnlockCallback = null
  function setBadgeUnlockCallback(fn) { onBadgeUnlockCallback = fn }
  // 待家長確認的記錄
  const pendingCompletions = ref([])

  const userPoints = computed(() => currentUser.value?.points || 0)
  const todayTasks = computed(() => tasks.value)
  const unlockedBadges = computed(() => badges.value.filter(b => b.unlocked))
  const recentLogs = computed(() => activityLog.value.slice(0, 10))
  const completedCount = computed(() => tasks.value.filter(t => t.completedToday).length)
  const remainingTasks = computed(() => tasks.value.filter(t => !t.completedToday).length)

  // PIN 驗證 - 如果未設定 PIN，必須提示用戶設定
  function verifyPin(input) {
    // 如果從未設定 PIN（舊用戶），預設為 '1234'
    const storedPin = settings.value.adminPin
    if (storedPin === null || storedPin === undefined) {
      return '1234' === input
    }
    return storedPin === input
  }

  function setPin(pin) {
    if (pin && pin.length === 4) {
      settings.value.adminPin = pin
      storage.saveSettings(settings.value)
      return true
    }
    return false
  }

  function clearPin() {
    settings.value.adminPin = null
    storage.saveSettings(settings.value)
  }

  function init() {
    const savedUser = storage.loadUser()
    currentUser.value = savedUser || {
      id: 'u_' + Date.now(),
      name: 'Frank',
      points: 1835,
      createdAt: new Date().toISOString().split('T')[0]
    }
    if (!savedUser) storage.saveUser(currentUser.value)

    const savedTasks = storage.loadTasks()
    tasks.value = savedTasks || DEFAULT_TASKS.map(t => ({ ...t }))
    if (!savedTasks) storage.saveTasks(tasks.value)

    const savedRewards = storage.loadRewards()
    rewards.value = savedRewards || DEFAULT_REWARDS.map(r => ({ ...r }))
    if (!savedRewards) storage.saveRewards(rewards.value)

    const savedBadges = storage.loadBadges()
    badges.value = savedBadges || DEFAULT_BADGES.map(b => ({ ...b }))
    if (!savedBadges) storage.saveBadges(badges.value)

    const savedLogs = storage.loadLogs()
    activityLog.value = savedLogs || []

    const savedSettings = storage.loadSettings()
    settings.value = savedSettings || { sound: true, streak: 0, adminPin: '1234' }
    // 確保舊用戶（adminPin 為 null）使用預設 PIN
    if (settings.value.adminPin === null || settings.value.adminPin === undefined) {
      settings.value.adminPin = '1234'
    }

    settings.value.streak = storage.updateStreak()

    // 載入待家長確認記錄
    pendingCompletions.value = storage.loadPendingCompletions()
  }

  // 創建待確認記錄（不打分）
  function createPendingCompletion(taskId) {
    const task = tasks.value.find(t => t.id === taskId)
    if (task && !task.completedToday) {
      // 不標記完成，不加分，只建立待確認記錄
      const record = {
        id: 'pc_' + Date.now(),
        taskId,
        taskName: task.name,
        taskCategory: task.category,
        reward: task.reward,
        photo: null,       // 家長拍的相片
        studentPhoto: null, // 學生的相（可選）
        status: 'pending',  // pending | confirmed | rejected
        createdAt: new Date().toISOString()
      }
      pendingCompletions.value.push(record)
      storage.savePendingCompletions(pendingCompletions.value)
      return record
    }
    return null
  }

  // 家長確認後正式完成任務
  function confirmCompletion(recordId, photoBase64 = null) {
    const record = pendingCompletions.value.find(r => r.id === recordId)
    if (!record || record.status !== 'pending') return 0

    record.status = 'confirmed'
    if (photoBase64) record.photo = photoBase64

    const task = tasks.value.find(t => t.id === record.taskId)
    if (task) {
      task.completedToday = true
      task.totalCount++
      currentUser.value.points += record.reward
      addLog('完成任務', record.taskName, record.reward)
      checkBadges(record.taskCategory)
    }

    storage.savePendingCompletions(pendingCompletions.value)
    saveAll()
    return record.reward
  }

  // 家長否決
  function rejectCompletion(recordId) {
    const record = pendingCompletions.value.find(r => r.id === recordId)
    if (record && record.status === 'pending') {
      record.status = 'rejected'
      storage.savePendingCompletions(pendingCompletions.value)
    }
  }

  function completeTask(taskId) {
    const task = tasks.value.find(t => t.id === taskId)
    if (task && !task.completedToday) {
      task.completedToday = true
      task.totalCount++
      currentUser.value.points += task.reward
      addLog('完成任務', task.name, task.reward)
      checkBadges(task.category)
      saveAll()
      return task.reward
    }
    return 0
  }

  function claimReward(rewardId) {
    const reward = rewards.value.find(r => r.id === rewardId)
    if (reward && reward.available && currentUser.value.points >= reward.cost) {
      currentUser.value.points -= reward.cost
      addLog('兌換商品', reward.name, -reward.cost)
      saveAll()
      return true
    }
    return false
  }

  function addTask(taskData) {
    const newTask = {
      id: 't' + Date.now(),
      name: taskData.name,
      reward: taskData.reward || 10,
      category: taskData.category || '自訂',
      completedToday: false,
      totalCount: 0
    }
    tasks.value.push(newTask)
    storage.saveTasks(tasks.value)
    return newTask
  }

  function removeTask(taskId) {
    const index = tasks.value.findIndex(t => t.id === taskId)
    if (index > -1) {
      tasks.value.splice(index, 1)
      storage.saveTasks(tasks.value)
    }
  }

  function addReward(rewardData) {
    const newReward = {
      id: 'r' + Date.now(),
      name: rewardData.name,
      cost: rewardData.cost,
      available: true,
      icon: rewardData.icon || '🎁',
      isMoney: rewardData.isMoney || false
    }
    rewards.value.push(newReward)
    storage.saveRewards(rewards.value)
    return newReward
  }

  function removeReward(rewardId) {
    const index = rewards.value.findIndex(r => r.id === rewardId)
    if (index > -1) {
      rewards.value.splice(index, 1)
      storage.saveRewards(rewards.value)
    }
  }

  function updateReward(rewardId, updates) {
    const reward = rewards.value.find(r => r.id === rewardId)
    if (reward) {
      Object.assign(reward, updates)
      storage.saveRewards(rewards.value)
    }
  }

  function updateName(name) {
    currentUser.value.name = name
    storage.saveUser(currentUser.value)
  }

  function addPoints(amount, reason) {
    currentUser.value.points += amount
    addLog('獎勵', reason, amount)
    storage.saveUser(currentUser.value)
  }

  function addLog(action, detail, points) {
    const now = new Date()
    const time = `${now.getMonth() + 1}/${now.getDate()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    activityLog.value.unshift({ id: Date.now(), time, action, detail, points })
    storage.saveLogs(activityLog.value)
  }

  function checkBadges(category) {
    badges.value.forEach(badge => {
      if (!badge.unlocked && badge.progress < badge.max) {
        // 階梯型徽章：任何任務完成都加分
        if (badge.category === 'ladder') {
          badge.progress++
          if (badge.progress >= badge.max) {
            badge.unlocked = true
            addLog('解鎖徽章', badge.name, 0)
            reminderManager.send('🏅 徽章解鎖！', { body: `「${badge.name}」GET！` })
            if (onBadgeUnlockCallback) onBadgeUnlockCallback(badge)
          }
          return
        }
        // 其他徽章：需要 category 匹配
        if (badge.category && badge.category !== category) return
        badge.progress++
        if (badge.progress >= badge.max) {
          badge.unlocked = true
          addLog('解鎖徽章', badge.name, 0)
          reminderManager.send('🏅 徽章解鎖！', { body: `「${badge.name}」GET！` })
          if (onBadgeUnlockCallback) onBadgeUnlockCallback(badge)
        }
      }
    })
    storage.saveBadges(badges.value)
  }

  function saveAll() {
    storage.saveUser(currentUser.value)
    storage.saveTasks(tasks.value)
    storage.saveRewards(rewards.value)
    storage.saveBadges(badges.value)
  }

  function exportData() {
    return storage.exportData()
  }

  function importData(data) {
    storage.importData(data)
    init()
  }

  function resetAll() {
    currentUser.value.points = 0
    tasks.value = DEFAULT_TASKS.map(t => ({ ...t, completedToday: false, totalCount: 0 }))
    activityLog.value = []
    badges.value = DEFAULT_BADGES.map(b => ({ ...b, progress: 0, unlocked: false }))
    saveAll()
  }

  return {
    currentUser,
    tasks,
    rewards,
    badges,
    activityLog,
    settings,
    pendingCompletions,
    userPoints,
    todayTasks,
    unlockedBadges,
    recentLogs,
    completedCount,
    remainingTasks,
    init,
    completeTask,
    createPendingCompletion,
    confirmCompletion,
    rejectCompletion,
    claimReward,
    addTask,
    removeTask,
    addReward,
    removeReward,
    updateReward,
    updateName,
    addPoints,
    addLog,
    verifyPin,
    setPin,
    clearPin,
    exportData,
    setBadgeUnlockCallback,
    importData,
    resetAll
  }
})
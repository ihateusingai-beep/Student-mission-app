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
  { id: 'r1', name: 'Line 手機儲值', cost: 290, available: true, icon: '💰', image: 'treasure' },
  { id: 'r2', name: '單一個游加1小時', cost: 100, available: true, icon: '🎮', image: 'gift_box' },
  { id: 'r3', name: '單一個游加15分鐘', cost: 15, available: true, icon: '🎮', image: 'lollipop' },
  { id: 'r4', name: '荒野月卡(普通)', cost: 800, available: true, icon: '🏕️', image: 'flowers' },
  { id: 'r5', name: '荒野月卡(高級)', cost: 5000, available: false, icon: '🏕️', image: 'icecream' },
  { id: 'r6', name: '樂高盒組(五千元以內)', cost: 5000, available: false, icon: '🧱', image: 'treasure' },
]

const DEFAULT_BADGES = [
  { id: 'b1', name: '根本正面羽球高手', desc: '羽毛球高手認證', progress: 4, max: 10, icon: '🏸', unlocked: false, category: '運動' },
  { id: 'b2', name: '早睡Body好', desc: '早睡習慣', progress: 0, max: 3, icon: '😴', unlocked: false, category: '習慣' },
  { id: 'b3', name: '沙發馬鈴薯蛻皮', desc: '離開沙發開始運動', progress: 3, max: 10, icon: '🛋️', unlocked: false, category: '運動' },
  { id: 'b4', name: '汗水製造工廠廠長', desc: '持續運動產出汗水量', progress: 3, max: 30, icon: '💦', unlocked: false, category: '運動' },
  { id: 'b5', name: '地表最強過動生物', desc: '運動量極高', progress: 3, max: 100, icon: '⚡', unlocked: false, category: '運動' },
  { id: 'b6', name: '海拔高度收集大師', desc: '收集海拔', progress: 1, max: 10, icon: '🏔️', unlocked: false, category: '運動' },
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
  const settings = ref({ sound: true, streak: 0, adminPin: null })

  const userPoints = computed(() => currentUser.value?.points || 0)
  const todayTasks = computed(() => tasks.value)
  const unlockedBadges = computed(() => badges.value.filter(b => b.unlocked))
  const recentLogs = computed(() => activityLog.value.slice(0, 10))
  const completedCount = computed(() => tasks.value.filter(t => t.completedToday).length)
  const remainingTasks = computed(() => tasks.value.filter(t => !t.completedToday).length)

  // PIN 驗證 - 如果未設定 PIN，必須提示用戶設定
  function verifyPin(input) {
    // 如果從未設定 PIN，return false 強制設定
    if (settings.value.adminPin === null || settings.value.adminPin === undefined) {
      return false
    }
    return settings.value.adminPin === input
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
    settings.value = savedSettings || { sound: true, streak: 0, adminPin: null }

    settings.value.streak = storage.updateStreak()
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
      icon: rewardData.icon || '🎁'
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
        if (badge.category && badge.category !== category) return
        badge.progress++
        if (badge.progress >= badge.max) {
          badge.unlocked = true
          addLog('解鎖徽章', badge.name, 0)
          reminderManager.send('🏅 徽章解鎖！', {
            body: `「${badge.name}」GET！`
          })
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
    userPoints,
    todayTasks,
    unlockedBadges,
    recentLogs,
    completedCount,
    remainingTasks,
    init,
    completeTask,
    claimReward,
    addTask,
    removeTask,
    addReward,
    removeReward,
    updateName,
    addPoints,
    addLog,
    verifyPin,
    setPin,
    clearPin,
    exportData,
    importData,
    resetAll
  }
})
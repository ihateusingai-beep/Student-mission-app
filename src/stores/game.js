// 🌟 島民小英雄 - 排行榜與能力系統
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '../utils/storage'

export const useGameStore = defineStore('game', () => {
  // ===== 能力值 =====
  const abilities = ref({
    strength: { name: '💪 運動力', value: 0, max: 100, desc: '運動相關任務' },
    intelligence: { name: '🧠 學習力', value: 0, max: 100, desc: '學習相關任務' },
    diligence: { name: '🧹 家務力', value: 0, max: 100, desc: '家務相關任務' },
    discipline: { name: '🌙 習慣力', value: 0, max: 100, desc: '習慣養成' },
    school: { name: '🏫 學校力', value: 0, max: 100, desc: '學校相關任務' }
  })

  // ===== 排行榜 =====
  const leaderboard = ref([])
  const weeklyRankings = ref([])
  const allTimeRankings = ref([])

  // ===== 安慰獎類型 =====
  const participationAwards = [
    { id: 'champion', name: '🏆 冠軍', desc: '本週榜首', minRank: 1, maxRank: 1 },
    { id: 'top3', name: '🥈 亞季軍', desc: '頭三名', minRank: 2, maxRank: 3 },
    { id: 'top10', name: '🥉 第十', desc: '頭十名', minRank: 4, maxRank: 10 },
    { id: 'improver', name: '📈 進步獎', desc: '進步最多', type: 'improvement' },
    { id: 'streak_master', name: '🔥 全勤王', desc: '連續達標', type: 'streak' },
    { id: 'hard_worker', name: '💪 勤力獎', desc: '最多任務', type: 'tasks' },
    { id: 'participant', name: '🎉 參與獎', desc: '有參與', type: 'participation' }
  ]

  // 寵物模板
  const petTemplates = [
    { id: 'cat',    name: '🐱 小貓',  emoji: '🐱', image: 'cat'    },
    { id: 'dog',    name: '🐕 小狗',  emoji: '🐕', image: 'dog'    },
    { id: 'rabbit', name: '🐰 兔仔',  emoji: '🐰', image: 'rabbit' },
    { id: 'bear',   name: '🐻 小熊',  emoji: '🐻', image: 'bear'   },
    { id: 'frog',   name: '🐸 青蛙',  emoji: '🐸', image: 'frog'   },
    { id: 'dragon', name: '🐉 小龍',  emoji: '🐉', image: 'dragon' }
  ]

  // 寵物運行時狀態 (餓飽、開心、經驗等) - 使用 ref 直接存放可變物件
  const petState = ref({
    id: null,
    hunger: 100,
    happiness: 100,
    exp: 0,
    totalFed: 0,
    totalPlayed: 0,
    daysAdopted: 0,
    lastDecayDate: null
  })

  // 寵物needs衰減計時器
  let decayInterval = null

  // 寵物需求衰減 - 每30分鐘餓度-5,開心度-3
  function startPetDecayTimer() {
    if (decayInterval) return
    decayInterval = setInterval(() => {
      decayPetNeeds()
    }, 30 * 60 * 1000)
  }

  function decayPetNeeds() {
    if (!petState.value.id) return
    const today = new Date().toDateString()
    if (petState.value.lastDecayDate === today) return

    petState.value.hunger = Math.max(0, petState.value.hunger - 5)
    petState.value.happiness = Math.max(0, petState.value.happiness - 3)
    petState.value.lastDecayDate = today
    storage.savePet(petState.value)
  }

  // 寵物computed - 合併模板數據和運行時狀態
  const pet = computed(() => {
    if (!petState.value.id) return null
    const template = petTemplates.find(p => p.id === petState.value.id)
    if (!template) return null
    const level = getPetLevel(petState.value.exp)
    const evolutionEmoji = getPetEvolutionEmoji(petState.value.id, level)
    return {
      id: petState.value.id,
      name: template.name,
      emoji: template.emoji,
      avatar: evolutionEmoji,
      image: `/assets/pets/stage${level}/${template.image}.jpg`,
      type: template.id,
      hunger: petState.value.hunger,
      happiness: petState.value.happiness,
      exp: petState.value.exp,
      totalFed: petState.value.totalFed,
      totalPlayed: petState.value.totalPlayed,
      daysAdopted: petState.value.daysAdopted,
      level
    }
  })

  // ===== 神秘任務 =====
  const dailyMission = ref(null)
  const dailyMissionDone = ref(false)

  // ===== 裝飾 =====
  const unlockedThemes = ref(['default'])
  const currentTheme = ref('default')

  const themes = [
    { id: 'default', name: '🌲 森林', cost: 0, desc: '기본' },
    { id: 'ocean', name: '🌊 海洋', cost: 500, desc: '深海主題' },
    { id: 'space', name: '🌌 太空', cost: 800, desc: '星空主題' },
    { id: 'candy', name: '🍬 糖果', cost: 1000, desc: '繽紛主題' },
    { id: 'fire', name: '🔥 火焰', cost: 1500, desc: '火紅主題' },
    { id: 'rainbow', name: '🌈 彩虹', cost: 2000, desc: 'rainbow' }
  ]

  // ===== 隊伍系統 =====
  const teamCode = ref('')
  const teamMembers = ref([])
  const teamTasks = ref([])

  // ===== 運氣轉盤 =====
  const luckWheel = ref({
    spinCount: 0,
    lastSpinDate: null,
    todayMultiplier: 1,
    todayBonus: 0,
    spinHistory: []
  })

  const wheelOptions = [
    { multiplier: 1, label: '1x', color: 'var(--gray)', weight: 30 },
    { multiplier: 1.5, label: '1.5x', color: 'var(--success)', weight: 25 },
    { multiplier: 2, label: '2x', color: 'var(--primary)', weight: 20 },
    { multiplier: 2.5, label: '2.5x', color: 'var(--purple)', weight: 12 },
    { multiplier: 3, label: '3x', color: 'var(--warning)', weight: 8 },
    { multiplier: 0.5, label: '0.5x', color: 'var(--danger)', weight: 5 }
  ]

  // ===== 證書系統 =====
  const certificates = ref([])
  const certificateTemplates = [
    { id: 'first_task',    name: '初戰告捷',   desc: '完成第一個任務',      icon: '🎯', image: 'first_task',    requirement: 'tasks_1' },
    { id: 'streak_7',      name: '連續達人',   desc: '連續7日達成',         icon: '🔥', image: 'streak_7',      requirement: 'streak_7' },
    { id: 'streak_30',     name: '一個月坚持', desc: '連續30日達成',        icon: '🏆', image: 'streak_30',     requirement: 'streak_30' },
    { id: 'points_100',    name: '點數達人',   desc: '累積100點',           icon: '💰', image: 'points_100',    requirement: 'points_100' },
    { id: 'points_500',    name: '點數英雄',   desc: '累積500點',           icon: '⭐', image: 'points_500',    requirement: 'points_500' },
    { id: 'badges_5',      name: '徽章獵人',   desc: '收集5個徽章',         icon: '🏅', image: 'badges_5',      requirement: 'badges_5' },
    { id: 'all_categories',name: '全能挑戰者', desc: '完成所有類別任務',     icon: '🌟', image: 'all_categories',requirement: 'all_categories' },
    { id: 'pet_master',    name: '寵物大師',   desc: '寵物進化到Lv.3',      icon: '🐲', image: 'pet_master',    requirement: 'pet_lv3' }
  ]

  // ===== 計算屬性 =====
  const totalAbilityPower = computed(() => {
    return Object.values(abilities.value).reduce((sum, a) => sum + a.value, 0)
  })

  const petMultiplier = computed(() => {
    if (!pet.value) return 1
    const happiness = pet.value.happiness || 100
    if (happiness >= 80) return 1.5
    if (happiness >= 50) return 1.2
    if (happiness >= 20) return 0.8
    return 0.5
  })

  // 寵物等級計算 (0-50: Lv1, 51-150: Lv2, 151+: Lv3)
  function getPetLevel(exp) {
    if (exp >= 151) return 3
    if (exp >= 51) return 2
    return 1
  }

  // 寵物進化外觀
  function getPetEvolutionEmoji(petId, level) {
    const baseEmojis = { cat: '🐱', dog: '🐕', hamster: '🐹', rabbit: '🐰', chick: '🐣' }
    const evolvedEmojis = {
      cat: ['🐱', '😺', '🦁'],
      dog: ['🐕', '🐶', '🐺'],
      hamster: ['🐹', '🐨', '🐼'],
      rabbit: ['🐰', '🐇', '🦔'],
      chick: ['🐣', '🐥', '🦅']
    }
    const emojis = evolvedEmojis[petId] || [baseEmojis[petId] || '🐾']
    return emojis[Math.min(level - 1, emojis.length - 1)]
  }

  // ===== 方法 =====

  // 初始化遊戲數據
  function initGame() {
    // 加載寵物
    const savedPet = storage.loadPet()
    if (savedPet && savedPet.id) {
      petState.value = {
        id: savedPet.id,
        hunger: savedPet.hunger ?? 100,
        happiness: savedPet.happiness ?? 100,
        exp: savedPet.exp ?? 0,
        totalFed: savedPet.totalFed ?? 0,
        totalPlayed: savedPet.totalPlayed ?? 0,
        daysAdopted: savedPet.daysAdopted ?? 0,
        lastDecayDate: savedPet.lastDecayDate ?? null
      }
    }

    // 啟動寵物需求衰減計時器
    startPetDecayTimer()
    decayPetNeeds()

    // 加載排行榜
    const savedLeaderboard = storage.loadLeaderboard()
    if (savedLeaderboard) {
      leaderboard.value = savedLeaderboard
    }

    // 加載主題
    const savedTheme = storage.loadTheme()
    if (savedTheme) {
      currentTheme.value = savedTheme
    }

    // 加載運氣轉盤
    const savedWheel = storage.loadLuckWheel()
    if (savedWheel) {
      luckWheel.value = savedWheel
    }

    // 加載證書
    const savedCerts = storage.loadCertificates()
    if (savedCerts) {
      certificates.value = savedCerts
    }

    // 生成每日神秘任務
    generateDailyMission()
  }

  // 更新能力值
  function updateAbility(category, points) {
    if (abilities.value[category]) {
      abilities.value[category].value = Math.min(abilities.value[category].value + points, abilities.value[category].max)
      storage.saveAbilities(abilities.value)
    }
  }

  // 兼容: addAbilityXp → updateAbility
  function addAbilityXp(category, points) {
    updateAbility(category, points)
  }

  // addPetExp → 寵物經驗值
  function addPetExp(exp) {
    if (!petState.value.id) return false
    petState.value.exp += exp
    const oldLevel = getPetLevel(petState.value.exp - exp)
    const newLevel = getPetLevel(petState.value.exp)
    if (newLevel > oldLevel) {
      petState.value.level = newLevel
      storage.savePet(petState.value)
      return true
    }
    storage.savePet(petState.value)
    return false
  }

  // 選擇寵物
  function selectPet(petId) {
    const template = petTemplates.find(p => p.id === petId)
    if (template) {
      petState.value = {
        id: petId,
        hunger: 100,
        happiness: 100,
        exp: 0,
        totalFed: 0,
        totalPlayed: 0,
        daysAdopted: 0,
        lastDecayDate: null
      }
      storage.savePet(petState.value)
    }
  }

  // 餵養寵物
  function feedPet(amount = 20) {
    if (petState.value.id) {
      petState.value.hunger = Math.min(100, petState.value.hunger + amount)
      petState.value.totalFed = (petState.value.totalFed || 0) + 1
      storage.savePet(petState.value)
    }
  }

  // 陪寵物玩
  function playWithPet(happiness = 20) {
    if (petState.value.id) {
      petState.value.happiness = Math.min(100, petState.value.happiness + happiness)
      petState.value.totalPlayed = (petState.value.totalPlayed || 0) + 1
      storage.savePet(petState.value)
    }
  }

  // 寵物進化檢查
  function checkPetEvolve() {
    const level = getPetLevel(petState.value.exp)
    return level < 3 && petState.value.exp >= 51
  }

  // 生成每日神秘任務
  function generateDailyMission() {
    const missions = [
      { name: '🌟 神秘任務', desc: '完成任意2個任務', bonus: 30, type: 'any_2' },
      { name: '💎 幸運之星', desc: '完成運動任務', bonus: 50, type: 'exercise' },
      { name: '📚 學習之星', desc: '完成學習��務', bonus: 50, type: 'study' },
      { name: '🏃 運動之星', desc: '完成2項運動', bonus: 40, type: 'exercise_2' },
      { name: '🎯 終極挑戰', desc: '完成3個任務', bonus: 80, type: 'any_3' }
    ]
    dailyMission.value = missions[Math.floor(Math.random() * missions.length)]
    dailyMissionDone.value = false
    storage.saveDailyMission(dailyMission.value)
  }

  // 檢查神秘任務完成
  function checkDailyMission(completedCategories) {
    if (!dailyMission.value || dailyMissionDone.value) return 0

    let completed = false
    switch (dailyMission.value.type) {
      case 'any_2':
        completed = completedCategories.length >= 2
        break
      case 'any_3':
        completed = completedCategories.length >= 3
        break
      case 'exercise':
        completed = completedCategories.includes('運動')
        break
      case 'study':
        completed = completedCategories.includes('學習') || completedCategories.includes('School')
        break
      case 'exercise_2':
        completed = completedCategories.filter(c => c === '運動').length >= 2
        break
    }

    if (completed) {
      dailyMissionDone.value = true
      return dailyMission.value.bonus
    }
    return 0
  }

  // 兌換主題
  function unlockTheme(themeId) {
    if (!unlockedThemes.value.includes(themeId)) {
      const theme = themes.find(t => t.id === themeId)
      if (theme && theme.cost === 0) {
        unlockedThemes.value.push(themeId)
        storage.saveUnlockedThemes(unlockedThemes.value)
        return true
      }
    }
    return false
  }

  function buyTheme(themeId, cost, userPoints) {
    if (userPoints >= cost && !unlockedThemes.value.includes(themeId)) {
      unlockedThemes.value.push(themeId)
      storage.saveUnlockedThemes(unlockedThemes.value)
      return true
    }
    return false
  }

  function setTheme(themeId) {
    if (unlockedThemes.value.includes(themeId)) {
      currentTheme.value = themeId
      storage.saveTheme(themeId)
    }
  }

  // 排行榜更新
  function updateLeaderboard(userId, userName, points, streak, tasksCompleted) {
    const existing = leaderboard.value.findIndex(u => u.id === userId)
    const entry = {
      id: userId,
      name: userName,
      points: points,
      streak: streak,
      tasksCompleted: tasksCompleted,
      lastUpdated: new Date().toISOString()
    }

    if (existing > -1) {
      const oldPoints = leaderboard.value[existing].points
      entry.improvement = points - oldPoints
      leaderboard.value[existing] = entry
    } else {
      entry.improvement = 0
      leaderboard.value.push(entry)
    }

    leaderboard.value.sort((a, b) => b.points - a.points)
    leaderboard.value = leaderboard.value.slice(0, 20)
    storage.saveLeaderboard(leaderboard.value)
  }

  // 獲取安慰獎
  function getParticipationReward(userId) {
    const user = leaderboard.value.find(u => u.id === userId)
    if (!user) return participationAwards.find(a => a.id === 'participant')

    const rank = leaderboard.value.findIndex(u => u.id === userId) + 1
    const streak = user.streak
    const tasks = user.tasksCompleted
    const improvement = user.improvement || 0

    if (rank === 1) return participationAwards.find(a => a.id === 'champion')
    if (rank <= 3) return participationAwards.find(a => a.id === 'top3')
    if (rank <= 10) return participationAwards.find(a => a.id === 'top10')
    if (streak >= 7) return participationAwards.find(a => a.id === 'streak_master')
    if (tasks >= 20) return participationAwards.find(a => a.id === 'hard_worker')
    if (improvement >= 50) return participationAwards.find(a => a.id === 'improver')

    return participationAwards.find(a => a.id === 'participant')
  }

  // 隊伍功能
  function createTeam() {
    const code = Math.random().toString(36).substring(2, 6).toUpperCase()
    teamCode.value = code
    teamMembers.value = [{ id: 'owner', name: '隊長', isOwner: true }]
    return code
  }

  function joinTeam(code) {
    if (code === teamCode.value) {
      return true
    }
    return false
  }

  // ===== 運氣轉盤功能 =====
  function canSpinWheel() {
    const today = new Date().toDateString()
    return luckWheel.value.lastSpinDate !== today
  }

  function spinWheel() {
    if (!canSpinWheel()) return null

    const totalWeight = wheelOptions.reduce((sum, opt) => sum + opt.weight, 0)
    let random = Math.random() * totalWeight
    
    let selected = wheelOptions[0]
    for (const option of wheelOptions) {
      random -= option.weight
      if (random <= 0) {
        selected = option
        break
      }
    }

    luckWheel.value.spinCount++
    luckWheel.value.lastSpinDate = new Date().toDateString()
    luckWheel.value.todayMultiplier = selected.multiplier
    luckWheel.value.todayBonus = selected.multiplier

    luckWheel.value.spinHistory.unshift({
      date: new Date().toISOString(),
      multiplier: selected.multiplier,
      label: selected.label
    })

    luckWheel.value.spinHistory = luckWheel.value.spinHistory.slice(0, 10)
    storage.saveLuckWheel(luckWheel.value)
    return selected
  }

  function getTodayMultiplier() {
    const today = new Date().toDateString()
    if (luckWheel.value.lastSpinDate === today) {
      return luckWheel.value.todayMultiplier
    }
    return 1
  }

  // ===== 證書功能 =====
  function checkCertificates(userData) {
    const newCerts = []
    const { totalPoints, currentStreak, totalTasks, badges, pet } = userData

    for (const template of certificateTemplates) {
      if (certificates.value.includes(template.id)) continue

      let earned = false
      switch (template.requirement) {
        case 'tasks_1':
          earned = totalTasks >= 1
          break
        case 'streak_7':
          earned = currentStreak >= 7
          break
        case 'streak_30':
          earned = currentStreak >= 30
          break
        case 'points_100':
          earned = totalPoints >= 100
          break
        case 'points_500':
          earned = totalPoints >= 500
          break
        case 'badges_5':
          earned = badges >= 5
          break
        case 'pet_lv3':
          earned = pet && pet.level >= 3
          break
      }

      if (earned) {
        certificates.value.push(template.id)
        newCerts.push(template)
      }
    }

    if (newCerts.length > 0) {
      storage.saveCertificates(certificates.value)
    }
    return newCerts
  }

  function getUnlockedCertificates() {
    return certificateTemplates.filter(c => certificates.value.includes(c.id))
  }

  function getLockedCertificates() {
    return certificateTemplates.filter(c => !certificates.value.includes(c.id))
  }

  // 兼容: getLeaderboard 返回 leaderboard array
  function getLeaderboard(type) {
    return leaderboard.value
  }

  // 兼容: getLeaderboard 返回 leaderboard array  
  const leaderboardRank = computed(() => {
    return 0  // 需要 user id 才能計算
  })

  return {
    abilities,
    leaderboard,
    leaderboardRank,
    weeklyRankings,
    allTimeRankings,
    participationAwards,
    petTemplates,
    pet,  // 兼容 App.vue 用 gameStore.pet
    petState,
    dailyMission,
    dailyMissionDone,
    themes,
    unlockedThemes,
    currentTheme,
    teamCode,
    teamMembers,
    teamTasks,
    luckWheel,
    wheelOptions,
    certificates,
    certificateTemplates,
    totalAbilityPower,
    petMultiplier,
    initGame,
    updateAbility,
    addAbilityXp,  // 兼容
    addPetExp,  // 兼容
    selectPet,  // also exported as adoptPet
    adoptPet: selectPet,
    feedPet,
    playWithPet,
    checkPetEvolve,
    getPetLevel,
    getPetEvolutionEmoji,
    generateDailyMission,
    checkDailyMission,
    unlockTheme,
    buyTheme,
    setTheme,
    updateLeaderboard,
    getParticipationReward,
    createTeam,
    joinTeam,
    canSpinWheel,
    spinWheel,
    getTodayMultiplier,
    checkCertificates,
    getUnlockedCertificates,
    getLockedCertificates,
    getLeaderboard,  // 兼容
    startPetDecayTimer,
    decayPetNeeds
  }
})
<template>
  <div class="min-h-screen pb-20 bg-gradient-to-b from-blue-50 to-cyan-50" :class="themeClass">
    <!-- Header -->
    <header class="bg-gradient-to-r from-blue-500 to-cyan-400 text-white p-4 shadow-lg">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-xl font-bold">🏅 {{ t('challengeHero') }}</h1>
          <p class="text-sm opacity-80">{{ userStore.currentUser?.name }} {{ t('dailyTasks').toLowerCase() }}</p>
        </div>
        <div class="text-right">
          <p class="text-2xl font-bold">{{ userStore.userPoints }} 積分</p>
          <p class="text-xs opacity-80">{{ t('pointsLabel') }}</p>
        </div>
      </div>
      <div class="mt-2">
        <div class="flex justify-between text-xs opacity-80 mb-1">
          <span>🔥 {{ t('streak') }}</span>
          <span>{{ userStore.settings?.streak || 0 }} {{ t('days') }}</span>
        </div>
        <div class="w-full bg-white/30 rounded-full h-2">
          <div class="bg-orange-400 h-2 rounded-full transition-all duration-500" :style="{ width: `${Math.min((userStore.settings?.streak || 0) * 10, 100)}%` }"></div>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
      <div class="flex justify-around py-2 overflow-x-auto">
        <button v-for="tab in tabs" :key="tab.id" @click="handleTabClick(tab.id)" :class="['flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-200 min-w-fit', currentTab === tab.id ? 'text-blue-500 bg-blue-50 scale-105' : 'text-gray-400']">
          <span class="text-xl">{{ tab.icon }}</span>
          <span class="text-xs whitespace-nowrap">{{ t(tab.id) }}</span>
        </button>
      </div>
    </nav>

    <!-- Tab Content -->
    <main class="p-4 space-y-4">
      <!-- 首頁 -->
      <div v-if="currentTab === 'home'" class="space-y-4">
        <div class="card bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
          <div class="flex items-center gap-4">
            <span class="text-4xl" :class="reducedMotion ? '' : 'animate-bounce'">👋</span>
            <div>
              <h2 class="text-lg font-bold">{{ userStore.currentUser?.name }}，{{ t('goodMorning') }}</h2>
              <p class="text-sm">{{ userStore.remainingTasks }} {{ t('tasksRemaining') }}</p>
            </div>
          </div>
        </div>

        <!-- Pet Preview -->
        <div v-if="gameStore.pet" class="card bg-gradient-to-r from-pink-400 to-purple-500 text-white" @click="currentTab = 'pet'">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-3xl">{{ gameStore.pet.avatar }}</span>
              <div>
                <p class="font-bold">{{ gameStore.pet.name }}</p>
                <p class="text-sm">❤️ {{ gameStore.pet.happiness }}/100 | ⭐ {{ gameStore.pet.level }}</p>
              </div>
            </div>
            <span class="text-sm opacity-70">撳入去見佢 ></span>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2">
          <div class="card text-center">
            <p class="text-2xl font-bold text-blue-500">{{ userStore.completedCount }}</p>
            <p class="text-xs text-gray-500">✅ {{ t('completed') }}</p>
          </div>
          <div class="card text-center">
            <p class="text-2xl font-bold text-green-500">{{ userStore.remainingTasks }}</p>
            <p class="text-xs text-gray-500">⏳ {{ t('remaining') }}</p>
          </div>
          <div class="card text-center">
            <p class="text-2xl font-bold text-purple-500">{{ userStore.unlockedBadges.length }}</p>
            <p class="text-xs text-gray-500">🏅 {{ t('badgesUnlocked') }}</p>
          </div>
        </div>

        <!-- Daily Mystery Mission -->
        <div v-if="gameStore.dailyMission" class="card bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-2xl">🎯</span>
              <div>
                <p class="font-bold">{{ t('dailyMystery') }}</p>
                <p class="text-sm">+{{ gameStore.dailyMission.bonus }} {{ t('pointsLabel') }}</p>
              </div>
            </div>
            <button v-if="!gameStore.dailyMission.completed" @click="completeDailyMission" class="btn bg-white/20">📍</button>
            <span v-else class="text-green-300">✅</span>
          </div>
        </div>

        <div class="card">
          <h3 class="font-bold text-gray-700 mb-3">📋 {{ t('dailyTasks') }}</h3>
          <div class="space-y-2">
            <div v-for="task in userStore.todayTasks.slice(0, 4)" :key="task.id" class="flex items-center justify-between p-3 rounded-xl bg-gray-50 transition-all duration-300" :class="{ 'opacity-50': task.completedToday }">
              <div class="flex items-center gap-3">
                <span class="text-xl">{{ getCategoryIcon(task.category) }}</span>
                <div>
                  <p class="font-medium">{{ task.name }}</p>
                  <p class="text-xs text-gray-500">+{{ task.reward }} 積分</p>
                </div>
              </div>
              <button @click="completeTaskWithFX(task.id)" :disabled="task.completedToday" class="btn transition-all duration-200 active:scale-95" :class="task.completedToday ? 'bg-green-500 text-white' : 'btn-success'">
                <span v-if="task.completedToday">✅</span>
                <span v-else>📍</span>
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="font-bold text-gray-700 mb-3">{{ t('myAbilities') }}</h3>
          <div class="grid grid-cols-5 gap-2">
            <div v-for="(abi, key) in gameStore.abilities" :key="key" class="text-center p-2 rounded-lg bg-gray-50">
              <p class="text-xl">{{ getAbilityIcon(key) }}</p>
              <p class="text-xs font-bold">{{ abi.value }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 class="font-bold text-gray-700 mb-3">📜 {{ t('recentActivity') }}</h3>
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <div v-for="log in userStore.recentLogs" :key="log.id" class="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
              <span class="text-gray-600">{{ log.time }} {{ logActionName(log.action) }}「{{ log.detail }}」</span>
              <span :class="log.points > 0 ? 'text-green-600 font-bold' : 'text-red-600'">{{ log.points > 0 ? '+' : '' }}{{ log.points }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 任務頁 -->
      <div v-else-if="currentTab === 'tasks'" class="space-y-4">
        <div class="card">
          <div class="flex justify-between items-center mb-4">
            <h2 class="font-bold text-xl text-gray-800">✅ {{ t('dailyTask') }}</h2>
            <span class="text-sm text-gray-500">{{ userStore.completedCount }}/{{ userStore.tasks.length }}</span>
          </div>
          <div class="space-y-3">
            <div v-for="task in userStore.tasks" :key="task.id" class="p-4 rounded-xl transition-all duration-300" :class="task.completedToday ? 'bg-green-50 border-2 border-green-300 scale-[0.98]' : 'bg-gray-50 hover:scale-[0.99]'">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-2xl" :class="!task.completedToday && !reducedMotion ? 'animate-pulse' : ''">{{ getCategoryIcon(task.category) }}</span>
                  <div>
                    <p class="font-bold">{{ task.name }}</p>
                    <p class="text-sm text-gray-500">{{ task.category }} | {{ t('totalCount', {count: task.totalCount}) }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-xl font-bold text-green-600">+{{ task.reward }} 積分</p>
                  <button @click="completeTaskWithFX(task.id)" :disabled="task.completedToday" class="btn mt-1 transition-all duration-200 active:scale-95" :class="task.completedToday ? 'bg-gray-300 cursor-not-allowed' : 'btn-success'">
                    {{ task.completedToday ? '✅' : '📍 ' + t('checkIn') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 獎勵商店 -->
      <div v-else-if="currentTab === 'rewards'" class="space-y-4">
        <div class="card bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="font-bold text-lg">🎁 {{ t('rewardStore') }}</h2>
              <p class="text-sm opacity-80">{{ t('pointsToExchange') }}</p>
            </div>
            <div class="text-2xl font-bold">{{ userStore.userPoints }} 積分</div>
          </div>
        </div>
        <div class="grid gap-3">
          <div v-for="reward in userStore.rewards" :key="reward.id" :class="[!reward.available || reward.cost > userStore.userPoints ? 'opacity-40 grayscale' : 'hover:scale-[0.99]', reward.justClaimed ? (reducedMotion ? 'border-2 border-purple-400' : 'animate-bounce border-2 border-purple-400') : '']">
            <div class="flex items-center gap-3">
              <span class="text-3xl">{{ reward.icon }}</span>
              <div>
                <p class="font-bold">{{ reward.name }}</p>
                <p class="text-sm text-gray-500">{{ reward.cost }} 積分</p>
              </div>
            </div>
            <button @click="claimRewardWithFX(reward)" :disabled="!reward.available || reward.cost > userStore.userPoints" class="btn transition-all duration-200 active:scale-95" :class="[reward.available && reward.cost <= userStore.userPoints ? 'btn-primary' : 'bg-gray-300 cursor-not-allowed']">
              {{ !reward.available ? '❌' : reward.cost > userStore.userPoints ? '💸' : '🎁' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 徽章牆 -->
      <div v-else-if="currentTab === 'badges'" class="space-y-4">
        <div class="card bg-gradient-to-r from-amber-400 to-yellow-500">
          <h2 class="font-bold text-lg text-white">🏅 {{ t('badgeWall') }}</h2>
          <p class="text-sm text-white/80">{{ t('collectBadges') }}</p>
          <div class="mt-2 flex gap-2">
            <span class="text-2xl">{{ userStore.unlockedBadges.length }}</span>
            <span class="text-white/60">/</span>
            <span class="text-2xl">{{ userStore.badges.length }}</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div v-for="badge in userStore.badges" :key="badge.id" class="card text-center transition-all duration-300" :class="badge.unlocked ? 'bg-gradient-to-b from-yellow-100 to-yellow-300 border-2 border-yellow-400 scale-105' : 'bg-gray-50'">
            <span class="text-4xl block" :class="badge.justUnlocked && !reducedMotion ? 'animate-bounce' : ''">{{ badge.icon }}</span>
            <p class="font-bold mt-2 text-sm">{{ badge.name }}</p>
            <p class="text-xs text-gray-500">{{ badge.desc }}</p>
            <div class="mt-2">
              <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div class="bg-yellow-500 h-2 rounded-full transition-all duration-500" :style="{ width: `${(badge.progress / badge.max) * 100}%` }"></div>
              </div>
              <p class="text-xs mt-1" :class="badge.unlocked ? 'text-green-600 font-bold' : 'text-gray-500'">
                {{ badge.progress }} / {{ badge.max }}<span v-if="badge.unlocked"> ✨</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 能力值 -->
      <div v-else-if="currentTab === 'abilities'" class="space-y-4">
        <div class="card bg-gradient-to-r from-green-500 to-teal-500 text-white">
          <h2 class="font-bold text-lg">💪 {{ t('myAbilities') }}</h2>
          <p class="text-sm opacity-80">{{ t('abilityDesc') }}</p>
        </div>
        <div class="grid grid-cols-1 gap-3">
          <div v-for="(abi, key) in gameStore.abilities" :key="key" class="card flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-3xl">{{ getAbilityIcon(key) }}</span>
              <div>
                <p class="font-bold">{{ getAbilityName(key) }}</p>
                <p class="text-xs text-gray-500">{{ getAbilityDesc(key) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-green-600">{{ abi.value }}</p>
              <p class="text-xs text-gray-500">XP</p>
            </div>
          </div>
        </div>
        <div class="card">
          <h3 class="font-bold text-gray-700 mb-3">📊 {{ t('abilityProgress') }}</h3>
          <div class="space-y-2">
            <div v-for="(abi, key) in gameStore.abilities" :key="key + '_bar'">
              <div class="flex justify-between text-sm mb-1">
                <span>{{ getAbilityName(key) }}</span>
                <span>{{ abi.value }} / {{ abi.value + 20 }} XP</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div class="h-3 rounded-full transition-all duration-500" :class="getAbilityBarClass(key)" :style="{ width: `${Math.min(abi.value / (abi.value + 20) * 100, 100)}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 寵物頁 -->
      <div v-else-if="currentTab === 'pet'" class="space-y-4">
        <div v-if="gameStore.pet" class="card text-center">
          <div class="relative inline-block mx-auto">
            <span class="text-8xl block" :class="reducedMotion ? '' : 'animate-bounce'">{{ gameStore.pet.avatar }}</span>
            <span v-if="gameStore.pet.happiness >= 80" class="absolute -top-2 -right-2 text-2xl">✨</span>
          </div>
          <h2 class="text-2xl font-bold mt-4">{{ gameStore.pet.name }}</h2>
          <p class="text-gray-500">Lv.{{ gameStore.pet.level }} {{ getPetTypeName(gameStore.pet.type) }}</p>
          
          <div class="grid grid-cols-3 gap-2 mt-4">
            <div class="p-2 bg-gray-50 rounded-lg">
              <p class="text-xl">❤️</p>
              <p class="font-bold">{{ gameStore.pet.happiness }}</p>
              <p class="text-xs text-gray-500">{{ t('happiness') }}</p>
            </div>
            <div class="p-2 bg-gray-50 rounded-lg">
              <p class="text-xl">🍖</p>
              <p class="font-bold">{{ gameStore.pet.hunger }}</p>
              <p class="text-xs text-gray-500">{{ t('hunger') }}</p>
            </div>
            <div class="p-2 bg-gray-50 rounded-lg">
              <p class="text-xl">⭐</p>
              <p class="font-bold">{{ gameStore.pet.exp }}</p>
              <p class="text-xs text-gray-500">EXP</p>
            </div>
          </div>

          <div class="mt-4 space-y-2">
            <button @click="feedPet" :disabled="gameStore.pet.hunger >= 100" class="btn btn-success w-full" :class="gameStore.pet.hunger >= 100 ? 'opacity-50' : ''">
              🍖 {{ t('feed') }} (-10 {{ t('pointsLabel') }})
            </button>
            <button @click="playWithPet" :disabled="gameStore.pet.happiness >= 100" class="btn btn-primary w-full" :class="gameStore.pet.happiness >= 100 ? 'opacity-50' : ''">
              🎾 {{ t('play') }} (+5 {{ t('happiness') }})
            </button>
          </div>
        </div>

        <div v-else class="card text-center">
          <span class="text-6xl block">🥚</span>
          <h2 class="text-xl font-bold mt-4">{{ t('noPet') }}</h2>
          <p class="text-sm text-gray-500 mb-4">{{ t('adoptPetTip') }}</p>
          <div class="grid grid-cols-2 gap-2">
            <button v-for="type in petTypes" :key="type.id" @click="adoptPet(type)" class="card hover:scale-105 transition-all">
              <span class="text-3xl">{{ type.avatar }}</span>
              <p class="font-bold text-sm">{{ type.name }}</p>
            </button>
          </div>
        </div>

        <div class="card">
          <h3 class="font-bold text-gray-700 mb-3">🎮 {{ t('petStats') }}</h3>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span>{{ t('totalFed') }}</span>
              <span class="font-bold">{{ gameStore.pet?.totalFed || 0 }}x</span>
            </div>
            <div class="flex justify-between">
              <span>{{ t('totalPlayed') }}</span>
              <span class="font-bold">{{ gameStore.pet?.totalPlayed || 0 }}x</span>
            </div>
            <div class="flex justify-between">
              <span>{{ t('daysWithPet') }}</span>
              <span class="font-bold">{{ gameStore.pet?.daysAdopted || 0 }} {{ t('days') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 排行榜 -->
      <div v-else-if="currentTab === 'leaderboard'" class="space-y-4">
        <div class="card bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="font-bold text-lg">🏆 {{ t('leaderboard') }}</h2>
              <p class="text-sm opacity-80">{{ t('weeklyRank') }}</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold">#{{ gameStore.leaderboardRank }}</p>
              <p class="text-xs opacity-80">{{ t('yourRank') }}</p>
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <button @click="leaderboardType = 'weekly'" :class="['flex-1 btn', leaderboardType === 'weekly' ? 'btn-primary' : 'bg-gray-200']">{{ t('weekly') }}</button>
          <button @click="leaderboardType = 'alltime'" :class="['flex-1 btn', leaderboardType === 'alltime' ? 'btn-primary' : 'bg-gray-200']">{{ t('allTime') }}</button>
        </div>

        <div class="space-y-2">
          <div v-for="(entry, idx) in gameStore.getLeaderboard(leaderboardType)" :key="entry.id" class="card flex items-center justify-between" :class="getRankClass(idx)">
            <div class="flex items-center gap-3">
              <span class="text-2xl font-bold w-8">{{ getRankEmoji(idx) }}</span>
              <span class="text-2xl">{{ entry.avatar }}</span>
              <div>
                <p class="font-bold">{{ entry.name }}</p>
                <p class="text-xs text-gray-500">{{ entry.tasksCompleted }} {{ t('tasksDone') }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-green-600">+{{ entry.points }} 積分</p>
              <p class="text-xs text-gray-500">{{ entry.xp }} XP</p>
            </div>
          </div>
        </div>

        <!-- Consolation Prizes -->
        <div class="card bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300">
          <h3 class="font-bold text-amber-700 mb-3">🎁 {{ t('consolationPrizes') }}</h3>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div v-for="prize in consolationPrizes" :key="prize.id" class="flex items-center gap-2">
              <span>{{ prize.icon }}</span>
              <span class="text-gray-600">{{ prize.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 神秘任務 -->
      <div v-else-if="currentTab === 'daily'" class="space-y-4">
        <div class="card bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <h2 class="font-bold text-lg">🎯 {{ t('dailyMystery') }}</h2>
          <p class="text-sm opacity-80">{{ t('dailyMissionTip') }}</p>
        </div>

        <div v-if="gameStore.dailyMission" class="card">
          <div class="flex items-center justify-between mb-4">
            <span class="text-3xl">🎯</span>
            <span v-if="gameStore.dailyMission.completed" class="text-green-500 font-bold">✅ {{ t('completed') }}</span>
            <span v-else class="text-orange-500 font-bold">⏳ {{ t('waiting') }}</span>
          </div>
          <h3 class="font-bold text-lg">{{ gameStore.dailyMission.name }}</h3>
          <p class="text-gray-600 mt-2">{{ gameStore.dailyMission.desc }}</p>
          <div class="mt-4 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">{{ t('bonusReward') }}</p>
              <p class="text-2xl font-bold text-green-600">+{{ gameStore.dailyMission.bonus }} 積分</p>
            </div>
            <button v-if="!gameStore.dailyMissionDone" @click="completeDailyMission" class="btn btn-success">📍 {{ t('complete') }}</button>
            <span v-else class="text-green-500 font-bold">✅ {{ t('completed') }}</span>
          </div>
        </div>
      </div>

      <!-- 運氣轉盤 -->
      <div v-else-if="currentTab === 'wheel'" class="space-y-4">
        <div class="card bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
          <h2 class="font-bold text-lg">🎲 {{ t('wheel') }}</h2>
          <p class="text-sm opacity-80">{{ t('spinWheel') }}</p>
        </div>

        <!-- 轉盤展示 -->
        <div class="card text-center py-8">
          <div class="relative w-48 h-48 mx-auto mb-4">
            <div class="absolute inset-0 rounded-full border-8 border-dashed border-orange-300" :class="reducedMotion ? '' : 'animate-spin-slow'"></div>
            <div class="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
              <span class="text-5xl font-bold text-orange-500">{{ gameStore.getTodayMultiplier() }}x</span>
            </div>
          </div>
          <p class="text-lg font-bold">{{ t('todayLuck') }}: {{ gameStore.getTodayMultiplier() }}{{ t('multiplier') }}</p>
          
          <button v-if="gameStore.canSpinWheel()" @click="spinWheel" class="btn btn-primary mt-4 text-lg px-8 py-3">
            🎲 {{ t('spinWheel') }}
          </button>
          <p v-else class="text-gray-500 mt-4">{{ t('cantSpin') }}</p>
        </div>

        <!-- 轉盤記錄 -->
        <div class="card">
          <h3 class="font-bold text-gray-700 mb-3">📜 {{ t('spinHistory') }}</h3>
          <div class="space-y-2">
            <div v-for="(spin, idx) in gameStore.luckWheel.spinHistory" :key="idx" class="flex justify-between text-sm py-2 border-b border-gray-100">
              <span class="text-gray-500">{{ new Date(spin.date).toLocaleDateString() }}</span>
              <span class="font-bold" :class="spin.multiplier >= 2 ? 'text-green-600' : 'text-orange-600'">{{ spin.multiplier }}x</span>
            </div>
          </div>
        </div>
      </div>

<!-- 證書牆 -->
      <div v-else-if="currentTab === 'certificates'" class="space-y-4">
        <div class="card bg-gradient-to-r from-amber-500 to-yellow-600 text-white">
          <h2 class="font-bold text-lg">📜 {{ t('certificates') }}</h2>
          <p class="text-sm opacity-80">{{ t('certificateEarned') }}</p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div v-for="cert in gameStore.certificateTemplates" :key="cert.id" class="card text-center transition-all duration-300" :class="gameStore.certificates.includes(cert.id) ? 'bg-gradient-to-b from-yellow-100 to-amber-200 border-2 border-yellow-400' : 'bg-gray-50 opacity-50'">
            <span class="text-3xl block">{{ cert.icon }}</span>
            <p class="font-bold mt-2 text-sm">{{ cert.name }}</p>
            <p class="text-xs text-gray-500">{{ cert.desc }}</p>
            <span v-if="gameStore.certificates.includes(cert.id)" class="text-green-500 text-lg">✅</span>
            
            <button v-if="gameStore.certificates.includes(cert.id)" @click="printCertificate(cert)" class="btn btn-primary mt-2 text-xs">
              🖨️ {{ t('print') }}
            </button>
          </div>
        </div>
      </div>

      <!-- 數據儀表板 -->
      <div v-else-if="currentTab === 'stats'" class="space-y-4">
        <div class="card bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <h2 class="font-bold text-lg">📊 {{ t('stats') }}</h2>
          <p class="text-sm opacity-80">{{ t('statsTip') }}</p>
        </div>

        <!-- 總覽卡片 -->
        <div class="grid grid-cols-2 gap-3">
          <div class="card text-center bg-blue-50">
            <p class="text-3xl font-bold text-blue-600">{{ statData.totalPoints }}</p>
            <p class="text-xs text-gray-500">{{ t('totalPoints') }}</p>
          </div>
          <div class="card text-center bg-green-50">
            <p class="text-3xl font-bold text-green-600">{{ statData.totalTasks }}</p>
            <p class="text-xs text-gray-500">{{ t('totalTasks') }}</p>
          </div>
          <div class="card text-center bg-orange-50">
            <p class="text-3xl font-bold text-orange-600">{{ userStore.settings?.streak || 0 }}</p>
            <p class="text-xs text-gray-500">{{ t('streak') }}</p>
          </div>
          <div class="card text-center bg-purple-50">
            <p class="text-3xl font-bold text-purple-600">{{ userStore.unlockedBadges.length }}</p>
            <p class="text-xs text-gray-500">{{ t('badgesUnlocked') }}</p>
          </div>
        </div>

        <!-- 每週趨勢圖 (文字版) -->
        <div class="card">
          <h3 class="font-bold text-gray-700 mb-3">📈 {{ t('weeklyTrend') }}</h3>
          <div class="space-y-2">
            <div v-for="(day, idx) in statData.weeklyData" :key="idx" class="flex items-center gap-2">
              <span class="text-xs text-gray-500 w-12">{{ day.label }}</span>
              <div class="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                <div class="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" :style="{ width: day.percent + '%' }"></div>
              </div>
              <span class="text-xs font-bold w-8">{{ day.count }}</span>
            </div>
          </div>
        </div>

        <!-- 分類比例 -->
        <div class="card">
          <h3 class="font-bold text-gray-700 mb-3">🥧 {{ t('categoryBreakdown') }}</h3>
          <div class="space-y-2">
            <div v-for="(cat, idx) in statData.categoryBreakdown" :key="idx" class="flex items-center gap-2">
              <span class="text-lg">{{ cat.icon }}</span>
              <div class="flex-1">
                <div class="flex justify-between text-sm">
                  <span>{{ cat.name }}</span>
                  <span class="font-bold">{{ cat.percent }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="h-2 rounded-full" :class="cat.color" :style="{ width: cat.percent + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 成就進度 -->
        <div class="card">
          <h3 class="font-bold text-gray-700 mb-3">🎯 {{ t('achievementProgress') }}</h3>
          <div class="grid grid-cols-2 gap-2 text-center">
            <div class="p-2 bg-gray-50 rounded-lg">
              <p class="text-xl">{{ statData.achievements }}</p>
              <p class="text-xs text-gray-500">{{ t('achievements') }}</p>
            </div>
            <div class="p-2 bg-gray-50 rounded-lg">
              <p class="text-xl">{{ statData.certificates }}</p>
              <p class="text-xs text-gray-500">{{ t('certificates') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 裝飾主題 -->
      <div v-else-if="currentTab === 'themes'" class="space-y-4">
        <div class="card bg-gradient-to-r from-pink-500 to-rose-500 text-white">
          <h2 class="font-bold text-lg">🎨 {{ t('themes') }}</h2>
          <p class="text-sm opacity-80">{{ t('themeTip') }}</p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div v-for="theme in themes" :key="theme.id" @click="selectTheme(theme)" class="card transition-all duration-300" :class="[gameStore.currentTheme === theme.id ? 'ring-4 ring-blue-400 scale-105' : '', !theme.unlocked && gameStore.currentTheme !== theme.id ? 'opacity-50 grayscale' : '']">
            <div class="h-20 rounded-lg mb-2" :class="theme.bgClass"></div>
            <p class="font-bold text-center">{{ theme.name }}</p>
            <p v-if="!theme.unlocked" class="text-center text-xs text-gray-500">{{ theme.unlockReq }}</p>
          </div>
        </div>
      </div>

      <!-- 家長控制台 -->
      <div v-else-if="currentTab === 'admin'" class="space-y-4">
        <div v-if="!adminUnlocked" class="card">
          <h2 class="font-bold text-lg text-center mb-4">🔐 {{ t('adminConsole') }}</h2>
          <p class="text-sm text-gray-500 text-center mb-4">{{ t('needPin') }}</p>
          <input v-model="pinInput" type="password" maxlength="4" :placeholder="t('enterPin')" class="w-full px-4 py-3 text-center text-xl border-2 border-gray-300 rounded-xl mb-3" />
          <button @click="verifyPin" class="btn btn-primary w-full">{{ t('confirm') }}</button>
          <p v-if="pinError" class="text-red-500 text-center mt-2">{{ t('pinError') }}</p>
        </div>

        <div v-else class="space-y-4">
          <div class="card bg-gradient-to-r from-red-500 to-orange-500 text-white">
            <div class="flex justify-between items-center">
              <h2 class="font-bold text-lg">🔧 {{ t('adminConsole') }}</h2>
              <button @click="lockAdmin" class="text-sm bg-white/20 px-2 py-1 rounded">🔒 {{ t('lock') }}</button>
            </div>
          </div>

          <div class="card">
            <h3 class="font-bold text-gray-700 mb-3">🎁 {{ t('rewardChild') }}</h3>
            <div class="flex gap-2">
              <input v-model="rewardAmount" type="number" :placeholder="t('points')" class="flex-1 px-3 py-2 border rounded-xl" />
              <input v-model="rewardReason" :placeholder="t('reason')" class="flex-1 px-3 py-2 border rounded-xl" />
              <button @click="addRewardPoints" class="btn btn-success">➤</button>
            </div>
          </div>

          <div class="card">
            <h3 class="font-bold text-gray-700 mb-3">➕ {{ t('addTask') }}</h3>
            <div class="space-y-2">
              <input v-model="newTask.name" :placeholder="t('taskName')" class="w-full px-3 py-2 border rounded-xl" />
              <div class="flex gap-2">
                <input v-model.number="newTask.reward" type="number" :placeholder="t('rewardPoints')" class="flex-1 px-3 py-2 border rounded-xl" />
                <select v-model="newTask.category" class="flex-1 px-3 py-2 border rounded-xl">
                  <option value="運動">{{ t('exercise') }}</option>
                  <option value="學校">{{ t('school') }}</option>
                  <option value="學習">{{ t('study') }}</option>
                  <option value="家務">{{ t('chores') }}</option>
                  <option value="習慣">{{ t('habit') }}</option>
                  <option value="自訂">{{ t('custom') }}</option>
                </select>
                <button @click="addNewTask" class="btn btn-primary">+</button>
              </div>
            </div>
          </div>

          <div class="card">
            <h3 class="font-bold text-gray-700 mb-3">🎁 {{ t('addReward') }}</h3>
            <div class="space-y-2">
              <input v-model="newReward.name" :placeholder="t('rewardName')" class="w-full px-3 py-2 border rounded-xl" />
              <div class="flex gap-2">
                <input v-model.number="newReward.cost" type="number" :placeholder="t('cost')" class="flex-1 px-3 py-2 border rounded-xl" />
                <input v-model="newReward.icon" placeholder="🎁" class="w-16 px-3 py-2 border rounded-xl" />
                <button @click="addNewReward" class="btn btn-primary">+</button>
              </div>
            </div>
          </div>

          <div class="card">
            <h3 class="font-bold text-gray-700 mb-3">🔐 {{ t('setPin') }}</h3>
            <div class="flex gap-2">
              <input v-model="newPin" type="password" maxlength="4" :placeholder="t('newPin')" class="flex-1 px-3 py-2 border rounded-xl" />
              <button @click="savePin" class="btn btn-primary">✓</button>
              <button v-if="userStore.settings?.adminPin" @click="clearPin" class="btn bg-red-500 text-white">✕</button>
            </div>
          </div>

          <div class="card">
            <h3 class="font-bold text-gray-700 mb-3">💾 {{ t('dataManage') }}</h3>
            <div class="flex gap-2 flex-wrap">
              <button @click="exportData" class="btn btn-primary flex-1">📤</button>
              <label class="btn btn-success flex-1 text-center cursor-pointer">
                📥
                <input type="file" @change="importData" accept=".json" class="hidden" />
              </label>
              <button @click="resetData" class="btn bg-red-500 text-white flex-1">🔄</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 設定 -->
      <div v-else-if="currentTab === 'settings'" class="space-y-4">
        <div class="card">
          <h2 class="font-bold text-xl mb-4">⚙️ {{ t('settings') }}</h2>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span>👤 {{ t('userName') }}</span>
              <button @click="editName" class="font-bold text-blue-500">{{ userStore.currentUser?.name }}</button>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span>💰 {{ t('pointsBalance') }}</span>
              <span class="font-bold text-green-600">{{ userStore.userPoints }} 積分</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span>📅 {{ t('accountCreated') }}</span>
              <span class="text-gray-500">{{ userStore.currentUser?.createdAt }}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span>🌐 語言 / Language</span>
              <select v-model="selectedLang" @change="changeLanguage" class="px-2 py-1 border rounded-lg text-sm">
                <option v-for="lang in langs" :key="lang.code" :value="lang.code">{{ lang.flag }} {{ lang.name.split(' ')[1] }}</option>
              </select>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span>🔊 {{ t('sound') }}</span>
              <button @click="toggleSound" :class="soundEnabled ? 'text-green-600' : 'text-red-500'">{{ soundEnabled ? t('on') : t('off') }}</button>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span>🔔 {{ t('notification') }}</span>
              <button @click="requestNotification" :class="notificationEnabled ? 'text-green-600' : 'text-blue-500'">{{ notificationEnabled ? t('on') : t('enableNotify') }}</button>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span>💾 {{ t('dataStatus') }}</span>
              <span class="text-green-600">✅ {{ t('saved') }}</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span>📲 {{ t('pwa') }}</span>
              <span class="text-blue-500">✅ {{ t('installable') }}</span>
            </div>
          </div>
        </div>
        <button class="btn bg-red-500 text-white w-full py-3 transition-all duration-200 active:scale-95">🚪 {{ t('logout') }}</button>
      </div>
    </main>

    <!-- FX -->
    <transition name="float">
      <div v-if="showPointsFX" class="fixed top-1/3 left-1/2 -translate-x-1/2 text-4xl font-bold text-yellow-500 pointer-events-none z-50">
        +{{ pointsFXValue }}!
      </div>
    </transition>

    <!-- Badge Modal -->
    <transition name="fade">
      <div v-if="showBadgeModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="closeBadgeModal">
        <div class="card bg-gradient-to-b from-yellow-100 to-yellow-300 text-center" :class="reducedMotion ? '' : 'animate-bounce'" @click.stop>
          <span class="text-6xl">{{ unlockedBadgeIcon }}</span>
          <p class="font-bold text-xl mt-2">🎉 {{ t('badgeUnlocked') }}</p>
          <p class="font-bold text-lg mt-1">{{ unlockedBadgeName }}</p>
          <button class="btn btn-primary mt-4" @click="closeBadgeModal">{{ t('goodJob') }}</button>
        </div>
      </div>
    </transition>

    <!-- Edit Name Modal -->
    <transition name="fade">
      <div v-if="showNameModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="showNameModal = false">
        <div class="card text-center" @click.stop>
          <h3 class="font-bold text-lg mb-4">{{ t('userName') }}</h3>
          <input v-model="editNameValue" class="w-full px-3 py-2 border rounded-xl mb-4" />
          <div class="flex gap-2">
            <button @click="saveName" class="btn btn-primary flex-1">{{ t('save') }}</button>
            <button @click="showNameModal = false" class="btn bg-gray-300 flex-1">{{ t('cancel') }}</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Pet Evolution Modal -->
    <transition name="fade">
      <div v-if="showPetEvolved" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="showPetEvolved = false">
        <div class="card bg-gradient-to-b from-purple-100 to-purple-300 text-center" :class="reducedMotion ? '' : 'animate-bounce'" @click.stop>
          <span class="text-6xl">{{ gameStore.pet?.avatar }}</span>
<p class="font-bold text-xl mt-2">✨ {{ t('levelUp') ?? 'Level Up!' }} ✨</p>
          <p class="text-lg mt-1">Lv.{{ gameStore.pet?.level }} {{ gameStore.pet?.name }}</p>
          <button class="btn btn-primary mt-4" @click="showPetEvolved = false">{{ t('awesome') ?? 'Awesome!' }}</button>
        </div>
      </div>
    </transition>

    <!-- Ability Up Feedback -->
    <transition name="float">
      <div v-if="showAbilityUp" class="fixed top-1/3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg z-50">
        💪 +{{ gameStore.abilities[abilityUpKey]?.name?.replace(/[💪🧠🌙🏫🧹]/g, '') || abilityUpKey }}!
      </div>
    </transition>

    <!-- Synergy Bonus Modal -->
    <transition name="fade">
      <div v-if="showSynergy" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="showSynergy = false">
        <div class="card bg-gradient-to-b from-blue-100 to-blue-300 text-center" :class="reducedMotion ? '' : 'animate-bounce'" @click.stop>
          <span class="text-6xl">🌟</span>
          <p class="font-bold text-xl mt-2">全能挑戰者!</p>
          <p class="text-lg text-green-600 font-bold">+{{ synergyAmount }} {{ t('points') ?? 'points' }}</p>
          <button class="btn btn-primary mt-4" @click="showSynergy = false">{{ t('cool') ?? 'Cool!' }}</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from './stores/user'
import { useGameStore } from './stores/game'
import { sfx } from './utils/sound'
import { reminderManager } from './stores/user'
import { t, setLang, getCategoryIcon, currentLang, langs } from './utils/i18n'

const userStore = useUserStore()
const gameStore = useGameStore()

const currentTab = ref('home')
const soundEnabled = ref(true)
const notificationEnabled = ref(false)
const showPointsFX = ref(false)
const pointsFXValue = ref(0)
const showBadgeModal = ref(false)
const unlockedBadgeName = ref('')
const unlockedBadgeIcon = ref('')
const showNameModal = ref(false)
const editNameValue = ref('')
const selectedLang = ref(currentLang.value)

const adminUnlocked = ref(false)
const pinInput = ref('')
const pinError = ref('')
const newPin = ref('')

const leaderboardType = ref('weekly')
const rewardAmount = ref(0)
const rewardReason = ref('')
const newTask = ref({ name: '', reward: 10, category: '自訂' })
const newReward = ref({ name: '', cost: 100, icon: '🎁' })

const reducedMotion = ref(false)
const showPetEvolved = ref(false)
const showAbilityUp = ref(false)
const abilityUpKey = ref('')
const showSynergy = ref(false)
const synergyAmount = ref(0)

onMounted(() => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = mq.matches
  mq.addEventListener('change', (e) => { reducedMotion.value = e.matches })
})

const tabs = [
  { id: 'home', icon: '🏠' },
  { id: 'tasks', icon: '📋' },
  { id: 'rewards', icon: '🎁' },
  { id: 'badges', icon: '🏅' },
  { id: 'abilities', icon: '💪' },
  { id: 'pet', icon: '🐾' },
  { id: 'wheel', icon: '🎲' },
  { id: 'leaderboard', icon: '🏆' },
  { id: 'daily', icon: '🎯' },
  { id: 'certificates', icon: '📜' },
  { id: 'stats', icon: '📊' },
  { id: 'themes', icon: '🎨' },
  { id: 'admin', icon: '🔧' },
  { id: 'settings', icon: '⚙️' },
]

const petTypes = [
  { id: 'cat', name: '貓貓', avatar: '🐱' },
  { id: 'dog', name: '狗狗', avatar: '🐶' },
  { id: 'hamster', name: '倉鼠', avatar: '🐹' },
  { id: 'rabbit', name: '兔兔', avatar: '🐰' },
]

const themes = [
  { id: 'default', name: '海洋', bgClass: 'bg-gradient-to-b from-blue-50 to-cyan-50', unlocked: true },
  { id: 'sunset', name: '夕陽', bgClass: 'bg-gradient-to-b from-orange-50 to-pink-50', unlocked: true },
  { id: 'forest', name: '森林', bgClass: 'bg-gradient-to-b from-green-50 to-emerald-50', unlocked: true },
  { id: 'purple', name: '星空', bgClass: 'bg-gradient-to-b from-purple-50 to-indigo-50', unlocked: true },
  { id: 'rose', name: '玫瑰', bgClass: 'bg-gradient-to-b from-rose-50 to-red-50', unlocked: true },
  { id: 'ocean', name: '深海', bgClass: 'bg-gradient-to-b from-cyan-50 to-blue-100', unlocked: true },
]

const consolationPrizes = [
  { id: 'participation', icon: '🎉', name: '參與獎' },
  { id: 'improvement', icon: '📈', name: '進步獎' },
  { id: 'streak', icon: '🔥', name: '全勤王' },
  { id: 'hardwork', icon: '💪', name: '勤力獎' },
]

const themeClass = computed(() => {
  const themeMap = {
    default: 'bg-gradient-to-b from-blue-50 to-cyan-50',
    sunset: 'bg-gradient-to-b from-orange-50 to-pink-50',
    forest: 'bg-gradient-to-b from-green-50 to-emerald-50',
    purple: 'bg-gradient-to-b from-purple-50 to-indigo-50',
    rose: 'bg-gradient-to-b from-rose-50 to-red-50',
    ocean: 'bg-gradient-to-b from-cyan-50 to-blue-100',
  }
  return themeMap[gameStore.currentTheme] || 'bg-gradient-to-b from-blue-50 to-cyan-50'
})

// 數據儀表板計算屬性
const statData = computed(() => {
  const totalPoints = userStore.userPoints
  const totalTasks = userStore.tasks.reduce((sum, t) => sum + (t.totalCount || 0), 0)
  const currentStreak = userStore.settings?.streak || 0
  
  // 每週數據 - 從實際任務記錄計算（如果無logs則顯示 streak 數據）
  const days = ['日', '一', '二', '三', '四', '五', '六']
  const today = new Date()
  const weekData = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    // 穩定數值: 基於 streak 位置，來判斷是否有完成
    const dayInStreak = currentStreak - i
    const count = dayInStreak > 0 ? Math.min(dayInStreak, 3) : 0
    const percent = Math.min(count * 20, 100)
    weekData.push({ label: `週${days[d.getDay()]}`, count, percent })
  }
  const weeklyData = weekData
  
  // 根據實際任務計算分類
  const categoryCount = {}
  userStore.tasks.forEach(t => {
    const cat = t.category || '自訂'
    categoryCount[cat] = (categoryCount[cat] || 0) + (t.totalCount || 0)
  })
  
  const categoryColors = {
    '運動': 'bg-blue-500',
    'Exercise': 'bg-blue-500',
    'School': 'bg-pink-500',
    '學校': 'bg-pink-500',
    'Study': 'bg-purple-500',
    '學習': 'bg-purple-500',
    'Chores': 'bg-green-500',
    '家務': 'bg-green-500',
    'Habit': 'bg-orange-500',
    '習慣': 'bg-orange-500',
    'Custom': 'bg-gray-500',
    '自訂': 'bg-gray-500'
  }
  
  const totalCat = Object.values(categoryCount).reduce((a, b) => a + b, 0) || 1
  const categoryBreakdown = Object.entries(categoryCount).map(([name, count]) => ({
    name,
    icon: getCategoryIcon(name),
    percent: Math.round(count / totalCat * 100),
    color: categoryColors[name] || 'bg-gray-500'
  }))
  
  return {
    totalPoints,
    totalTasks,
    weeklyData,
    categoryBreakdown,
    achievements: userStore.unlockedBadges.length,
    certificates: gameStore.certificates.length
  }
})

function handleTabClick(tabId) {
  if (tabId === 'admin' && userStore.settings?.adminPin && !adminUnlocked.value) {
    currentTab.value = tabId
    return
  }
  if (tabId !== currentTab.value) {
    sfx.playTabSwitch()
    currentTab.value = tabId
  }
}

function showPointsAnimation(value) {
  pointsFXValue.value = value
  showPointsFX.value = true
  setTimeout(() => { showPointsFX.value = false }, 800)
}

function logActionName(action) {
  // Use i18n for localized action names
  const map = {
    '完成任務': t('completed') || 'Task Done',
    '兌換商品': t('exchange') || 'Exchange',
    '獎勵': t('rewardChild') || 'Reward',
    '解鎖徽章': t('badgeUnlocked') || 'Badge!'
  }
  return map[action] || action
}

function completeTaskWithFX(taskId) {
  const task = userStore.tasks.find(t => t.id === taskId)
  if (!task || task.completedToday) return
  const reward = userStore.completeTask(taskId)
  if (reward > 0) {
    const category = task.category
    const abilityMap = { '運動': 'strength', '學校': 'school', '學習': 'intelligence', '家務': 'diligence', '習慣': 'discipline', '自訂': 'strength' }
    const abilityKey = abilityMap[category] || 'strength'
    const oldAbilityValue = gameStore.abilities[abilityKey]?.value || 0
    gameStore.addAbilityXp(abilityKey, Math.ceil(reward / 2))
    const newAbilityValue = gameStore.abilities[abilityKey]?.value || 0

    const leveledUp = gameStore.addPetExp(5)
    sfx.playTaskComplete()
    showPointsAnimation(reward)

    if (leveledUp) {
      sfx.playEvolve()
      showPetEvolvedModal()
    } else if (newAbilityValue > oldAbilityValue && newAbilityValue % 10 === 0) {
      sfx.playLevelUp()
      showAbilityUpFeedback(abilityKey, newAbilityValue)
    }

    const badge = userStore.badges.find(b => !b.unlocked && b.progress === b.max - 1)
    if (badge) {
      setTimeout(() => {
        badge.justUnlocked = true
        openBadgeModal(badge.name, badge.icon)
        sfx.playBadgeUnlock()
        setTimeout(() => { badge.justUnlocked = false }, 2000)
      }, 500)
    }

    const newCerts = gameStore.checkCertificates({
      totalPoints: userStore.userPoints,
      currentStreak: userStore.settings?.streak || 0,
      totalTasks: userStore.tasks.reduce((sum, t) => sum + (t.totalCount || 0), 0),
      badges: userStore.badges.filter(b => b.unlocked).length,
      pet: gameStore.pet
    })
    if (newCerts.length > 0) {
      sfx.playStreakBonus()
    }

    const completedCategories = [...new Set(userStore.tasks.filter(t => t.completedToday).map(t => t.category))]
    if (completedCategories.length >= 3) {
      const synergyBonus = gameStore.checkDailyMission(completedCategories)
      if (synergyBonus > 0) {
        userStore.addPoints(synergyBonus, '全能挑戰者')
        sfx.playStreakBonus()
        showSynergyBonus(synergyBonus)
      }
    }
  }
}

function showPetEvolvedModal() {
  showPetEvolved.value = true
  setTimeout(() => { showPetEvolved.value = false }, 2500)
}

function showAbilityUpFeedback(key, value) {
  abilityUpKey.value = key
  showAbilityUp.value = true
  setTimeout(() => { showAbilityUp.value = false }, 1500)
}

function showSynergyBonus(amount) {
  synergyAmount.value = amount
  showSynergy.value = true
  setTimeout(() => { showSynergy.value = false }, 2000)
}

function claimRewardWithFX(reward) {
  if (!reward.available || reward.cost > userStore.userPoints) {
    sfx.playLowPoints()
    return
  }
  if (userStore.claimReward(reward.id)) {
    sfx.playRewardBuy()
    reward.justClaimed = true
    setTimeout(() => { reward.justClaimed = false }, 1000)
  }
}

function openBadgeModal(name, icon) {
  unlockedBadgeName.value = name
  unlockedBadgeIcon.value = icon
  showBadgeModal.value = true
}

function closeBadgeModal() { showBadgeModal.value = false }

function editName() {
  editNameValue.value = userStore.currentUser?.name || ''
  showNameModal.value = true
}

function saveName() {
  if (editNameValue.value.trim()) {
    userStore.updateName(editNameValue.value.trim())
    sfx.playPoints()
  }
  showNameModal.value = false
}

function addRewardPoints() {
  if (rewardAmount.value > 0 && rewardReason.value) {
    userStore.addPoints(rewardAmount.value, rewardReason.value)
    sfx.playRewardBuy()
    showPointsAnimation(rewardAmount.value)
    rewardAmount.value = 0
    rewardReason.value = ''
  }
}

function addNewTask() {
  if (newTask.value.name.trim()) {
    userStore.addTask({ ...newTask.value })
    sfx.playPoints()
    newTask.value = { name: '', reward: 10, category: '自訂' }
  }
}

function addNewReward() {
  if (newReward.value.name.trim()) {
    userStore.addReward({ ...newReward.value })
    sfx.playRewardBuy()
    newReward.value = { name: '', cost: 100, icon: '🎁' }
  }
}

function verifyPin() {
  if (userStore.verifyPin(pinInput.value)) {
    adminUnlocked.value = true
    pinError.value = ''
    pinInput.value = ''
  } else {
    pinError.value = t('pinError')
    sfx.playLowPoints()
  }
}

function lockAdmin() { adminUnlocked.value = false }

function savePin() {
  if (newPin.value.length === 4 && userStore.setPin(newPin.value)) {
    sfx.playRewardBuy()
    newPin.value = ''
    alert(t('pinSet'))
  }
}

function clearPin() {
  userStore.clearPin()
  sfx.playPoints()
  alert(t('pinCleared'))
}

function exportData() {
  const data = userStore.exportData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `challengehero_${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importData(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        userStore.importData(data)
        location.reload()
      } catch (err) {
        alert(t('importFailed') + err.message)
      }
    }
    reader.readAsText(file)
  }
}

function resetData() {
  if (confirm(t('resetConfirm'))) {
    userStore.resetAll()
    location.reload()
  }
}

function toggleSound() {
  soundEnabled.value = sfx.toggle()
}

function changeLanguage() {
  setLang(selectedLang.value)
}

async function requestNotification() {
  const granted = await reminderManager.request()
  notificationEnabled.value = granted
  if (granted) {
    reminderManager.send('🔔 ' + t('notification'), { body: 'Notification enabled!' })
  }
}

function getAbilityIcon(key) {
  const map = { strength: '🏃', intelligence: '🧠', diligence: '📚', discipline: '🎯', school: '🏫' }
  return map[key] || '⭐'
}

function getAbilityName(key) {
  const map = { strength: '運動力', intelligence: '學習力', diligence: '家務力', discipline: '習慣力', school: '學校力' }
  return map[key] || key
}

function getAbilityDesc(key) {
  const map = { strength: '跑步、運動任務', intelligence: '閱讀、思考任務', diligence: '清潔、烹飪任務', discipline: '早起、衛生任務', school: '功課、測驗任務' }
  return map[key] || ''
}

function getAbilityBarClass(key) {
  const map = { strength: 'bg-blue-500', intelligence: 'bg-purple-500', diligence: 'bg-green-500', discipline: 'bg-orange-500', school: 'bg-pink-500' }
  return map[key] || 'bg-gray-500'
}

function getPetTypeName(type) {
  const map = { cat: '貓貓', dog: '狗狗', hamster: '倉鼠', rabbit: '兔兔' }
  return map[type] || type
}

function getRankClass(idx) {
  if (idx === 0) return 'bg-yellow-100 border-2 border-yellow-400'
  if (idx === 1) return 'bg-gray-100 border-2 border-gray-300'
  if (idx === 2) return 'bg-orange-100 border-2 border-orange-300'
  return 'bg-white'
}

function getRankEmoji(idx) {
  if (idx === 0) return '🥇'
  if (idx === 1) return '🥈'
  if (idx === 2) return '🥉'
  return `#${idx + 1}`
}

function feedPet() {
  if (userStore.userPoints >= 10 && gameStore.pet && gameStore.pet.hunger < 100) {
    userStore.addPoints(-10, '餵寵物')
    gameStore.feedPet()
    sfx.playPoints()
    showPointsAnimation(-10)
  }
}

function playWithPet() {
  if (gameStore.pet && gameStore.pet.happiness < 100) {
    gameStore.playWithPet()
    sfx.playRewardBuy()
  }
}

function adoptPet(type) {
  gameStore.adoptPet(type)
  sfx.playRewardBuy()
}

function selectTheme(theme) {
  if (theme.unlocked || gameStore.currentTheme === theme.id) {
    gameStore.setTheme(theme.id)
  }
}

function completeDailyMission() {
  if (gameStore.dailyMission && !gameStore.dailyMissionDone) {
    const bonus = gameStore.dailyMission.bonus
    userStore.addPoints(bonus, '神秘任務')
    gameStore.dailyMissionDone = true
    sfx.playTaskComplete()
    showPointsAnimation(bonus)
  }
}

function spinWheel() {
  const result = gameStore.spinWheel()
  if (result) {
    sfx.playRewardBuy()
    showPointsAnimation(0)
  }
}

function printCertificate(cert) {
  // 簡單既打印功能 - 打開新視窗
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>${cert.name}</title>
  <style>
    body { font-family: 'Comic Sans MS', cursive, sans-serif; padding: 40px; text-align: center; }
    .certificate { border: 8px double #f59e0b; padding: 40px; max-width: 600px; margin: 0 auto; background: linear-gradient(to bottom, #fefce8, #fef3c7); }
    .icon { font-size: 80px; }
    h1 { color: #d97706; font-size: 32px; margin: 20px 0; }
    .name { font-size: 24px; color: #92400e; margin: 20px 0; }
    .desc { color: #78350f; font-size: 16px; }
    .date { color: #92400e; margin-top: 30px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="icon">${cert.icon}</div>
    <h1>🏅 挑戰小英雄</h1>
    <h1>${cert.name}</h1>
    <p class="name">${userStore.currentUser?.name}</p>
    <p class="desc">${cert.desc}</p>
    <p class="date">${new Date().toLocaleDateString()}</p>
  </div>
  <button onclick="window.print()">列印 / Print</button>
</body>
</html>`
  
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
  }
}

onMounted(() => {
  userStore.init()
  gameStore.init()
  soundEnabled.value = userStore.settings?.sound ?? true
  notificationEnabled.value = reminderManager.permission === 'granted'
  if (!userStore.settings?.adminPin) adminUnlocked.value = true
})
</script>

<style>
.float-enter-active { animation: floatUp 0.8s ease-out; }
.float-leave-active { transition: opacity 0.3s; }
.float-leave-to { opacity: 0; }
@keyframes floatUp {
  0% { opacity: 1; transform: translate(-50%, 0) scale(0.5); }
  50% { opacity: 1; transform: translate(-50%, -50px) scale(1.2); }
  100% { opacity: 0; transform: translate(-50%, -100px); }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 0); }
.animate-spin-slow { animation: spin 3s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
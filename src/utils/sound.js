// 島民小英雄 - 音効系統
// 使用 Web Audio API - 無需外部library

class SoundFX {
  constructor() {
    this.ctx = null
    this.enabled = true
    this.initialized = false
  }

  // 初始化 AudioContext
  init() {
    if (this.initialized) return
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
      this.initialized = true
    } catch (e) {
      console.warn('Audio not supported:', e)
    }
  }

  // 播放（處理瀏覽器自動暫停）
  play() {
    if (!this.enabled || !this.ctx) return
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  // 播放單一頻率音
  playTone(freq, duration, type = 'sine', volume = 0.3) {
    if (!this.enabled || !this.ctx) return
    
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(volume, this.ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration)
    
    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start()
    osc.stop(this.ctx.currentTime + duration)
  }

  // 任務完成 - 歡快上升音 (C5→E5→G5)
  playTaskComplete() {
    this.init()
    this.play()
    const notes = [523, 659, 784]
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine', 0.25), i * 100)
    })
  }

  // 兌換成功 - 金幣三連音
  playRewardBuy() {
    this.init()
    this.play()
    const notes = [784, 1047, 1319]
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.12, 'square', 0.15), i * 80)
    })
  }

  // 徽章解鎖 - 庄嚴号角
  playBadgeUnlock() {
    this.init()
    this.play()
    this.playTone(392, 0.3, 'sawtooth', 0.2)
    setTimeout(() => this.playTone(523, 0.4, 'sawtooth', 0.25), 150)
    setTimeout(() => this.playTone(659, 0.5, 'sawtooth', 0.3), 300)
  }

  // 點數入帳 - 叮咚
  playPoints() {
    this.init()
    this.play()
    this.playTone(880, 0.1, 'sine', 0.2)
    setTimeout(() => this.playTone(1108, 0.2, 'sine', 0.2), 100)
  }

  // 低點數警告
  playLowPoints() {
    this.init()
    this.play()
    this.playTone(220, 0.3, 'triangle', 0.3)
  }

  // 輕触音
  playTap() {
    this.init()
    this.play()
    this.playTone(600, 0.05, 'sine', 0.1)
  }

  // Tab 切换
  playTabSwitch() {
    this.init()
    this.play()
    this.playTone(440, 0.05, 'sine', 0.1)
  }

  // 寵物進化
  playEvolve() {
    this.init()
    this.play()
    this.playTone(523, 0.2, 'sine', 0.25)
    setTimeout(() => this.playTone(659, 0.2, 'sine', 0.25), 150)
    setTimeout(() => this.playTone(784, 0.2, 'sine', 0.25), 300)
    setTimeout(() => this.playTone(1047, 0.4, 'sine', 0.3), 450)
  }

  // 等級提升
  playLevelUp() {
    this.init()
    this.play()
    const notes = [392, 494, 587, 784]
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'square', 0.15), i * 100)
    })
  }

  // Streak 等級解鎖
  playStreakBonus() {
    this.init()
    this.play()
    this.playTone(523, 0.15, 'triangle', 0.2)
    setTimeout(() => this.playTone(659, 0.15, 'triangle', 0.25), 120)
    setTimeout(() => this.playTone(784, 0.15, 'triangle', 0.25), 240)
    setTimeout(() => this.playTone(1047, 0.3, 'triangle', 0.3), 360)
  }

  // 任務超時提醒
  playTaskFailed() {
    this.init()
    this.play()
    this.playTone(330, 0.3, 'sawtooth', 0.2)
    setTimeout(() => this.playTone(262, 0.4, 'sawtooth', 0.2), 200)
  }

  toggle() {
    this.enabled = !this.enabled
    return this.enabled
  }
}

export const sfx = new SoundFX()
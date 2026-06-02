/**
 * useAudioManager - 音频管理
 *
 * 使用 Web Audio API 生成白噪音
 * 修复：更可靠的初始化和播放逻辑
 */

import { useEffect, useRef } from 'react'
import { useAudioStore } from '../stores/audioStore'
import type { SoundType } from '../types'

// 全局音频上下文（避免重复创建）
let globalCtx: AudioContext | null = null

// 噪音缓冲区缓存
const bufferCache = new Map<SoundType, AudioBuffer>()

// 活跃的音频节点
const activeNodes = new Map<SoundType, { source: AudioBufferSourceNode; gain: GainNode }>()

// 获取或创建音频上下文
function getAudioContext(): AudioContext {
  if (!globalCtx || globalCtx.state === 'closed') {
    globalCtx = new AudioContext()
  }
  if (globalCtx.state === 'suspended') {
    globalCtx.resume()
  }
  return globalCtx
}

// 生成噪音缓冲区
function createNoiseBuffer(ctx: AudioContext, type: SoundType): AudioBuffer {
  if (bufferCache.has(type)) {
    return bufferCache.get(type)!
  }

  const sampleRate = ctx.sampleRate
  const duration = 2
  const bufferSize = sampleRate * duration
  const buffer = ctx.createBuffer(2, bufferSize, sampleRate)

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel)

    switch (type) {
      case 'fire':
        // 篝火：低频隆隆声 + 随机噼啪声
        for (let i = 0; i < bufferSize; i++) {
          const t = i / sampleRate
          // 低频隆隆声
          const rumble = Math.sin(t * 25 + Math.sin(t * 7) * 2) * 0.15
          // 持续的燃烧背景噪音
          const burnNoise = (Math.random() * 2 - 1) * 0.08
          // 随机噼啪声（短促高频）
          let crackle = 0
          if (Math.random() > 0.997) {
            // 噼啪声：快速衰减的高频脉冲
            const crackLen = Math.floor(sampleRate * (0.02 + Math.random() * 0.05))
            for (let j = 0; j < crackLen && (i + j) < bufferSize; j++) {
              const env = Math.exp(-j / (sampleRate * 0.008)) // 快速衰减
              const freq = 1500 + Math.random() * 3000 // 高频
              data[i + j] += Math.sin(j / sampleRate * freq * Math.PI * 2) * env * (0.3 + Math.random() * 0.4)
            }
          }
          // 偶尔的大噼啪
          if (Math.random() > 0.9995) {
            const crackLen = Math.floor(sampleRate * (0.05 + Math.random() * 0.1))
            for (let j = 0; j < crackLen && (i + j) < bufferSize; j++) {
              const env = Math.exp(-j / (sampleRate * 0.015))
              data[i + j] += (Math.random() * 2 - 1) * env * (0.4 + Math.random() * 0.3)
            }
          }
          data[i] = rumble + burnNoise + crackle
        }
        break

      case 'rain':
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.25
        }
        // 简单低通滤波
        for (let i = 1; i < bufferSize; i++) {
          data[i] = data[i] * 0.3 + data[i - 1] * 0.7
        }
        break

      case 'forest':
        // 森林：褐噪音背景 + 小鸟叫声
        let lastVal = 0
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1
          lastVal = (lastVal + 0.02 * white) / 1.02
          data[i] = lastVal * 3 // 柔和的背景噪音

          // 偶尔的小鸟叫声
          if (Math.random() > 0.99985) {
            // 生成一段鸟鸣
            const chirpDur = 0.08 + Math.random() * 0.12 // 80-200ms
            const chirpLen = Math.floor(sampleRate * chirpDur)
            const chirpFreq = 2500 + Math.random() * 2000 // 2.5-4.5kHz
            const chirpCount = 1 + Math.floor(Math.random() * 3) // 1-3个音节

            for (let j = 0; j < chirpLen * chirpCount && (i + j) < bufferSize; j++) {
              const syllableIdx = Math.floor(j / chirpLen)
              const jInSyllable = j - syllableIdx * chirpLen
              const tSyl = jInSyllable / sampleRate

              // 包络：快速起音，缓慢衰减
              const env = Math.exp(-tSyl / (chirpDur * 0.3)) * Math.sin(Math.PI * tSyl / chirpDur)

              // 频率微微上扬
              const freq = chirpFreq * (1 + tSyl * 2)

              // 音节间的小停顿
              const gap = Math.sin(Math.PI * (jInSyllable / chirpLen))

              data[i + j] += Math.sin(tSyl * freq * Math.PI * 2) * env * gap * 0.2
            }
          }

          // 非常偶尔的低沉鸟叫（远处的）
          if (Math.random() > 0.99998) {
            const callDur = 0.3 + Math.random() * 0.2
            const callLen = Math.floor(sampleRate * callDur)
            const callFreq = 800 + Math.random() * 400

            for (let j = 0; j < callLen && (i + j) < bufferSize; j++) {
              const t = j / sampleRate
              const env = Math.exp(-t / (callDur * 0.4)) * Math.sin(Math.PI * t / callDur)
              data[i + j] += Math.sin(t * callFreq * Math.PI * 2) * env * 0.15
            }
          }
        }
        break

      case 'ocean':
        for (let i = 0; i < bufferSize; i++) {
          const t = i / sampleRate
          const wave = (Math.sin(t * 0.7) + 1) / 2
          data[i] = (Math.random() * 2 - 1) * wave * 0.3
        }
        break

      default:
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.2
        }
    }
  }

  bufferCache.set(type, buffer)
  return buffer
}

// 播放噪音
function startNoise(type: SoundType, volume: number) {
  if (activeNodes.has(type)) {
    // 已在播放，只调整音量
    const nodes = activeNodes.get(type)!
    nodes.gain.gain.setValueAtTime(volume, getAudioContext().currentTime)
    return
  }

  const ctx = getAudioContext()
  const buffer = createNoiseBuffer(ctx, type)

  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.loop = true

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.2)

  source.connect(gain)
  gain.connect(ctx.destination)
  source.start()

  activeNodes.set(type, { source, gain })
}

// 停止噪音
function stopNoise(type: SoundType) {
  const nodes = activeNodes.get(type)
  if (!nodes) return

  const ctx = getAudioContext()
  nodes.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3)

  setTimeout(() => {
    try {
      nodes.source.stop()
      nodes.source.disconnect()
      nodes.gain.disconnect()
    } catch {}
    activeNodes.delete(type)
  }, 350)
}

export function useAudioManager() {
  const { tracks, muted, masterVolume } = useAudioStore()
  const initedRef = useRef(false)

  // 初始化（用户交互后）
  useEffect(() => {
    const unlock = () => {
      if (!initedRef.current) {
        getAudioContext()
        initedRef.current = true
        console.log('✅ 音频已解锁')
      }
      document.removeEventListener('click', unlock)
      document.removeEventListener('touchstart', unlock)
      document.removeEventListener('pointerdown', unlock)
    }

    document.addEventListener('click', unlock)
    document.addEventListener('touchstart', unlock)
    document.addEventListener('pointerdown', unlock)

    return () => {
      document.removeEventListener('click', unlock)
      document.removeEventListener('touchstart', unlock)
      document.removeEventListener('pointerdown', unlock)
    }
  }, [])

  // 控制播放
  useEffect(() => {
    if (!initedRef.current) return

    Object.entries(tracks).forEach(([id, state]) => {
      const type = id as SoundType
      const vol = muted ? 0 : state.volume * masterVolume

      if (state.active && vol > 0.01) {
        startNoise(type, vol)
      } else {
        stopNoise(type)
      }
    })
  }, [tracks, muted, masterVolume])

  // 清理
  useEffect(() => {
    return () => {
      activeNodes.forEach((_, type) => stopNoise(type))
    }
  }, [])
}

export default useAudioManager

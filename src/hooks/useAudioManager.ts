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
        for (let i = 0; i < bufferSize; i++) {
          const t = i / sampleRate
          const rumble = Math.sin(t * 30 + Math.random()) * 0.2
          const crackle = Math.random() > 0.998 ? Math.random() * 0.6 : 0
          const noise = (Math.random() * 2 - 1) * 0.1
          data[i] = rumble + crackle + noise
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
        let lastVal = 0
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1
          lastVal = (lastVal + 0.02 * white) / 1.02
          data[i] = lastVal * 4
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

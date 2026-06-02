/**
 * useAudioManager - 音频管理
 *
 * 使用 Web Audio API 生成白噪音，无需外部音频文件
 */

import { useEffect, useRef, useCallback } from 'react'
import { useAudioStore } from '../stores/audioStore'
import type { SoundType } from '../types'

// 音频节点类型
interface AudioNodes {
  source: AudioBufferSourceNode
  gain: GainNode
}

// 生成不同类型的噪音缓冲区
function createNoiseBuffer(ctx: AudioContext, type: SoundType): AudioBuffer {
  const sampleRate = ctx.sampleRate
  const duration = 2 // 2秒循环
  const bufferSize = sampleRate * duration
  const buffer = ctx.createBuffer(2, bufferSize, sampleRate)

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel)

    switch (type) {
      case 'fire':
        // 篝火：低频隆隆声 + 随机噼啪声
        for (let i = 0; i < bufferSize; i++) {
          const t = i / sampleRate
          const rumble = Math.sin(t * 40 + Math.random() * 0.5) * 0.3
          const crackle = Math.random() > 0.999 ? Math.random() * 0.8 : 0
          const noise = (Math.random() * 2 - 1) * 0.15
          data[i] = rumble + crackle + noise
        }
        break

      case 'rain':
        // 雨声：粉红噪音
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1
          b0 = 0.99886 * b0 + white * 0.0555179
          b1 = 0.99332 * b1 + white * 0.0750759
          b2 = 0.96900 * b2 + white * 0.1538520
          b3 = 0.86650 * b3 + white * 0.3104856
          b4 = 0.55000 * b4 + white * 0.5329522
          b5 = -0.7616 * b5 - white * 0.0168980
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
          b6 = white * 0.115926
        }
        break

      case 'forest':
        // 森林：褐噪音 + 鸟鸣模拟
        let lastOut = 0
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1
          lastOut = (lastOut + (0.02 * white)) / 1.02
          data[i] = lastOut * 3.5
          // 偶尔添加高频鸟鸣
          if (Math.random() > 0.9998) {
            const chirpLen = Math.floor(sampleRate * 0.1)
            for (let j = 0; j < chirpLen && i + j < bufferSize; j++) {
              const t = j / sampleRate
              data[i + j] += Math.sin(t * 2000 * Math.PI) * 0.3 * (1 - t * 10)
            }
          }
        }
        break

      case 'ocean':
        // 海浪：调制白噪音
        for (let i = 0; i < bufferSize; i++) {
          const t = i / sampleRate
          const wave = Math.sin(t * 0.5) * 0.5 + 0.5 // 缓慢波动
          const noise = (Math.random() * 2 - 1)
          data[i] = noise * wave * 0.5
        }
        break

      default:
        // 默认白噪音
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.3
        }
    }
  }

  return buffer
}

export function useAudioManager() {
  const { tracks, muted, masterVolume } = useAudioStore()
  const ctxRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<Map<SoundType, AudioNodes>>(new Map())
  const buffersRef = useRef<Map<SoundType, AudioBuffer>>(new Map())
  const initializedRef = useRef(false)

  // 初始化音频上下文
  const initAudio = useCallback(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    try {
      const ctx = new AudioContext()
      ctxRef.current = ctx

      // 生成所有噪音缓冲区
      const soundTypes: SoundType[] = ['fire', 'rain', 'forest', 'ocean']
      soundTypes.forEach((type) => {
        const buffer = createNoiseBuffer(ctx, type)
        buffersRef.current.set(type, buffer)
      })

      console.log('✅ 音频系统初始化完成')
    } catch (err) {
      console.error('音频初始化失败:', err)
    }
  }, [])

  // 用户交互后初始化
  useEffect(() => {
    const unlock = () => {
      initAudio()
      document.removeEventListener('click', unlock)
      document.removeEventListener('touchstart', unlock)
      document.removeEventListener('keydown', unlock)
    }

    document.addEventListener('click', unlock)
    document.addEventListener('touchstart', unlock)
    document.addEventListener('keydown', unlock)

    return () => {
      document.removeEventListener('click', unlock)
      document.removeEventListener('touchstart', unlock)
      document.removeEventListener('keydown', unlock)
    }
  }, [initAudio])

  // 控制音频播放
  useEffect(() => {
    const ctx = ctxRef.current
    if (!ctx) return

    // 恢复 AudioContext（如果被暂停）
    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    Object.entries(tracks).forEach(([id, state]) => {
      const type = id as SoundType
      const targetVolume = muted ? 0 : state.volume * masterVolume

      if (state.active && targetVolume > 0) {
        // 需要播放
        if (!nodesRef.current.has(type)) {
          // 创建新的播放节点
          const buffer = buffersRef.current.get(type)
          if (!buffer) return

          const source = ctx.createBufferSource()
          source.buffer = buffer
          source.loop = true

          const gain = ctx.createGain()
          gain.gain.value = 0

          source.connect(gain)
          gain.connect(ctx.destination)
          source.start()

          nodesRef.current.set(type, { source, gain })
        }

        // 设置音量
        const nodes = nodesRef.current.get(type)
        if (nodes) {
          nodes.gain.gain.linearRampToValueAtTime(
            targetVolume,
            ctx.currentTime + 0.2
          )
        }
      } else {
        // 需要停止
        const nodes = nodesRef.current.get(type)
        if (nodes) {
          nodes.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3)
          setTimeout(() => {
            try {
              nodes.source.stop()
              nodes.source.disconnect()
              nodes.gain.disconnect()
            } catch {}
            nodesRef.current.delete(type)
          }, 350)
        }
      }
    })
  }, [tracks, muted, masterVolume])

  // 清理
  useEffect(() => {
    return () => {
      nodesRef.current.forEach((nodes) => {
        try {
          nodes.source.stop()
          nodes.source.disconnect()
          nodes.gain.disconnect()
        } catch {}
      })
      nodesRef.current.clear()

      if (ctxRef.current) {
        ctxRef.current.close()
      }
    }
  }, [])

  return { ready: initializedRef.current }
}

export default useAudioManager

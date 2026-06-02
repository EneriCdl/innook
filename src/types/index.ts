/**
 * Innook - TypeScript 类型定义
 */

// 应用状态
export type AppMode = 'setup' | 'focus' | 'analytics'

// 场景配置
export interface Scene {
  id: string
  name: string
  description: string
  image: string
}

// 音效类型
export type SoundType = 'fire' | 'rain' | 'forest' | 'ocean'

// 音效状态
export interface SoundState {
  volume: number
  active: boolean
}

// 学习记录
export interface SessionRecord {
  id: string
  startTime: string
  endTime: string
  durationSeconds: number
  content: string
  isHonest: boolean
}

// 每日记录
export interface DailyRecord {
  date: string
  totalSeconds: number
  sessions: SessionRecord[]
  goalMinutes: number
}

// 激励语句
export interface Quote {
  text: string
  author: string
}

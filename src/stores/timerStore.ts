/**
 * Timer Store - 计时器状态
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DailyRecord, SessionRecord } from '../types'

const getToday = (): string => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

interface TimerState {
  countdownMinutes: number
  remainingSeconds: number
  status: 'idle' | 'running' | 'paused' | 'completed'
  sessionStartTime: string | null
  dailyGoalMinutes: number
  records: DailyRecord[]
}

interface TimerActions {
  setCountdownMinutes: (mins: number) => void
  setDailyGoalMinutes: (mins: number) => void
  start: () => void
  pause: () => void
  resume: () => void
  reset: () => void
  tick: () => void
  complete: () => void
  saveSession: (content: string) => void
  discardSession: () => void
  getTodaySeconds: () => number
  getDailyGoalSeconds: () => number
  getRecords: () => DailyRecord[]
}

export const useTimerStore = create<TimerState & TimerActions>()(
  persist(
    (set, get) => ({
      countdownMinutes: 25,
      remainingSeconds: 25 * 60,
      status: 'idle',
      sessionStartTime: null,
      dailyGoalMinutes: 120,
      records: [],

      setCountdownMinutes: (mins) => {
        const clamped = Math.max(1, Math.min(180, mins))
        set({ countdownMinutes: clamped, remainingSeconds: clamped * 60 })
      },

      setDailyGoalMinutes: (mins) => {
        set({ dailyGoalMinutes: Math.max(15, Math.min(480, mins)) })
      },

      start: () => set({ status: 'running', sessionStartTime: new Date().toISOString() }),
      pause: () => set({ status: 'paused' }),
      resume: () => set({ status: 'running' }),

      reset: () => set((s) => ({
        status: 'idle',
        remainingSeconds: s.countdownMinutes * 60,
        sessionStartTime: null,
      })),

      tick: () => set((s) => {
        if (s.status !== 'running') return s
        const newRemaining = s.remainingSeconds - 1
        if (newRemaining <= 0) {
          return { remainingSeconds: 0, status: 'completed' }
        }
        return { remainingSeconds: newRemaining }
      }),

      complete: () => set({ status: 'completed' }),

      saveSession: (content) => set((s) => {
        // 计算真实专注时长：预设时长 - 剩余时间
        const totalPlannedSeconds = s.countdownMinutes * 60
        const actualDurationSeconds = totalPlannedSeconds - s.remainingSeconds

        const session: SessionRecord = {
          id: Date.now().toString(),
          startTime: s.sessionStartTime || new Date().toISOString(),
          endTime: new Date().toISOString(),
          durationSeconds: actualDurationSeconds,
          content,
          isHonest: true,
        }

        const today = getToday()
        const existingIdx = s.records.findIndex((r) => r.date === today)
        const newRecords = [...s.records]

        if (existingIdx >= 0) {
          newRecords[existingIdx] = {
            ...newRecords[existingIdx],
            totalSeconds: newRecords[existingIdx].totalSeconds + session.durationSeconds,
            sessions: [...newRecords[existingIdx].sessions, session],
          }
        } else {
          newRecords.push({
            date: today,
            totalSeconds: session.durationSeconds,
            sessions: [session],
            goalMinutes: s.dailyGoalMinutes,
          })
        }

        return {
          records: newRecords,
          status: 'idle',
          remainingSeconds: s.countdownMinutes * 60,
          sessionStartTime: null,
        }
      }),

      discardSession: () => set((s) => ({
        status: 'idle',
        remainingSeconds: s.countdownMinutes * 60,
        sessionStartTime: null,
      })),

      getTodaySeconds: () => {
        const today = getToday()
        const record = get().records.find((r) => r.date === today)
        return record?.totalSeconds || 0
      },

      getDailyGoalSeconds: () => get().dailyGoalMinutes * 60,
      getRecords: () => get().records,
    }),
    {
      name: 'innook-timer',
      partialize: (s) => ({
        countdownMinutes: s.countdownMinutes,
        dailyGoalMinutes: s.dailyGoalMinutes,
        records: s.records,
      }),
    }
  )
)

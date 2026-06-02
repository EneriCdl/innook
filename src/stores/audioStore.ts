/**
 * Audio Store - 音频状态
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SoundType, SoundState } from '../types'

interface AudioState {
  tracks: Record<SoundType, SoundState>
  masterVolume: number
  muted: boolean
}

interface AudioActions {
  toggleTrack: (id: SoundType) => void
  setTrackVolume: (id: SoundType, volume: number) => void
  setMasterVolume: (volume: number) => void
  toggleMuted: () => void
}

export const useAudioStore = create<AudioState & AudioActions>()(
  persist(
    (set) => ({
      tracks: {
        fire: { volume: 0.6, active: true },
        rain: { volume: 0, active: false },
        forest: { volume: 0, active: false },
        ocean: { volume: 0, active: false },
      },
      masterVolume: 0.8,
      muted: false,

      toggleTrack: (id) => set((s) => ({
        tracks: {
          ...s.tracks,
          [id]: {
            ...s.tracks[id],
            active: !s.tracks[id].active,
            volume: !s.tracks[id].active && s.tracks[id].volume === 0 ? 0.5 : s.tracks[id].volume,
          },
        },
      })),

      setTrackVolume: (id, volume) => set((s) => ({
        tracks: { ...s.tracks, [id]: { volume, active: volume > 0 } },
      })),

      setMasterVolume: (volume) => set({ masterVolume: volume }),
      toggleMuted: () => set((s) => ({ muted: !s.muted })),
    }),
    { name: 'innook-audio' }
  )
)

/**
 * App Store - 应用全局状态
 */

import { create } from 'zustand'
import type { AppMode } from '../types'

interface AppState {
  mode: AppMode
  sceneIndex: number
}

interface AppActions {
  setMode: (mode: AppMode) => void
  setSceneIndex: (index: number) => void
}

export const useAppStore = create<AppState & AppActions>()((set) => ({
  mode: 'setup',
  sceneIndex: 0,
  setMode: (mode) => set({ mode }),
  setSceneIndex: (index) => set({ sceneIndex: index }),
}))

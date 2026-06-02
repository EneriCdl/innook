/**
 * useKeyboardShortcuts - 键盘快捷键
 */

import { useEffect } from 'react'
import { useAppStore } from '../stores/appStore'
import { useTimerStore } from '../stores/timerStore'
import { useAudioStore } from '../stores/audioStore'

export function useKeyboardShortcuts() {
  const { mode, setMode } = useAppStore()
  const { status, start, pause, resume, complete } = useTimerStore()
  const { toggleMuted } = useAudioStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          if (mode === 'setup') {
            start()
            setMode('focus')
          } else if (mode === 'focus') {
            status === 'running' ? pause() : resume()
          }
          break
        case 'Escape':
          if (mode === 'focus') {
            complete()
            setMode('setup')
          } else if (mode === 'analytics') {
            setMode('setup')
          }
          break
        case 'KeyM':
          toggleMuted()
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [mode, status, start, pause, resume, complete, setMode, toggleMuted])
}

export default useKeyboardShortcuts

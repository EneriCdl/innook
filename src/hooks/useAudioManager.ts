/**
 * useAudioManager - 音频管理
 */

import { useEffect, useRef, useState } from 'react'
import { Howl } from 'howler'
import { useAudioStore } from '../stores/audioStore'
import { SOUNDS } from '../config/sounds'
import type { SoundType } from '../types'

export function useAudioManager() {
  const { tracks, muted, masterVolume } = useAudioStore()
  const howlsRef = useRef<Map<SoundType, Howl>>(new Map())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const init = () => {
      Object.entries(SOUNDS).forEach(([id, config]) => {
        const howl = new Howl({
          src: [config.src],
          loop: true,
          volume: 0,
          html5: true,
          preload: true,
          onloaderror: (_, err) => console.warn(`Audio failed: ${id}`, err),
        })
        howlsRef.current.set(id as SoundType, howl)
      })
      setReady(true)
    }

    const unlock = () => {
      init()
      document.removeEventListener('click', unlock)
      document.removeEventListener('touchstart', unlock)
    }

    document.addEventListener('click', unlock)
    document.addEventListener('touchstart', unlock)
    return () => {
      document.removeEventListener('click', unlock)
      document.removeEventListener('touchstart', unlock)
    }
  }, [])

  useEffect(() => {
    if (!ready) return

    Object.entries(tracks).forEach(([id, state]) => {
      const howl = howlsRef.current.get(id as SoundType)
      if (!howl) return

      const vol = muted ? 0 : state.volume * masterVolume

      if (state.active && vol > 0) {
        if (!howl.playing()) howl.play()
        howl.fade(howl.volume(), vol, 200)
      } else if (howl.playing()) {
        howl.fade(howl.volume(), 0, 300)
        setTimeout(() => { if (howl.volume() === 0) howl.pause() }, 350)
      }
    })
  }, [tracks, muted, masterVolume, ready])

  useEffect(() => {
    return () => { howlsRef.current.forEach((h) => { try { h.unload() } catch {} }) }
  }, [])

  return { ready }
}

export default useAudioManager

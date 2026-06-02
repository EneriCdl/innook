/**
 * Innook - 音频配置
 */

import type { SoundType } from '../types'

export interface SoundConfig {
  name: string
  icon: string
  src: string
}

export const SOUNDS: Record<SoundType, SoundConfig> = {
  fire: { name: '篝火', icon: '🔥', src: 'https://cdn.freesound.org/previews/506/506037_1074158-lq.mp3' },
  rain: { name: '雨声', icon: '🌧️', src: 'https://cdn.freesound.org/previews/531/531851_6244899-lq.mp3' },
  forest: { name: '森林', icon: '🌲', src: 'https://cdn.freesound.org/previews/460/460668_9252006-lq.mp3' },
  ocean: { name: '海浪', icon: '🌊', src: 'https://cdn.freesound.org/previews/467/467813_9497060-lq.mp3' },
}

export const SOUND_LIST: SoundType[] = ['fire', 'rain', 'forest', 'ocean']

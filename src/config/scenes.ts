/**
 * Innook - 场景配置
 */

import type { Scene } from '../types'

export const SCENES: Scene[] = [
  {
    id: 'morning-window',
    name: '清晨窗边',
    description: '晨光、植物、安静书桌',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&q=80',
  },
  {
    id: 'mountain-study',
    name: '雪山书房',
    description: '远山、云雾、温暖灯光',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80',
  },
  {
    id: 'seaside-study',
    name: '海边书房',
    description: '海浪、夕阳、宁静',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80',
  },
  {
    id: 'night-window',
    name: '夜窗静读',
    description: '夜色、台灯、专注',
    image: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=1920&q=80',
  },
]

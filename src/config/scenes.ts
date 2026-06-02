/**
 * Innook - 场景配置
 *
 * 使用 Picsum Photos 作为图片源（更稳定）
 */

import type { Scene } from '../types'

export const SCENES: Scene[] = [
  {
    id: 'morning-window',
    name: '清晨窗边',
    description: '晨光、植物、安静书桌',
    image: 'https://picsum.photos/id/164/1920/1080',
  },
  {
    id: 'mountain-study',
    name: '雪山书房',
    description: '远山、云雾、温暖灯光',
    image: 'https://picsum.photos/id/29/1920/1080',
  },
  {
    id: 'seaside-study',
    name: '海边书房',
    description: '海浪、夕阳、宁静',
    image: 'https://picsum.photos/id/10/1920/1080',
  },
  {
    id: 'night-window',
    name: '图书馆',
    description: '书架、灯光、安静',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&q=80',
  },
]

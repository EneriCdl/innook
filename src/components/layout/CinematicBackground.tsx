/**
 * CinematicBackground - 电影级背景
 *
 * 修复：超时逻辑 bug，使用 ref 跟踪加载状态
 */

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../stores/appStore'
import { SCENES } from '../../config/scenes'

// CSS 渐变备用背景
const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  'linear-gradient(135deg, #0d1b2a 0%, #1b2838 50%, #2d4059 100%)',
  'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
]

export function CinematicBackground() {
  const { sceneIndex, mode } = useAppStore()
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const loadedRef = useRef(false)
  const scene = SCENES[sceneIndex]

  useEffect(() => {
    setLoaded(false)
    setError(false)
    loadedRef.current = false

    const img = new Image()

    img.onload = () => {
      loadedRef.current = true
      setLoaded(true)
    }

    img.onerror = () => {
      console.warn('背景图加载失败，使用备用渐变')
      setError(true)
      setLoaded(true)
    }

    img.src = scene.image

    // 超时处理：使用 ref 检查是否已加载
    const timeout = setTimeout(() => {
      if (!loadedRef.current) {
        console.warn('背景图加载超时')
        setError(true)
        setLoaded(true)
      }
    }, 8000) // 增加到 8 秒

    return () => clearTimeout(timeout)
  }, [scene.image])

  return (
    <div className="fixed inset-0 z-0">
      {/* 备用渐变背景（始终显示） */}
      <div
        className="absolute inset-0"
        style={{ background: FALLBACK_GRADIENTS[sceneIndex % FALLBACK_GRADIENTS.length] }}
      />

      {/* 背景图片 */}
      {!error && (
        <AnimatePresence mode="wait">
          <motion.div
            key={sceneIndex}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={scene.image}
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
      )}

      {/* 遮罩层 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1a]/50 to-transparent" />

      {/* 专注模式加深遮罩 */}
      <AnimatePresence>
        {mode === 'focus' && (
          <motion.div
            className="absolute inset-0 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* 底部渐变 */}
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-[#0a0a12] via-[#0a0a12]/80 to-transparent" />

      {/* 胶片颗粒 */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />
    </div>
  )
}

export default CinematicBackground

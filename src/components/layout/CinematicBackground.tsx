/**
 * CinematicBackground - 电影级背景
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../stores/appStore'
import { SCENES } from '../../config/scenes'

export function CinematicBackground() {
  const { sceneIndex, mode } = useAppStore()
  const [loaded, setLoaded] = useState(false)
  const scene = SCENES[sceneIndex]

  useEffect(() => {
    setLoaded(false)
    const img = new Image()
    img.onload = () => setLoaded(true)
    img.src = scene.image
  }, [scene.image])

  return (
    <div className="fixed inset-0 z-0">
      {/* 背景图片 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sceneIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: loaded ? 1 : 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <img src={scene.image} alt="" className="w-full h-full object-cover" />
        </motion.div>
      </AnimatePresence>

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

/**
 * SceneSelector - 场景选择器
 *
 * 优化：适配大玻璃框，响应式布局
 */

import { motion } from 'framer-motion'
import { useAppStore } from '../../stores/appStore'
import { SCENES } from '../../config/scenes'

export function SceneSelector() {
  const { sceneIndex, setSceneIndex } = useAppStore()

  return (
    <div className="grid grid-cols-2 gap-3">
      {SCENES.map((scene, idx) => (
        <motion.button
          key={scene.id}
          className={`relative rounded-xl overflow-hidden transition-all ${
            idx === sceneIndex
              ? 'ring-2 ring-violet-400/60 shadow-lg shadow-violet-500/20'
              : 'opacity-60 hover:opacity-80'
          }`}
          onClick={() => setSceneIndex(idx)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {/* 图片 */}
          <div className="aspect-video bg-white/5">
            <img
              src={scene.image}
              alt={scene.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* 渐变遮罩 + 标题 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-sm font-medium text-white/90">{scene.name}</p>
            <p className="text-[10px] text-white/50 mt-0.5">{scene.description}</p>
          </div>

          {/* 选中指示 */}
          {idx === sceneIndex && (
            <motion.div
              className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-violet-400"
              layoutId="sceneActive"
            />
          )}
        </motion.button>
      ))}
    </div>
  )
}

export default SceneSelector

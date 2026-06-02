/**
 * SceneSelector - 场景选择器（紧凑版）
 */

import { motion } from 'framer-motion'
import { useAppStore } from '../../stores/appStore'
import { SCENES } from '../../config/scenes'

export function SceneSelector() {
  const { sceneIndex, setSceneIndex } = useAppStore()

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs text-white/40 font-medium uppercase tracking-wider">
        场景
      </span>

      <div className="grid grid-cols-4 gap-2">
        {SCENES.map((scene, idx) => (
          <motion.button
            key={scene.id}
            className={`relative rounded-lg overflow-hidden transition-all ${
              idx === sceneIndex
                ? 'ring-2 ring-violet-400/60'
                : 'opacity-50 hover:opacity-75'
            }`}
            onClick={() => setSceneIndex(idx)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="aspect-[3/2]">
              <img src={scene.image} alt={scene.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-1.5">
              <p className="text-[9px] text-white/80 leading-tight">{scene.name}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default SceneSelector

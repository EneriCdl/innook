/**
 * SoundMixer - 声音氛围
 *
 * 优化：适配大玻璃框，响应式布局
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useAudioStore } from '../../stores/audioStore'
import { SOUNDS, SOUND_LIST } from '../../config/sounds'

export function SoundMixer() {
  const { tracks, toggleTrack, setTrackVolume } = useAudioStore()

  return (
    <div className="space-y-4">
      {/* 音源按钮网格 */}
      <div className="grid grid-cols-2 gap-3">
        {SOUND_LIST.map((id) => {
          const config = SOUNDS[id]
          const state = tracks[id]

          return (
            <motion.button
              key={id}
              className={`
                flex items-center gap-3 p-3 rounded-xl transition-all
                ${state.active
                  ? 'bg-white/10 shadow-inner'
                  : 'bg-white/[0.03] hover:bg-white/[0.06]'
                }
              `}
              onClick={() => toggleTrack(id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-2xl">{config.icon}</span>
              <div className="text-left">
                <p className={`text-sm font-medium ${state.active ? 'text-white/90' : 'text-white/50'}`}>
                  {config.name}
                </p>
                {state.active && (
                  <p className="text-[10px] text-white/30">{Math.round(state.volume * 100)}%</p>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* 音量滑块 */}
      <AnimatePresence>
        {SOUND_LIST.filter((id) => tracks[id].active).length > 0 && (
          <motion.div
            className="space-y-3 pt-2 border-t border-white/5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {SOUND_LIST.filter((id) => tracks[id].active).map((id) => {
              const config = SOUNDS[id]
              const state = tracks[id]

              return (
                <motion.div
                  key={id}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <span className="text-sm w-6 text-center">{config.icon}</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={state.volume}
                    onChange={(e) => setTrackVolume(id, parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-xs text-white/30 w-10 text-right tabular-nums">
                    {Math.round(state.volume * 100)}%
                  </span>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SoundMixer

/**
 * SoundMixer - 声音氛围（紧凑版）
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useAudioStore } from '../../stores/audioStore'
import { SOUNDS, SOUND_LIST } from '../../config/sounds'

export function SoundMixer() {
  const { tracks, toggleTrack, setTrackVolume } = useAudioStore()

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs text-white/40 font-medium uppercase tracking-wider">
        声音
      </span>

      {/* 音源按钮 */}
      <div className="grid grid-cols-4 gap-2">
        {SOUND_LIST.map((id) => {
          const config = SOUNDS[id]
          const state = tracks[id]

          return (
            <motion.button
              key={id}
              className={`
                flex flex-col items-center gap-1 p-2 rounded-lg transition-colors
                ${state.active ? 'bg-white/10' : 'bg-white/[0.03] hover:bg-white/[0.06]'}
              `}
              onClick={() => toggleTrack(id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">{config.icon}</span>
              <span className={`text-[9px] ${state.active ? 'text-white/80' : 'text-white/30'}`}>
                {config.name}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* 音量滑块 */}
      <AnimatePresence>
        {SOUND_LIST.filter((id) => tracks[id].active).map((id) => {
          const config = SOUNDS[id]
          const state = tracks[id]

          return (
            <motion.div
              key={id}
              className="flex items-center gap-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <span className="text-xs w-4">{config.icon}</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={state.volume}
                onChange={(e) => setTrackVolume(id, parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-[10px] text-white/30 w-7 text-right">
                {Math.round(state.volume * 100)}%
              </span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default SoundMixer

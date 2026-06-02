/**
 * SetupMode - 准备模式
 *
 * 功能：
 * - 自定义计时器设置
 * - 场景选择
 * - 声音氛围
 * - 开始专注按钮
 */

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { useAppStore } from '../../stores/appStore'
import { useTimerStore } from '../../stores/timerStore'
import { SceneSelector } from './SceneSelector'
import { SoundMixer } from './SoundMixer'

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function SetupMode() {
  const { setMode } = useAppStore()
  const { countdownMinutes, remainingSeconds, setCountdownMinutes, start } = useTimerStore()

  const handleStart = () => {
    start()
    setMode('focus')
  }

  return (
    <motion.div
      className="relative z-10 flex flex-col items-center min-h-screen px-4 pt-32 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* 标题 */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-5xl md:text-6xl font-extralight text-white/90 tracking-tight mb-3" style={{ fontWeight: 200 }}>
          专注时刻
        </h1>
        <p className="text-lg text-white/40 font-light">
          选择场景与氛围，开始你的学习旅程
        </p>
      </motion.div>

      {/* 计时器设置 */}
      <motion.div
        className="w-full max-w-md mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* 时间预览 */}
        <div className="text-center mb-6">
          <div className="text-8xl font-extralight text-white tabular-nums tracking-tighter mb-2" style={{ fontWeight: 200 }}>
            {formatTime(remainingSeconds)}
          </div>
          <p className="text-sm text-white/30">专注时长</p>
        </div>

        {/* 滑块 */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-white/30 mb-2">
            <span>1 分钟</span>
            <span className="text-white/60 font-medium">{countdownMinutes} 分钟</span>
            <span>180 分钟</span>
          </div>
          <input
            type="range"
            min="1"
            max="180"
            value={countdownMinutes}
            onChange={(e) => setCountdownMinutes(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* 快捷预设 */}
        <div className="flex justify-center gap-2">
          {[25, 45, 60, 90].map((mins) => (
            <motion.button
              key={mins}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                countdownMinutes === mins
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-white/40 hover:text-white/60 border border-transparent'
              }`}
              onClick={() => setCountdownMinutes(mins)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mins} 分钟
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* 底部控制区 - Bento Grid */}
      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="glass-panel p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 场景选择 */}
            <div>
              <SceneSelector />
            </div>

            {/* 声音氛围 */}
            <div>
              <SoundMixer />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 开始专注按钮 */}
      <motion.button
        className="mt-8 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium flex items-center gap-3 shadow-lg shadow-violet-500/25"
        onClick={handleStart}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)' }}
        whileTap={{ scale: 0.98 }}
      >
        <Play size={20} fill="white" />
        开始专注
      </motion.button>
    </motion.div>
  )
}

export default SetupMode

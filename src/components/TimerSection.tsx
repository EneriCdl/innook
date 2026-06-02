/**
 * TimerSection - 计时器区域
 */

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { useTimerStore } from '../stores/timerStore'
import { useAppStore } from '../stores/appStore'

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function TimerSection() {
  const { setMode } = useAppStore()
  const { countdownMinutes, remainingSeconds, setCountdownMinutes, start } = useTimerStore()

  const handleStart = () => {
    start()
    setMode('focus')
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 时间数字 */}
      <div className="text-center">
        <div
          className="text-7xl md:text-8xl text-white tabular-nums tracking-tighter"
          style={{ fontWeight: 200 }}
        >
          {formatTime(remainingSeconds)}
        </div>
        <p className="text-xs text-white/30 mt-1">专注时长</p>
      </div>

      {/* 滑块 */}
      <div className="w-full">
        <div className="flex justify-between text-[11px] text-white/30 mb-2">
          <span>1 分钟</span>
          <span className="text-white/50">{countdownMinutes} 分钟</span>
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

      {/* 预设按钮 */}
      <div className="flex gap-2">
        {[25, 45, 60, 90].map((mins) => (
          <motion.button
            key={mins}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              countdownMinutes === mins
                ? 'bg-violet-600 text-white'
                : 'bg-white/5 text-white/40 hover:bg-white/10'
            }`}
            onClick={() => setCountdownMinutes(mins)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mins} 分钟
          </motion.button>
        ))}
      </div>

      {/* 开始按钮 */}
      <motion.button
        className="flex items-center gap-2 px-8 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30"
        onClick={handleStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Play size={18} fill="white" />
        开始专注
      </motion.button>
    </div>
  )
}

export default TimerSection

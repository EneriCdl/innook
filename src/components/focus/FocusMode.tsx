/**
 * FocusMode - 专注模式
 *
 * 修复：useHonestyCheck 只在 FocusMode 中创建一次，通过 props 传给 HonestyModal
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Pause, Play, Square } from 'lucide-react'
import { useTimerStore } from '../../stores/timerStore'
import { useHonestyCheck } from '../../hooks/useHonestyCheck'
import { getRandomQuote } from '../../config/quotes'
import { HonestyModal } from './HonestyModal'

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function FocusMode() {
  const { remainingSeconds, status, tick, pause, resume, complete } = useTimerStore()
  const [quote] = useState(getRandomQuote())
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 在这里创建唯一的 honestyCheck 实例
  const honestyCheck = useHonestyCheck()

  // 计时器逻辑
  useEffect(() => {
    if (status === 'running') {
      const interval = setInterval(tick, 1000)
      return () => clearInterval(interval)
    }
  }, [status, tick])

  // 完成检测
  useEffect(() => {
    if (status === 'completed' && honestyCheck.state === 'idle') {
      honestyCheck.trigger()
    }
  }, [status, honestyCheck.state, honestyCheck.trigger])

  // 鼠标移动显示控制条
  const handleMouseMove = useCallback(() => {
    setShowControls(true)
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000)
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchstart', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchstart', handleMouseMove)
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current)
    }
  }, [handleMouseMove])

  // 结束专注
  const handleEnd = useCallback(() => {
    complete()
  }, [complete])

  return (
    <motion.div
      className="relative z-10 flex flex-col items-center justify-center h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 倒计时数字 */}
      <motion.div
        className="text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        <div
          className="text-[120px] md:text-[180px] font-extralight text-white tabular-nums tracking-tighter"
          style={{
            fontWeight: 200,
            textShadow: '0 0 60px rgba(139, 92, 246, 0.3), 0 0 120px rgba(139, 92, 246, 0.15)',
          }}
        >
          {formatTime(remainingSeconds)}
        </div>
      </motion.div>

      {/* 激励语句 */}
      <motion.div
        className="text-center mt-8 max-w-lg px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p
          className="text-lg text-white/70 italic"
          style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
        >
          "{quote.text}"
        </p>
        <p className="text-sm text-white/30 mt-2">— {quote.author}</p>
      </motion.div>

      {/* 底部控制条 - 始终显示，不用隐藏 */}
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="glass-panel px-6 py-3 flex items-center gap-4">
          {/* 暂停/继续 */}
          <motion.button
            className="p-3 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
            onClick={status === 'running' ? pause : resume}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {status === 'running' ? <Pause size={20} /> : <Play size={20} fill="white" />}
          </motion.button>

          {/* 结束按钮 */}
          <motion.button
            className="p-3 rounded-full bg-white/10 text-white/80 hover:bg-red-500/30 transition-colors"
            onClick={handleEnd}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Square size={20} />
          </motion.button>
        </div>
      </motion.div>

      {/* 诚实打卡弹窗 - 传入共享的 honestyCheck */}
      <HonestyModal honestyCheck={honestyCheck} />
    </motion.div>
  )
}

export default FocusMode

/**
 * CalendarButton - 日历按钮（更显眼版本）
 */

import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { useAppStore } from '../stores/appStore'

export function CalendarButton() {
  const { setMode } = useAppStore()

  return (
    <motion.button
      className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium"
      style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #8b5cf6 100%)',
        boxShadow: '0 4px 24px rgba(124, 58, 237, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset',
      }}
      onClick={() => setMode('analytics')}
      whileHover={{
        scale: 1.08,
        boxShadow: '0 8px 32px rgba(124, 58, 237, 0.5), 0 0 0 1px rgba(255,255,255,0.15) inset',
      }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: [
          '0 4px 24px rgba(124, 58, 237, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset',
          '0 4px 32px rgba(124, 58, 237, 0.6), 0 0 0 1px rgba(255,255,255,0.15) inset',
          '0 4px 24px rgba(124, 58, 237, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset',
        ],
      }}
      transition={{
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
    >
      <Calendar size={18} strokeWidth={2} />
      <span>日历</span>

      {/* 呼吸光晕 */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(99,102,241,0.3))',
          filter: 'blur(12px)',
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.button>
  )
}

export default CalendarButton

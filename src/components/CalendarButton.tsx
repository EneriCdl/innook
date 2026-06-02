/**
 * CalendarButton - 日历按钮
 */

import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { useAppStore } from '../stores/appStore'

export function CalendarButton() {
  const { setMode } = useAppStore()

  return (
    <motion.button
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm"
      style={{
        background: 'linear-gradient(135deg, #6a0dad 0%, #8a2be2 100%)',
        boxShadow: '0 4px 20px rgba(106, 13, 173, 0.3)',
      }}
      onClick={() => setMode('analytics')}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Calendar size={16} />
      <span>日历</span>
    </motion.button>
  )
}

export default CalendarButton

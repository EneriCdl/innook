/**
 * HonestyModal - 诚实打卡弹窗
 *
 * 修复：接收外部传入的 honestyCheck，不再自己创建
 */

import { motion, AnimatePresence } from 'framer-motion'
import { Check, Coffee, ArrowRight, Heart } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import type { useHonestyCheck } from '../../hooks/useHonestyCheck'

interface HonestyModalProps {
  honestyCheck: ReturnType<typeof useHonestyCheck>
}

export function HonestyModal({ honestyCheck }: HonestyModalProps) {
  const {
    state, content, setContent,
    confirmHonest, confirmDishonest, save, cancel,
  } = honestyCheck

  if (state === 'idle') return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* 背景遮罩 */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={cancel}
        />

        {/* 弹窗 */}
        <GlassPanel
          className="relative p-8 max-w-sm w-full"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* 第一层：询问是否专注 */}
          {state === 'asking' && (
            <div className="flex flex-col items-center gap-6 text-center">
              <motion.div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Check size={28} className="text-violet-400" />
              </motion.div>

              <div>
                <h3 className="text-xl font-light text-white mb-2">时间到！</h3>
                <p className="text-white/50 text-sm">这段时间你是否保持了高度专注？</p>
              </div>

              <div className="flex gap-3 w-full">
                <motion.button
                  className="flex-1 glass-panel py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-white/80 hover:bg-white/10 transition-colors"
                  onClick={confirmHonest}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Check size={16} />
                  是，非常专注
                </motion.button>

                <motion.button
                  className="flex-1 glass-panel py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-white/50 hover:bg-white/10 transition-colors"
                  onClick={confirmDishonest}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Coffee size={16} />
                  摸鱼了...
                </motion.button>
              </div>
            </div>
          )}

          {/* 第二层：记录学习内容 */}
          {state === 'noting' && (
            <div className="flex flex-col items-center gap-6 text-center">
              <div>
                <h3 className="text-xl font-light text-white mb-2">太棒了！</h3>
                <p className="text-white/50 text-sm">请简要记录刚才的学习内容</p>
              </div>

              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="例如：高数第三章、英语阅读..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white/80 text-sm placeholder-white/20 focus:outline-none focus:border-violet-400/50 transition-colors"
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') save() }}
              />

              <motion.button
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-white font-medium"
                onClick={save}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                保存记录
                <ArrowRight size={16} />
              </motion.button>
            </div>
          )}

          {/* 摸鱼提示 */}
          {state === 'discarding' && (
            <div className="flex flex-col items-center gap-6 text-center">
              <motion.div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Heart size={28} className="text-orange-400" />
              </motion.div>

              <div>
                <h3 className="text-xl font-light text-white mb-2">没关系</h3>
                <p className="text-white/50 text-sm">休息是为了走更远的路 🌿</p>
              </div>
            </div>
          )}
        </GlassPanel>
      </motion.div>
    </AnimatePresence>
  )
}

export default HonestyModal

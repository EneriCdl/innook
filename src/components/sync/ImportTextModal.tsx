/**
 * ImportTextModal - 文本导入对话框
 *
 * 用户粘贴从其他设备复制的数据文本
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload } from 'lucide-react'
import { useDataSync } from '../../hooks/useDataSync'
import { GlassPanel } from '../ui/GlassPanel'

interface ImportTextModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ImportTextModal({ isOpen, onClose }: ImportTextModalProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const { importFromText } = useDataSync()

  const handleImport = () => {
    setError('')
    if (!text.trim()) {
      setError('请粘贴数据文本')
      return
    }

    const success = importFromText(text)
    if (success) {
      alert('✅ 数据已恢复！')
      setText('')
      onClose()
    } else {
      setError('无效的数据格式，请检查')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          <GlassPanel
            className="relative p-6 max-w-md w-full"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            {/* 关闭按钮 */}
            <motion.button
              className="absolute top-4 right-4 p-1 rounded-full text-white/40 hover:text-white/70"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
            >
              <X size={16} />
            </motion.button>

            <h3 className="text-lg font-light text-white mb-4">导入数据</h3>

            <p className="text-xs text-white/40 mb-4">
              粘贴从其他设备复制的数据文本
            </p>

            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                setError('')
              }}
              placeholder='粘贴 {"version":1,...} 格式的文本...'
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-3 text-white/80 text-xs placeholder-white/20 resize-none focus:outline-none focus:border-violet-400/50 transition-colors"
            />

            {error && (
              <p className="text-xs text-red-400 mt-2">{error}</p>
            )}

            <motion.button
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium flex items-center justify-center gap-2"
              onClick={handleImport}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Upload size={14} />
              导入
            </motion.button>
          </GlassPanel>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ImportTextModal

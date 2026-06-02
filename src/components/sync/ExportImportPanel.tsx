/**
 * ExportImportPanel - 数据导出导入面板
 *
 * 功能：
 * - 导出文件
 * - 导入文件
 * - 复制数据
 * - 粘贴导入（新增）
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Upload, Copy, Check, Clipboard, X } from 'lucide-react'
import { useDataSync } from '../../hooks/useDataSync'

export function ExportImportPanel() {
  const { exportData, importData, generateShareText, importFromText } = useDataSync()
  const [copied, setCopied] = useState(false)
  const [showPasteModal, setShowPasteModal] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const [error, setError] = useState('')

  // 复制到剪贴板
  const handleCopy = async () => {
    const text = generateShareText()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // 粘贴导入
  const handlePasteImport = () => {
    setError('')
    if (!pasteText.trim()) {
      setError('请粘贴数据')
      return
    }
    const success = importFromText(pasteText)
    if (success) {
      alert('✅ 数据已恢复！')
      setPasteText('')
      setShowPasteModal(false)
    } else {
      setError('数据格式无效，请检查')
    }
  }

  // 从剪贴板粘贴
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setPasteText(text)
    } catch {
      // 需要用户手动粘贴
    }
  }

  return (
    <>
      {/* 按钮组 - 玻璃背景板包裹 */}
      <div className="glass-panel px-3 py-2 flex items-center gap-2.5">
        <motion.button
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-white/60 text-xs hover:bg-white/10 transition-colors"
          onClick={exportData}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="导出备份文件"
        >
          <Download size={14} />
          <span className="hidden sm:inline">导出</span>
        </motion.button>

        <motion.button
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-white/60 text-xs hover:bg-white/10 transition-colors"
          onClick={importData}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="导入备份文件"
        >
          <Upload size={14} />
          <span className="hidden sm:inline">导入</span>
        </motion.button>

        <motion.button
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-colors ${
            copied
              ? 'bg-green-500/20 text-green-400'
              : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
          onClick={handleCopy}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="复制数据文本"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span className="hidden sm:inline">{copied ? '已复制' : '复制'}</span>
        </motion.button>

        <motion.button
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-600/20 text-violet-300 text-xs hover:bg-violet-600/30 transition-colors"
          onClick={() => setShowPasteModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="粘贴导入"
        >
          <Clipboard size={14} />
          <span className="hidden sm:inline">粘贴</span>
        </motion.button>
      </div>

      {/* 粘贴导入弹窗 */}
      <AnimatePresence>
        {showPasteModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowPasteModal(false)}
            />

            <motion.div
              className="glass-panel relative p-6 max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              {/* 关闭按钮 */}
              <button
                className="absolute top-4 right-4 text-white/40 hover:text-white/70"
                onClick={() => setShowPasteModal(false)}
              >
                <X size={16} />
              </button>

              <h3 className="text-lg font-light text-white mb-2">粘贴导入</h3>
              <p className="text-xs text-white/40 mb-4">
                粘贴从其他设备复制的数据文本
              </p>

              <textarea
                value={pasteText}
                onChange={(e) => {
                  setPasteText(e.target.value)
                  setError('')
                }}
                placeholder='粘贴 {"version":1,...} 格式的数据...'
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-3 text-white/80 text-xs placeholder-white/20 resize-none focus:outline-none focus:border-violet-400/50"
              />

              {error && (
                <p className="text-xs text-red-400 mt-2">{error}</p>
              )}

              <div className="flex gap-2 mt-4">
                <motion.button
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/60 text-xs"
                  onClick={handlePasteFromClipboard}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  从剪贴板读取
                </motion.button>
                <motion.button
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-medium"
                  onClick={handlePasteImport}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  导入
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ExportImportPanel

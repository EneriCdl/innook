/**
 * SetupDashboard - 准备模式主页面
 *
 * 优化布局：
 * - 顶部：统一的工具栏（玻璃风格）
 * - 中央：计时器
 * - 底部：场景 + 声音（大玻璃框）
 */

import { motion } from 'framer-motion'
import { Moon, Calendar, Download, Upload, Copy, Check, Clipboard } from 'lucide-react'
import { useState } from 'react'
import { TimerSection } from '../components/TimerSection'
import { SceneSelector } from '../components/setup/SceneSelector'
import { SoundMixer } from '../components/setup/SoundMixer'
import { useAppStore } from '../stores/appStore'
import { useDataSync } from '../hooks/useDataSync'

export function SetupDashboard() {
  const { setMode } = useAppStore()
  const { exportData, importData, generateShareText, importFromText } = useDataSync()
  const [copied, setCopied] = useState(false)
  const [showPaste, setShowPaste] = useState(false)
  const [pasteText, setPasteText] = useState('')

  // 复制到剪贴板
  const handleCopy = async () => {
    const text = generateShareText()
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 降级方案
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // 粘贴导入
  const handlePasteImport = () => {
    if (pasteText.trim()) {
      const success = importFromText(pasteText)
      if (success) {
        alert('✅ 数据已恢复！')
        setPasteText('')
        setShowPaste(false)
      } else {
        alert('数据格式无效')
      }
    }
  }

  return (
    <div className="relative z-10 min-h-screen flex flex-col px-4 md:px-8 py-4">
      {/* 顶部工具栏 */}
      <motion.header
        className="glass-panel px-4 py-3 mb-6 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* 左侧：Logo */}
        <div className="flex items-center gap-2">
          <Moon size={18} className="text-violet-400" />
          <span className="text-sm font-medium text-white/80 hidden sm:inline">Innook</span>
        </div>

        {/* 中间：数据同步按钮组 */}
        <div className="flex items-center gap-1.5">
          <motion.button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-xs transition-colors"
            onClick={exportData}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="导出备份"
          >
            <Download size={14} />
            <span className="hidden md:inline">导出</span>
          </motion.button>

          <motion.button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-xs transition-colors"
            onClick={importData}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="导入备份"
          >
            <Upload size={14} />
            <span className="hidden md:inline">导入</span>
          </motion.button>

          <motion.button
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-colors ${
              copied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 hover:bg-white/10 text-white/60'
            }`}
            onClick={handleCopy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="复制数据"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span className="hidden md:inline">{copied ? '已复制' : '复制'}</span>
          </motion.button>

          <motion.button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 text-xs transition-colors"
            onClick={() => setShowPaste(!showPaste)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="粘贴导入"
          >
            <Clipboard size={14} />
            <span className="hidden md:inline">粘贴</span>
          </motion.button>

          <div className="w-px h-6 bg-white/10 mx-1" />

          <motion.button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-violet-600/30 to-indigo-600/30 hover:from-violet-600/40 hover:to-indigo-600/40 text-violet-200 text-xs transition-colors"
            onClick={() => setMode('analytics')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Calendar size={14} />
            <span className="hidden md:inline">日历</span>
          </motion.button>
        </div>
      </motion.header>

      {/* 粘贴输入框（展开时显示） */}
      {showPaste && (
        <motion.div
          className="glass-panel p-4 mb-4 max-w-xl mx-auto w-full"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder='粘贴 {"version":1,...} 格式的数据...'
            className="w-full h-20 bg-white/5 border border-white/10 rounded-lg p-3 text-white/80 text-xs placeholder-white/20 resize-none focus:outline-none focus:border-violet-400/50"
          />
          <div className="flex justify-end gap-2 mt-2">
            <motion.button
              className="px-4 py-2 rounded-lg bg-white/5 text-white/60 text-xs"
              onClick={() => setShowPaste(false)}
              whileTap={{ scale: 0.95 }}
            >
              取消
            </motion.button>
            <motion.button
              className="px-4 py-2 rounded-lg bg-violet-600 text-white text-xs"
              onClick={handlePasteImport}
              whileTap={{ scale: 0.95 }}
            >
              导入
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* 主内容区域 */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full">
        {/* 标题 */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-extralight text-white/90 mb-2" style={{ fontWeight: 200 }}>
            专注时刻
          </h1>
          <p className="text-sm text-white/40">
            选择场景与氛围，开始你的学习旅程
          </p>
        </motion.div>

        {/* 计时器区域 */}
        <motion.div
          className="w-full max-w-md mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <TimerSection />
        </motion.div>

        {/* 场景 + 声音控制 - 大玻璃框 */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="glass-panel p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 左侧：场景选择 */}
              <div className="space-y-4">
                <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">场景选择</h3>
                <SceneSelector />
              </div>

              {/* 右侧：声音氛围 */}
              <div className="space-y-4">
                <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">声音氛围</h3>
                <SoundMixer />
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default SetupDashboard

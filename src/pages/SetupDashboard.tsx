/**
 * SetupDashboard - 准备模式主页面
 *
 * 严格网格布局：
 * ┌────────────────────────────────────────┐
 * │ [同步面板]                  [日历按钮] │
 * ├────────────────────────────────────────┤
 * │                                        │
 * │            专注时刻（标题）              │
 * │                                        │
 * │              40:00                      │
 * │           [滑块设置]                    │
 * │      [25] [45] [60] [90]               │
 * │          [开始专注]                     │
 * │                                        │
 * ├────────────────────────────────────────┤
 * │   [场景选择]        [声音氛围]         │
 * └────────────────────────────────────────┘
 */

import { motion } from 'framer-motion'
import { Moon } from 'lucide-react'
import { TimerSection } from '../components/TimerSection'
import { CalendarButton } from '../components/CalendarButton'
import { SceneSelector } from '../components/setup/SceneSelector'
import { SoundMixer } from '../components/setup/SoundMixer'
import { ExportImportPanel } from '../components/sync/ExportImportPanel'

export function SetupDashboard() {
  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      {/* 顶部导航栏 */}
      <header className="flex items-center justify-between px-6 py-4">
        <ExportImportPanel />
        <CalendarButton />
      </header>

      {/* 主内容 - 垂直居中 */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        {/* 标题 */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Moon size={24} className="text-violet-400" />
            <h1 className="text-3xl md:text-4xl font-extralight text-white/90">
              专注时刻
            </h1>
          </div>
          <p className="text-sm text-white/40">
            选择场景与氛围，开始你的学习旅程
          </p>
        </motion.div>

        {/* 计时器区域 */}
        <motion.div
          className="w-full max-w-md mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <TimerSection />
        </motion.div>

        {/* 场景 + 声音控制 */}
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="glass-panel p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SceneSelector />
              <SoundMixer />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default SetupDashboard

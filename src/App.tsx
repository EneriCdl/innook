/**
 * Innook - 主应用
 *
 * 双态界面：
 * - SetupDashboard: 准备模式（网格布局）
 * - FocusMode: 专注模式
 * - AnalyticsView: 数据分析
 */

import { AnimatePresence } from 'framer-motion'
import { CinematicBackground } from './components/layout/CinematicBackground'
import { SetupDashboard } from './pages/SetupDashboard'
import { FocusMode } from './components/focus/FocusMode'
import { AnalyticsView } from './components/analytics/AnalyticsView'
import { useAppStore } from './stores/appStore'
import { useAudioManager } from './hooks/useAudioManager'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

function App() {
  const { mode } = useAppStore()

  useAudioManager()
  useKeyboardShortcuts()

  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden">
      <CinematicBackground />

      <AnimatePresence mode="wait">
        {mode === 'setup' && <SetupDashboard key="setup" />}
        {mode === 'focus' && <FocusMode key="focus" />}
        {mode === 'analytics' && <AnalyticsView key="analytics" />}
      </AnimatePresence>
    </div>
  )
}

export default App

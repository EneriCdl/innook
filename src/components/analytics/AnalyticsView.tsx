/**
 * AnalyticsView - 数据分析舱
 *
 * 包含：
 * - 日历热力图
 * - 每日详情
 * - 任务分布扇形图
 */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useAppStore } from '../../stores/appStore'
import { useTimerStore } from '../../stores/timerStore'
import { GlassPanel } from '../ui/GlassPanel'

// 辅助函数
const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate()
const getFirstDay = (y: number, m: number) => new Date(y, m, 1).getDay()
const formatDate = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
const formatDuration = (s: number) => {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

// 扇形图颜色
const CHART_COLORS = ['#8b5cf6', '#6366f1', '#a78bfa', '#c4b5fd', '#818cf8', '#6d28d9']

export function AnalyticsView() {
  const { setMode } = useAppStore()
  const { records, dailyGoalMinutes } = useTimerStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [hoveredDay, setHoveredDay] = useState<string | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // 日历数据
  const calendarData = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDay(year, month)
    const goalSeconds = dailyGoalMinutes * 60
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push({ day: 0, date: '', seconds: 0, progress: 0, sessions: [] })
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatDate(year, month, d)
      const record = records.find((r) => r.date === dateStr)
      const seconds = record?.totalSeconds || 0
      days.push({
        day: d,
        date: dateStr,
        seconds,
        progress: Math.min(seconds / goalSeconds, 1),
        sessions: record?.sessions || [],
      })
    }

    return days
  }, [year, month, records, dailyGoalMinutes])

  // 任务分布数据
  const pieData = useMemo(() => {
    const contentMap = new Map<string, number>()

    records.forEach((record) => {
      record.sessions.forEach((session) => {
        const content = session.content || '未分类'
        contentMap.set(content, (contentMap.get(content) || 0) + session.durationSeconds)
      })
    })

    return Array.from(contentMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [records])

  // 选中日期的数据
  const selectedDayData = useMemo(() => {
    if (!selectedDate) return null
    const day = calendarData.find((d) => d.date === selectedDate)
    return day || null
  }, [selectedDate, calendarData])

  const getColor = (progress: number) => {
    if (progress === 0) return 'bg-white/[0.04]'
    if (progress < 0.5) return 'bg-violet-500/30'
    if (progress < 1) return 'bg-violet-500/60'
    return 'bg-violet-400'
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 背景模糊 */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
        onClick={() => setMode('setup')}
      />

      {/* 内容 */}
      <GlassPanel
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-light text-white">数据分析</h2>
          <motion.button
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setMode('setup')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={20} className="text-white/50" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：日历热力图 */}
          <div>
            {/* 月份导航 */}
            <div className="flex items-center justify-between mb-4">
              <motion.button
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                whileHover={{ scale: 1.1 }}
              >
                <ChevronLeft size={16} className="text-white/40" />
              </motion.button>
              <span className="text-sm font-medium text-white/60">{year}年 {MONTHS[month]}</span>
              <motion.button
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                whileHover={{ scale: 1.1 }}
              >
                <ChevronRight size={16} className="text-white/40" />
              </motion.button>
            </div>

            {/* 星期标题 */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-center text-[10px] text-white/25">{d}</div>
              ))}
            </div>

            {/* 日历网格 */}
            <div className="grid grid-cols-7 gap-1">
              {calendarData.map((item, idx) => (
                <div key={idx} className="relative">
                  {item.day > 0 && (
                    <>
                      <motion.button
                        className={`
                          w-full aspect-square rounded-md ${getColor(item.progress)}
                          ${selectedDate === item.date ? 'ring-2 ring-violet-400/60' : ''}
                          cursor-pointer transition-colors
                        `}
                        onClick={() => setSelectedDate(item.date)}
                        whileHover={{ scale: 1.2 }}
                        onMouseEnter={() => setHoveredDay(item.date)}
                        onMouseLeave={() => setHoveredDay(null)}
                      />

                      {/* Tooltip */}
                      <AnimatePresence>
                        {hoveredDay === item.date && (
                          <motion.div
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                          >
                            <GlassPanel className="px-3 py-2 rounded-xl whitespace-nowrap text-center">
                              <div className="text-[10px] text-white/80">{item.date}</div>
                              <div className="text-[9px] text-white/40 mt-0.5">
                                {item.seconds > 0 ? formatDuration(item.seconds) : '未学习'}
                              </div>
                            </GlassPanel>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* 图例 */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-[10px] text-white/25">少</span>
              {['bg-white/[0.04]', 'bg-violet-500/30', 'bg-violet-500/60', 'bg-violet-400'].map((c, i) => (
                <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
              ))}
              <span className="text-[10px] text-white/25">多</span>
            </div>
          </div>

          {/* 右侧：详情 */}
          <div className="flex flex-col gap-6">
            {/* 每日详情 */}
            <AnimatePresence mode="wait">
              {selectedDayData && selectedDayData.seconds > 0 ? (
                <motion.div
                  key={selectedDate}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h3 className="text-sm font-medium text-white/60 mb-3">
                    <Clock size={14} className="inline mr-2" />
                    {selectedDate} 学习详情
                  </h3>

                  <GlassPanel className="p-4 rounded-2xl">
                    <div className="text-2xl font-light text-white mb-2">
                      {formatDuration(selectedDayData.seconds)}
                    </div>
                    <div className="text-xs text-white/40">总专注时长</div>

                    {/* 任务列表 */}
                    {selectedDayData.sessions.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {selectedDayData.sessions.map((session, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm">
                            <div className="w-2 h-2 rounded-full bg-violet-400" />
                            <span className="text-white/60 flex-1">{session.content}</span>
                            <span className="text-white/30 text-xs">
                              {formatDuration(session.durationSeconds)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </GlassPanel>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="flex items-center justify-center h-32 text-white/20 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  点击日历中的日期查看详情
                </motion.div>
              )}
            </AnimatePresence>

            {/* 任务分布扇形图 */}
            {pieData.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-white/60 mb-3">任务分布</h3>
                <GlassPanel className="p-4 rounded-2xl">
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {pieData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                              stroke="transparent"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload
                              return (
                                <GlassPanel className="px-3 py-2 rounded-xl">
                                  <p className="text-xs text-white/80">{data.name}</p>
                                  <p className="text-xs text-white/40">{formatDuration(data.value)}</p>
                                </GlassPanel>
                              )
                            }
                            return null
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* 图例 */}
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {pieData.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: CHART_COLORS[idx % CHART_COLORS.length] }}
                        />
                        <span className="text-[10px] text-white/40">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              </div>
            )}
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  )
}

export default AnalyticsView

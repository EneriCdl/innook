/**
 * useDataSync - 本地数据导出导入
 *
 * 功能：
 * - 导出数据为 JSON 文件
 * - 导入 JSON 文件恢复数据
 * - 二维码分享（可选）
 */

import { useCallback } from 'react'
import { useTimerStore } from '../stores/timerStore'
import { useAppStore } from '../stores/appStore'
import type { DailyRecord } from '../types'

// ============================================
// 导出数据格式
// ============================================

interface ExportData {
  version: 1
  exportedAt: string
  records: DailyRecord[]
  countdownMinutes: number
  dailyGoalMinutes: number
  sceneIndex: number
}

// ============================================
// Hook 实现
// ============================================

export function useDataSync() {
  const { records, countdownMinutes, dailyGoalMinutes } = useTimerStore()
  const { sceneIndex } = useAppStore()

  // 导出数据为 JSON 文件
  const exportData = useCallback(() => {
    const data: ExportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      records,
      countdownMinutes,
      dailyGoalMinutes,
      sceneIndex,
    }

    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    // 创建下载链接
    const a = document.createElement('a')
    a.href = url
    a.download = `innook-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    console.log('✅ 数据已导出')
  }, [records, countdownMinutes, dailyGoalMinutes, sceneIndex])

  // 导入 JSON 文件
  const importData = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) {
          resolve(false)
          return
        }

        try {
          const text = await file.text()
          const data = JSON.parse(text) as ExportData

          // 验证数据格式
          if (data.version !== 1 || !Array.isArray(data.records)) {
            alert('无效的备份文件')
            resolve(false)
            return
          }

          // 恢复数据
          useTimerStore.setState({
            records: data.records,
            countdownMinutes: data.countdownMinutes || 25,
            dailyGoalMinutes: data.dailyGoalMinutes || 120,
          })
          useAppStore.setState({
            sceneIndex: data.sceneIndex || 0,
          })

          alert('✅ 数据已恢复！')
          resolve(true)
        } catch (err) {
          console.error('导入失败:', err)
          alert('导入失败，请检查文件格式')
          resolve(false)
        }
      }

      input.click()
    })
  }, [])

  // 生成分享文本（可复制粘贴）
  const generateShareText = useCallback(() => {
    const data: ExportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      records,
      countdownMinutes,
      dailyGoalMinutes,
      sceneIndex,
    }
    return JSON.stringify(data)
  }, [records, countdownMinutes, dailyGoalMinutes, sceneIndex])

  // 从文本导入
  const importFromText = useCallback((text: string): boolean => {
    try {
      const data = JSON.parse(text) as ExportData

      if (data.version !== 1 || !Array.isArray(data.records)) {
        return false
      }

      useTimerStore.setState({
        records: data.records,
        countdownMinutes: data.countdownMinutes || 25,
        dailyGoalMinutes: data.dailyGoalMinutes || 120,
      })
      useAppStore.setState({
        sceneIndex: data.sceneIndex || 0,
      })

      return true
    } catch {
      return false
    }
  }, [])

  return {
    exportData,
    importData,
    generateShareText,
    importFromText,
  }
}

export default useDataSync

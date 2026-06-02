/**
 * useHonestyCheck - 诚实打卡状态机
 *
 * 状态流转：
 * idle -> asking -> noting/discarding -> idle
 *
 * 修复：cancel 和所有退出路径都要正确重置状态
 */

import { useState, useCallback, useRef } from 'react'
import { useTimerStore } from '../stores/timerStore'
import { useAppStore } from '../stores/appStore'

type HonestyState = 'idle' | 'asking' | 'noting' | 'discarding'

export function useHonestyCheck() {
  const [state, setState] = useState<HonestyState>('idle')
  const [content, setContent] = useState('')
  const { saveSession, reset, status } = useTimerStore()
  const { setMode } = useAppStore()
  const triggeredRef = useRef(false)

  // 触发诚实打卡（只触发一次）
  const trigger = useCallback(() => {
    if (status === 'completed' && !triggeredRef.current) {
      triggeredRef.current = true
      setState('asking')
    }
  }, [status])

  // 重置触发标志
  const resetTrigger = useCallback(() => {
    triggeredRef.current = false
  }, [])

  // 返回准备模式（统一的退出函数）
  const goToSetup = useCallback(() => {
    setState('idle')
    resetTrigger()
    reset()
    setMode('setup')
  }, [reset, setMode, resetTrigger])

  // 选择"是，专注了"
  const confirmHonest = useCallback(() => {
    setState('noting')
  }, [])

  // 选择"否，摸鱼了"
  const confirmDishonest = useCallback(() => {
    setState('discarding')
    // 延迟关闭
    setTimeout(() => {
      goToSetup()
    }, 2000)
  }, [goToSetup])

  // 保存记录
  const save = useCallback(() => {
    saveSession(content || '未记录')
    setContent('')
    setState('idle')
    resetTrigger()
    setMode('setup')
  }, [content, saveSession, setMode, resetTrigger])

  // 取消（点击背景遮罩）
  const cancel = useCallback(() => {
    goToSetup()
  }, [goToSetup])

  return {
    state,
    content,
    setContent,
    trigger,
    confirmHonest,
    confirmDishonest,
    save,
    cancel,
    goToSetup,
    isActive: state !== 'idle',
  }
}

export default useHonestyCheck

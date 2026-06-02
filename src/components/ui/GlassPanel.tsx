/**
 * GlassPanel - 液态玻璃面板
 */

import { type ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

interface GlassPanelProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  className?: string
}

export function GlassPanel({ children, className = '', ...props }: GlassPanelProps) {
  return (
    <motion.div
      className={`
        backdrop-filter backdrop-blur-[32px] saturate-[180%]
        bg-[rgba(20,20,30,0.45)]
        border border-[rgba(255,255,255,0.12)]
        shadow-[0_8px_32px_rgba(0,0,0,0.25)]
        rounded-[28px]
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default GlassPanel

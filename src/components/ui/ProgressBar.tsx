'use client'

interface ProgressBarProps {
  percent: number
  color: string
  height?: number
  width?: string
}

export default function ProgressBar({ percent, color, height = 8, width = '100%' }: ProgressBarProps) {
  return (
    <div style={{
      width, height, borderRadius: height / 2, background: 'var(--surface-hover)', overflow: 'hidden'
    }}>
      <div style={{
        height: '100%', borderRadius: height / 2, width: `${Math.min(percent, 100)}%`,
        background: `linear-gradient(90deg, ${color}, ${color}CC)`,
        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
      }} />
    </div>
  )
}

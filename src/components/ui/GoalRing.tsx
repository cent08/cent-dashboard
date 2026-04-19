'use client'

interface GoalRingProps {
  percent: number
  size?: number
  strokeWidth?: number
  label: string
  sublabel: string
  gradientId: string
  gradientColors?: [string, string]
}

export default function GoalRing({
  percent, size = 140, strokeWidth = 10, label, sublabel,
  gradientId, gradientColors = ['#6C5CE7', '#00D68F']
}: GoalRingProps) {
  const radius = (size / 2) - strokeWidth
  const circumference = 2 * Math.PI * radius
  const dash = (Math.min(percent, 100) / 100) * circumference

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--surface-hover)" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth} strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
        <defs>
          <linearGradient id={gradientId}>
            <stop offset="0%" stopColor={gradientColors[0]} />
            <stop offset="100%" stopColor={gradientColors[1]} />
          </linearGradient>
        </defs>
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{ fontSize: size > 160 ? 36 : 28, fontWeight: 700, color: 'var(--text)' }}>{label}</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sublabel}</span>
      </div>
    </div>
  )
}

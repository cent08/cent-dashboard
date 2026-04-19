'use client'

import { DollarSign, Target, Clock, Heart } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useData } from '@/lib/DataContext'
import { getMonthlyEarningsChart, getTotalEarnings, getClientTotals, getTotalTrainingHours, getTodaySteps } from '@/lib/data-helpers'
import { fmt, getGreeting } from '@/lib/utils'
import { CAT_COLORS, CLIENT_COLORS } from '@/lib/store'
import StatCard from '@/components/ui/StatCard'
import ProgressBar from '@/components/ui/ProgressBar'

export default function DashboardPage() {
  const { data } = useData()
  const total = getTotalEarnings(data)
  const goalPct = Math.round((total / data.incomeGoal) * 100)
  const hours = getTotalTrainingHours(data)
  const todaySteps = getTodaySteps(data)
  const stepsPct = Math.min(Math.round((todaySteps / data.stepsGoal) * 100), 100)
  const clientTotals = getClientTotals(data)
  const chartData = getMonthlyEarningsChart(data)

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
        {getGreeting()}, Cent
      </h1>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
        Here&apos;s your AI automation career at a glance
      </p>

      {/* Stat Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard
          icon={<DollarSign size={22} style={{ color: 'var(--green)' }} />}
          iconBg="var(--green-bg)" label="YTD Earnings" value={fmt(total)}
        />
        <StatCard
          icon={<Target size={22} style={{ color: 'var(--accent)' }} />}
          iconBg="var(--accent-glow)" label="Income Goal" value={`${goalPct}%`}
          extra={<span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{fmt(data.incomeGoal)}</span>}
        />
        <StatCard
          icon={<Clock size={22} style={{ color: 'var(--blue)' }} />}
          iconBg="var(--blue-bg)" label="Training Hours" value={`${hours}h`}
        />
        <StatCard
          icon={<Heart size={22} style={{ color: 'var(--orange)' }} />}
          iconBg="var(--orange-bg)" label="Today's Steps" value={todaySteps.toLocaleString()}
          extra={<span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{stepsPct}%</span>}
        />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* Monthly Earnings */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Monthly Earnings</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickFormatter={v => `₱${v/1000}k`} />
              <Tooltip
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 10, color: 'var(--text)' }}
                formatter={(value: any) => [`₱${value.toLocaleString()}`, 'Earnings']}
              />
              <Bar dataKey="value" fill="#6C5CE7" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Client Breakdown */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Client Breakdown</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={clientTotals} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} strokeWidth={0}>
                {clientTotals.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 10, color: 'var(--text)' }}
                formatter={(value: any) => [`₱${value.toLocaleString()}`]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginTop: 8 }}>
            {clientTotals.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: c.color }} />
                {c.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Latest AI News */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Latest AI News</div>
          {[
            { title: 'OpenAI Announces GPT-5 with Real-Time Reasoning', source: 'TechCrunch', time: '2h ago' },
            { title: 'Claude 4.5 Sets New Benchmark in Agentic Coding Tasks', source: 'The Verge', time: '4h ago' },
            { title: 'N8N Raises $40M Series B for AI Workflow Automation', source: 'VentureBeat', time: '6h ago' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
              borderBottom: i < 2 ? '1px solid var(--card-border)' : 'none'
            }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--accent)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4 }}>{item.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{item.source} · {item.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Training Progress */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Training Progress</div>
          {data.courses.slice(0, 3).map(c => {
            const pct = Math.round(c.completedHours / c.totalHours * 100)
            const color = CAT_COLORS[c.category] || '#FDAB3D'
            return (
              <div key={c.id} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{c.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.completedHours}/{c.totalHours}h</span>
                </div>
                <ProgressBar percent={pct} color={color} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

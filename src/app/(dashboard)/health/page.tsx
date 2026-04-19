'use client'

import { useState } from 'react'
import { Plus, Settings, Trash2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { useData } from '@/lib/DataContext'
import { getTodaySteps, getWeeklySteps, getWeeklyAvg, getStreak } from '@/lib/data-helpers'
import GoalRing from '@/components/ui/GoalRing'
import ProgressBar from '@/components/ui/ProgressBar'
import Modal from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { formatDateLong } from '@/lib/utils'

export default function HealthPage() {
  const { data, logSteps, deleteStepsEntry, setStepsGoal } = useData()
  const { showToast } = useToast()

  const [logModal, setLogModal] = useState(false)
  const [goalModal, setGoalModal] = useState(false)

  const [sDate, setSDate] = useState(new Date().toISOString().split('T')[0])
  const [sSteps, setSSteps] = useState('')
  const [sNotes, setSNotes] = useState('')
  const [goalInput, setGoalInput] = useState(data.stepsGoal.toString())

  const todaySteps = getTodaySteps(data)
  const stepsPct = Math.min(Math.round((todaySteps / data.stepsGoal) * 100), 100)
  const streak = getStreak(data)
  const avg = getWeeklyAvg(data)

  const weekData = [...data.dailySteps]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7)
    .map(s => ({
      name: new Date(s.date).toLocaleDateString('en-US', { weekday: 'short' }),
      steps: s.steps
    }))

  const sortedSteps = [...data.dailySteps].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  function handleLogSteps() {
    if (!sDate || !sSteps || parseInt(sSteps) <= 0) { alert('Please enter a valid date and step count.'); return }
    const steps = parseInt(sSteps)
    logSteps(sDate, steps, sNotes)
    setLogModal(false); setSSteps(''); setSNotes('')
    const metGoal = steps >= data.stepsGoal
    showToast(metGoal ? `🎉 ${steps.toLocaleString()} steps — Goal reached!` : `✓ ${steps.toLocaleString()} steps logged!`)
  }

  function handleSaveGoal() {
    const goal = parseInt(goalInput)
    if (!goal || goal <= 0) { alert('Please enter a valid step goal.'); return }
    setStepsGoal(goal)
    setGoalModal(false)
    showToast(`✓ Daily steps goal set to ${goal.toLocaleString()}!`)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Health — Steps Tracker</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Track your daily steps and stay active</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => { setGoalInput(data.stepsGoal.toString()); setGoalModal(true) }} style={btnOutline}>
            <Settings size={14} /> Set Goal
          </button>
          <button onClick={() => setLogModal(true)} style={btnGreen}>
            <Plus size={14} /> Log Steps
          </button>
        </div>
      </div>

      {/* Ring + Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 24 }}>
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 32 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 20 }}>Today&apos;s Progress</div>
          <GoalRing
            percent={stepsPct}
            size={180}
            strokeWidth={12}
            label={todaySteps.toLocaleString()}
            sublabel={`of ${data.stepsGoal.toLocaleString()} steps`}
            gradientId="stepsGrad"
            gradientColors={['#00D68F', '#4DA8FF']}
          />
          <div style={{ display: 'flex', gap: 24, marginTop: 24, justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--green)' }}>{streak}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Day Streak</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--blue)' }}>{avg.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Weekly Avg</div>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>This Week</div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="stepsAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D68F" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00D68F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickFormatter={v => `${v/1000}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: any) => [`${value.toLocaleString()} steps`]} />
              <Area type="monotone" dataKey="steps" stroke="#00D68F" strokeWidth={2.5} fill="url(#stepsAreaGrad)" dot={{ fill: '#00D68F', strokeWidth: 0, r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Steps Table */}
      <div style={cardStyle}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Daily Step Log</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Date', 'Steps', 'Goal', 'Progress', 'Notes', ''].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedSteps.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>No steps logged yet.</td></tr>
            ) : sortedSteps.map((s, i) => {
              const pct = Math.min(Math.round((s.steps / data.stepsGoal) * 100), 100)
              const metGoal = s.steps >= data.stepsGoal
              return (
                <tr key={i}>
                  <td style={tdStyle}><span style={{ fontWeight: 600, color: 'var(--text)' }}>{formatDateLong(s.date)}</span></td>
                  <td style={tdStyle}><span style={{ fontWeight: 700, color: metGoal ? 'var(--green)' : 'var(--text)' }}>{s.steps.toLocaleString()}</span></td>
                  <td style={{ ...tdStyle, fontSize: 13, color: 'var(--text-secondary)' }}>{data.stepsGoal.toLocaleString()}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 100 }}><ProgressBar percent={pct} color={metGoal ? '#00D68F' : '#FDAB3D'} height={6} /></div>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pct}%</span>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, fontSize: 13, color: 'var(--text-secondary)' }}>{s.notes || '-'}</td>
                  <td style={tdStyle}>
                    <button onClick={() => { deleteStepsEntry(s.date); showToast('Steps entry deleted') }} style={btnDelete} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Log Steps Modal */}
      <Modal isOpen={logModal} onClose={() => setLogModal(false)} title="Log Daily Steps" subtitle="Record your steps for a specific day">
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Date</label>
          <input type="date" value={sDate} onChange={e => setSDate(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Number of Steps</label>
          <input type="number" value={sSteps} onChange={e => setSSteps(e.target.value)} placeholder="e.g. 8500" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Notes (optional)</label>
          <input type="text" value={sNotes} onChange={e => setSNotes(e.target.value)} placeholder="e.g. Morning jog + evening walk" style={inputStyle} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <button onClick={() => setLogModal(false)} style={btnOutline}>Cancel</button>
          <button onClick={handleLogSteps} style={btnGreen}>Log Steps</button>
        </div>
      </Modal>

      {/* Set Goal Modal */}
      <Modal isOpen={goalModal} onClose={() => setGoalModal(false)} title="Set Daily Steps Goal" subtitle="Set your target number of steps per day">
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Daily Steps Target</label>
          <input type="number" value={goalInput} onChange={e => setGoalInput(e.target.value)} placeholder="e.g. 10000" style={inputStyle} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          {[5000, 8000, 10000, 12000, 15000].map(v => (
            <button key={v} onClick={() => setGoalInput(v.toString())} style={{ ...btnOutline, padding: '8px 16px', fontSize: 12 }}>
              {v.toLocaleString()}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <button onClick={() => setGoalModal(false)} style={btnOutline}>Cancel</button>
          <button onClick={handleSaveGoal} style={btnGreen}>Save Goal</button>
        </div>
      </Modal>
    </div>
  )
}

const cardStyle: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24 }
const tooltipStyle: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 10, color: 'var(--text)' }
const thStyle: React.CSSProperties = { textAlign: 'left', padding: '10px 16px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--card-border)', textTransform: 'uppercase', letterSpacing: 0.5 }
const tdStyle: React.CSSProperties = { padding: '14px 16px', borderBottom: '1px solid var(--card-border)', fontSize: 14 }
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--card-border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }
const btnOutline: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: '1px solid var(--card-border)', background: 'var(--surface)', color: 'var(--text)', fontFamily: 'inherit' }
const btnGreen: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', background: 'linear-gradient(135deg, #00D68F, #4DA8FF)', color: '#fff', fontFamily: 'inherit' }
const btnDelete: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }

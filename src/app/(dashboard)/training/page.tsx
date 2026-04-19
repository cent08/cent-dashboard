'use client'

import { useState } from 'react'
import { Plus, Clock, Trash2 } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useData } from '@/lib/DataContext'
import { getCategoryHours, getTotalTrainingHours } from '@/lib/data-helpers'
import { CAT_COLORS } from '@/lib/store'
import ProgressBar from '@/components/ui/ProgressBar'
import Modal from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { formatDateLong } from '@/lib/utils'

const CAT_BGS: Record<string, string> = { N8N: 'var(--pink-bg)', GHL: 'var(--blue-bg)', Claude: 'var(--accent-glow)', Other: 'var(--orange-bg)' }

export default function TrainingPage() {
  const { data, addCourse, logHours, deleteTrainingLog } = useData()
  const { showToast } = useToast()

  const [courseModal, setCourseModal] = useState(false)
  const [logModal, setLogModal] = useState(false)

  // Course form
  const [cName, setCName] = useState('')
  const [cCategory, setCCategory] = useState('N8N')
  const [cHours, setCHours] = useState('')

  // Log form
  const [lCourseId, setLCourseId] = useState('')
  const [lHours, setLHours] = useState('')
  const [lDate, setLDate] = useState(new Date().toISOString().split('T')[0])
  const [lNotes, setLNotes] = useState('')

  const catHours = getCategoryHours(data)
  const catMap: Record<string, number> = {}
  catHours.forEach(c => { catMap[c.name] = c.value })

  const pieData = catHours.map(c => ({ ...c, color: CAT_COLORS[c.name] || '#FDAB3D' }))

  function handleSaveCourse() {
    if (!cName.trim() || !cHours) { alert('Please fill in course name and total hours.'); return }
    addCourse(cName.trim(), cCategory, parseFloat(cHours))
    setCourseModal(false); setCName(''); setCHours('')
    showToast(`✓ Course "${cName}" added!`)
  }

  function handleLogHours() {
    if (!lCourseId || !lHours || !lDate) { alert('Please fill in course, hours, and date.'); return }
    const course = data.courses.find(c => c.id === parseInt(lCourseId))
    logHours(parseInt(lCourseId), parseFloat(lHours), lDate, lNotes)
    setLogModal(false); setLHours(''); setLNotes('')
    showToast(`✓ ${lHours}h logged for ${course?.name || 'course'}!`)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Training Tracker</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Track your learning progress across N8N, GHL, and Claude</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => { setLCourseId(data.courses[0]?.id.toString() || ''); setLogModal(true) }} style={btnOutline}>
            <Clock size={14} /> Log Hours
          </button>
          <button onClick={() => setCourseModal(true)} style={btnAccent}>
            <Plus size={14} /> Add Course
          </button>
        </div>
      </div>

      {/* Category Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {['N8N', 'GHL', 'Claude'].map(cat => (
          <div key={cat} style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: CAT_BGS[cat], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={22} height={22} style={{ color: CAT_COLORS[cat] }} stroke="currentColor" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{cat} Total</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>{catMap[cat] || 0}h</div>
            </div>
          </div>
        ))}
      </div>

      {/* Courses + Pie Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Active Courses</div>
          {data.courses.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>No courses yet. Click &quot;Add Course&quot; to get started.</div>
          ) : data.courses.map(c => {
            const pct = Math.round(c.completedHours / c.totalHours * 100)
            const color = CAT_COLORS[c.category] || '#FDAB3D'
            const bg = CAT_BGS[c.category] || 'var(--orange-bg)'
            return (
              <div key={c.id} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--card-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{c.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: bg, color }}>{c.category}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                  <div style={{ flex: 1 }}><ProgressBar percent={pct} color={color} /></div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', minWidth: 100, textAlign: 'right' }}>{c.completedHours}/{c.totalHours}h ({pct}%)</span>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 20, alignSelf: 'flex-start' }}>Time Distribution</div>
          {pieData.length > 0 && (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={65} strokeWidth={0}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(value: any) => [`${value}h`]} />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginTop: 8 }}>
            {pieData.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: c.color }} /> {c.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Training Log Table */}
      {data.trainingLogs.length > 0 && (
        <div style={{ ...cardStyle, marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Training Log</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Date', 'Course', 'Hours', 'Notes', ''].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...data.trainingLogs]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map(log => {
                  const course = data.courses.find(c => c.id === log.courseId)
                  const color = CAT_COLORS[course?.category || ''] || '#FDAB3D'
                  return (
                    <tr key={log.id}>
                      <td style={tdStyle}><span style={{ fontWeight: 600, color: 'var(--text)' }}>{formatDateLong(log.date)}</span></td>
                      <td style={tdStyle}>
                        <span style={{ fontWeight: 500, color: 'var(--text)' }}>{course?.name || 'Unknown'}</span>
                        {course && <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: `${color}22`, color }}>{course.category}</span>}
                      </td>
                      <td style={tdStyle}><span style={{ fontWeight: 700, color: 'var(--accent)' }}>{log.hours}h</span></td>
                      <td style={{ ...tdStyle, fontSize: 13, color: 'var(--text-secondary)' }}>{log.notes || '-'}</td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => { deleteTrainingLog(log.id, log.courseId, log.hours); showToast('Training log deleted') }}
                          style={btnDelete} title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Course Modal */}
      <Modal isOpen={courseModal} onClose={() => setCourseModal(false)} title="Add Training Course" subtitle="Add a new course to track your learning">
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Course Name</label>
          <input type="text" value={cName} onChange={e => setCName(e.target.value)} placeholder="e.g. N8N Advanced Workflows" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Category</label>
          <select value={cCategory} onChange={e => setCCategory(e.target.value)} style={inputStyle}>
            <option>N8N</option><option>GHL</option><option>Claude</option><option>Other</option>
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Total Hours to Complete</label>
          <input type="number" value={cHours} onChange={e => setCHours(e.target.value)} placeholder="e.g. 30" style={inputStyle} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <button onClick={() => setCourseModal(false)} style={btnOutline}>Cancel</button>
          <button onClick={handleSaveCourse} style={btnAccent}>Add Course</button>
        </div>
      </Modal>

      {/* Log Hours Modal */}
      <Modal isOpen={logModal} onClose={() => setLogModal(false)} title="Log Training Hours" subtitle="Record hours spent on a course today">
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Course</label>
          <select value={lCourseId} onChange={e => setLCourseId(e.target.value)} style={inputStyle}>
            {data.courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.category})</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Hours Spent</label>
          <input type="number" value={lHours} onChange={e => setLHours(e.target.value)} placeholder="e.g. 2" step="0.5" min="0.5" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Date</label>
          <input type="date" value={lDate} onChange={e => setLDate(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Notes (optional)</label>
          <input type="text" value={lNotes} onChange={e => setLNotes(e.target.value)} placeholder="e.g. Completed module 3" style={inputStyle} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <button onClick={() => setLogModal(false)} style={btnOutline}>Cancel</button>
          <button onClick={handleLogHours} style={btnAccent}>Log Hours</button>
        </div>
      </Modal>
    </div>
  )
}

const cardStyle: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24 }
const tooltipStyle: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 10, color: 'var(--text)' }
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--card-border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }
const btnOutline: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: '1px solid var(--card-border)', background: 'var(--surface)', color: 'var(--text)', fontFamily: 'inherit' }
const btnAccent: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', background: 'linear-gradient(135deg, #6C5CE7, #7C6CF7)', color: '#fff', fontFamily: 'inherit' }
const thStyle: React.CSSProperties = { textAlign: 'left', padding: '10px 16px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--card-border)', textTransform: 'uppercase', letterSpacing: 0.5 }
const tdStyle: React.CSSProperties = { padding: '14px 16px', borderBottom: '1px solid var(--card-border)', fontSize: 14 }
const btnDelete: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '6px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }

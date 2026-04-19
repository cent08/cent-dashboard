'use client'

import { useState } from 'react'
import { DollarSign, Clock, Users, TrendingUp, Plus, Upload, UserPlus, Settings } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useData } from '@/lib/DataContext'
import { getMonthlyEarnings, getTotalEarnings, getClientTotals } from '@/lib/data-helpers'
import { fmt, formatDate } from '@/lib/utils'
import { CLIENT_COLORS } from '@/lib/store'
import StatCard from '@/components/ui/StatCard'
import Modal from '@/components/ui/Modal'
import GoalRing from '@/components/ui/GoalRing'
import { useToast } from '@/components/ui/Toast'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function EarningsPage() {
  const { data, addPayment, addClient, toggleClientStatus, setIncomeGoal } = useData()
  const { showToast } = useToast()

  const [paymentModal, setPaymentModal] = useState(false)
  const [clientModal, setClientModal] = useState(false)
  const [manageModal, setManageModal] = useState(false)
  const [goalModal, setGoalModal] = useState(false)
  const [screenshotModal, setScreenshotModal] = useState<{ title: string; meta: string; url: string } | null>(null)

  // Payment form state
  const [pClientId, setPClientId] = useState('')
  const [pAmount, setPAmount] = useState('')
  const [pDate, setPDate] = useState(new Date().toISOString().split('T')[0])
  const [pNotes, setPNotes] = useState('')
  const [pScreenshot, setPScreenshot] = useState<{ name: string; dataUrl: string } | null>(null)

  // Client form state
  const [cName, setCName] = useState('')
  const [cPlatform, setCPlatform] = useState('Upwork')

  // Goal form state
  const [goalAmount, setGoalAmount] = useState(data.incomeGoal.toString())

  const total = getTotalEarnings(data)
  const goalPct = Math.round((total / data.incomeGoal) * 100)
  const activeClients = new Set(data.payments.map(p => p.clientId)).size
  const monthsWithData = new Set(data.payments.map(p => new Date(p.date).getMonth())).size
  const avg = monthsWithData > 0 ? Math.round(total / monthsWithData) : 0
  const monthly = getMonthlyEarnings(data)
  const clientTotals = getClientTotals(data)
  const chartData = MONTHS.map((m, i) => ({ name: m, value: monthly[i] }))

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPScreenshot({ name: file.name, dataUrl: ev.target?.result as string })
    }
    reader.readAsDataURL(file)
  }

  function handleSavePayment() {
    if (!pClientId || !pAmount || !pDate) { alert('Please fill in client, amount, and date.'); return }
    if (!pScreenshot) { alert('Please upload a payment screenshot. This is required.'); return }
    addPayment(parseInt(pClientId), parseFloat(pAmount), pDate, pNotes, pScreenshot)
    setPaymentModal(false)
    setPAmount(''); setPNotes(''); setPScreenshot(null)
    showToast(`✓ Payment of ${fmt(parseFloat(pAmount))} recorded!`)
  }

  function handleSaveClient() {
    if (!cName.trim()) { alert('Please enter a client name.'); return }
    addClient(cName.trim(), cPlatform)
    setClientModal(false)
    setCName('')
    showToast(`✓ Client "${cName}" added!`)
  }

  function handleSaveGoal() {
    const amount = parseFloat(goalAmount)
    if (!amount || amount <= 0) { alert('Please enter a valid goal amount.'); return }
    setIncomeGoal(amount)
    setGoalModal(false)
    showToast(`✓ Income goal set to ${fmt(amount)}!`)
  }

  const activeClientsForSelect = data.clients.filter(c => c.status === 'active')
  const sortedPayments = [...data.payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Earnings Tracker</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Track your AI automation income across all clients</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => { setGoalAmount(data.incomeGoal.toString()); setGoalModal(true) }} style={btnOutline}>
            <Settings size={14} /> Set Goal
          </button>
          <button onClick={() => setManageModal(true)} style={btnOutline}>
            <Users size={14} /> Clients
          </button>
          <button onClick={() => setClientModal(true)} style={btnOutline}>
            <UserPlus size={14} /> Add Client
          </button>
          <button onClick={() => { setPClientId(activeClientsForSelect[0]?.id.toString() || ''); setPaymentModal(true) }} style={btnAccent}>
            <Upload size={14} /> Add Payment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard icon={<DollarSign size={22} style={{ color: 'var(--green)' }} />} iconBg="var(--green-bg)" label="YTD Earnings" value={fmt(total)} />
        <StatCard icon={<Clock size={22} style={{ color: 'var(--accent)' }} />} iconBg="var(--accent-glow)" label="2026 Goal" value={fmt(data.incomeGoal)} extra={<span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{goalPct}%</span>} />
        <StatCard icon={<Users size={22} style={{ color: 'var(--blue)' }} />} iconBg="var(--blue-bg)" label="Active Clients" value={activeClients.toString()} />
        <StatCard icon={<TrendingUp size={22} style={{ color: 'var(--orange)' }} />} iconBg="var(--orange-bg)" label="Avg Monthly" value={fmt(avg)} />
      </div>

      {/* Charts + Goal Ring */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={cardStyle}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Monthly Revenue</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickFormatter={v => `₱${v/1000}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: any) => [`₱${value.toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="value" fill="#6C5CE7" radius={[6, 6, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ ...cardStyle, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 20, alignSelf: 'flex-start' }}>Goal Progress</div>
            <GoalRing percent={goalPct} label={`${goalPct}%`} sublabel={`of ${fmt(data.incomeGoal)}`} gradientId="goalGrad" />
          </div>
          <div style={{ ...cardStyle, flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>By Client</div>
            {clientTotals.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: c.color }} />
                <span style={{ flex: 1, fontSize: 13, color: 'var(--text-secondary)' }}>{c.name}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{fmt(c.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div style={cardStyle}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Recent Payments</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Client', 'Amount', 'Date', 'Screenshot', 'Notes'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--card-border)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedPayments.map(p => {
              const client = data.clients.find(c => c.id === p.clientId)
              return (
                <tr key={p.id}>
                  <td style={tdStyle}><span style={{ fontWeight: 600, color: 'var(--text)' }}>{client?.name || 'Unknown'}</span></td>
                  <td style={tdStyle}><span style={{ fontWeight: 700, color: 'var(--green)' }}>{fmt(p.amount)}</span></td>
                  <td style={{ ...tdStyle, fontSize: 13, color: 'var(--text-secondary)' }}>{formatDate(p.date)}</td>
                  <td style={tdStyle}>
                    {p.screenshot?.dataUrl ? (
                      <span
                        onClick={() => setScreenshotModal({
                          title: `${client?.name || 'Unknown'} — ${fmt(p.amount)}`,
                          meta: `${formatDate(p.date)} · ${p.screenshot!.name}`,
                          url: p.screenshot!.dataUrl
                        })}
                        style={{ background: 'var(--green-bg)', color: 'var(--green)', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, cursor: 'pointer' }}
                      >📷 View</span>
                    ) : (
                      <span style={{ background: 'var(--surface-hover)', color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>None</span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, fontSize: 13, color: 'var(--text-secondary)' }}>{p.notes || '-'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Add Payment Modal */}
      <Modal isOpen={paymentModal} onClose={() => setPaymentModal(false)} title="Add Payment" subtitle="Record a new payment from a client">
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Client</label>
          <select value={pClientId} onChange={e => setPClientId(e.target.value)} style={inputStyle}>
            {activeClientsForSelect.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Amount (₱)</label>
          <input type="number" value={pAmount} onChange={e => setPAmount(e.target.value)} placeholder="e.g. 50000" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Payment Date</label>
          <input type="date" value={pDate} onChange={e => setPDate(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Upload Screenshot <span style={{ color: 'var(--red)' }}>*</span></label>
          <div
            onClick={() => document.getElementById('fileInput')?.click()}
            style={{
              border: `2px dashed ${pScreenshot ? 'var(--green)' : 'var(--card-border)'}`,
              borderStyle: pScreenshot ? 'solid' : 'dashed',
              borderRadius: 12, padding: 32, textAlign: 'center', cursor: 'pointer',
              color: pScreenshot ? 'var(--green)' : 'var(--text-muted)', fontSize: 14,
            }}
          >
            <input type="file" id="fileInput" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
            <div>{pScreenshot ? `✓ ${pScreenshot.name}` : '📷 Click to upload payment screenshot'}</div>
            {!pScreenshot && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>PNG, JPG up to 5MB — Required</div>}
          </div>
          {pScreenshot && (
            <div style={{ marginTop: 12, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--card-border)' }}>
              <img src={pScreenshot.dataUrl} alt="Preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block' }} />
            </div>
          )}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Notes (optional)</label>
          <input type="text" value={pNotes} onChange={e => setPNotes(e.target.value)} placeholder="e.g. April retainer payment" style={inputStyle} />
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <button onClick={() => setPaymentModal(false)} style={btnOutline}>Cancel</button>
          <button onClick={handleSavePayment} style={btnAccent}>Save Payment</button>
        </div>
      </Modal>

      {/* Add Client Modal */}
      <Modal isOpen={clientModal} onClose={() => setClientModal(false)} title="Add Client" subtitle="Add a new client to track earnings">
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Client Name</label>
          <input type="text" value={cName} onChange={e => setCName(e.target.value)} placeholder="e.g. Agency X" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Platform</label>
          <select value={cPlatform} onChange={e => setCPlatform(e.target.value)} style={inputStyle}>
            <option>Upwork</option>
            <option>OnlineJobs.ph</option>
            <option>Direct Client</option>
            <option>Freelance</option>
            <option>Other</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <button onClick={() => setClientModal(false)} style={btnOutline}>Cancel</button>
          <button onClick={handleSaveClient} style={btnAccent}>Add Client</button>
        </div>
      </Modal>

      {/* Manage Clients Modal */}
      <Modal isOpen={manageModal} onClose={() => setManageModal(false)} title="Manage Clients" subtitle="View, archive, or reactivate clients" width={560}>
        {data.clients.map(c => {
          const totalPaid = data.payments.filter(p => p.clientId === c.id).reduce((s, p) => s + p.amount, 0)
          const paymentCount = data.payments.filter(p => p.clientId === c.id).length
          const isActive = c.status === 'active'
          return (
            <div key={c.id} style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: 16,
              borderBottom: '1px solid var(--card-border)', opacity: isActive ? 1 : 0.6
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {c.name}
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                    background: isActive ? 'var(--green-bg)' : 'var(--red-bg)',
                    color: isActive ? 'var(--green)' : 'var(--red)'
                  }}>{isActive ? 'Active' : 'Terminated'}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  {c.platform} · {paymentCount} payments · Total: {fmt(totalPaid)}
                </div>
              </div>
              <button onClick={() => { toggleClientStatus(c.id); showToast(isActive ? `✓ ${c.name} marked as terminated` : `✓ ${c.name} reactivated!`) }}
                style={isActive ? { ...btnSmall, background: 'var(--red-bg)', color: 'var(--red)', border: 'none' } : { ...btnSmall, color: 'var(--green)', borderColor: 'var(--green)' }}>
                {isActive ? 'Terminate' : 'Reactivate'}
              </button>
            </div>
          )
        })}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <button onClick={() => setManageModal(false)} style={btnOutline}>Close</button>
        </div>
      </Modal>

      {/* Set Goal Modal */}
      <Modal isOpen={goalModal} onClose={() => setGoalModal(false)} title="Set Yearly Income Goal" subtitle="Set your target earnings for 2026 in Philippine Peso">
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Target Annual Income (₱)</label>
          <input type="number" value={goalAmount} onChange={e => setGoalAmount(e.target.value)} placeholder="e.g. 2500000" style={inputStyle} />
        </div>
        <div style={{ background: 'var(--surface)', borderRadius: 12, padding: 16, marginTop: 8 }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>That&apos;s approximately:</div>
          <div style={{ display: 'flex', gap: 24 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{fmt(Math.round(parseFloat(goalAmount || '0') / 12))}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>per month</div>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{fmt(Math.round(parseFloat(goalAmount || '0') / 52))}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>per week</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <button onClick={() => setGoalModal(false)} style={btnOutline}>Cancel</button>
          <button onClick={handleSaveGoal} style={btnAccent}>Save Goal</button>
        </div>
      </Modal>

      {/* View Screenshot Modal */}
      <Modal isOpen={!!screenshotModal} onClose={() => setScreenshotModal(null)} title={screenshotModal?.title || ''} subtitle={screenshotModal?.meta} width={600}>
        {screenshotModal && (
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--card-border)' }}>
            <img src={screenshotModal.url} alt="Payment screenshot" style={{ width: '100%', display: 'block' }} />
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <button onClick={() => setScreenshotModal(null)} style={btnOutline}>Close</button>
        </div>
      </Modal>
    </div>
  )
}

// Shared styles
const cardStyle: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24 }
const tooltipStyle: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 10, color: 'var(--text)' }
const tdStyle: React.CSSProperties = { padding: '14px 16px', borderBottom: '1px solid var(--card-border)', fontSize: 14 }
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }
const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--card-border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14, fontFamily: 'inherit', outline: 'none' }
const btnOutline: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: '1px solid var(--card-border)', background: 'var(--surface)', color: 'var(--text)', fontFamily: 'inherit' }
const btnAccent: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', background: 'linear-gradient(135deg, #6C5CE7, #7C6CF7)', color: '#fff', fontFamily: 'inherit' }
const btnSmall: React.CSSProperties = { padding: '8px 16px', fontSize: 11, borderRadius: 8, fontWeight: 600, cursor: 'pointer', border: '1px solid var(--card-border)', background: 'var(--surface)', color: 'var(--text)', fontFamily: 'inherit' }

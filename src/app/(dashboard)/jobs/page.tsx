'use client'

import { useState } from 'react'
import { Briefcase, Star } from 'lucide-react'

const jobListings = [
  { id: 1, title: 'AI Automation Specialist (N8N)', company: 'Tech Solutions PH', salary: '₱60,000 - ₱80,000', posted: '2h ago', keyword: 'N8N', isNew: true },
  { id: 2, title: 'GHL Funnel Builder / Automation Expert', company: 'Digital Marketing Co.', salary: '₱45,000 - ₱65,000', posted: '5h ago', keyword: 'GHL', isNew: true },
  { id: 3, title: 'Claude AI Integration Developer', company: 'AI First Inc.', salary: '₱70,000 - ₱100,000', posted: '1d ago', keyword: 'Claude', isNew: false },
  { id: 4, title: 'N8N Workflow Automation VA', company: 'Growth Agency', salary: '₱35,000 - ₱50,000', posted: '1d ago', keyword: 'N8N', isNew: false },
  { id: 5, title: 'GoHighLevel Expert - Full Setup', company: 'US Startup Remote', salary: '₱44,800 - ₱67,200/mo', posted: '2d ago', keyword: 'GHL', isNew: false },
]

const KEYWORD_COLORS: Record<string, { bg: string; color: string }> = {
  N8N: { bg: 'var(--pink-bg)', color: 'var(--pink)' },
  GHL: { bg: 'var(--blue-bg)', color: 'var(--blue)' },
  Claude: { bg: 'var(--accent-glow)', color: 'var(--accent)' },
}

const tabs = ['All', 'N8N', 'GHL', 'Claude']

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState('All')

  const filteredJobs = activeTab === 'All' ? jobListings : jobListings.filter(j => j.keyword === activeTab)

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Job Openings</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Latest jobs from onlinejobs.ph matching your skills</p>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last scraped: Today, 7:00 AM</div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            border: activeTab === tab ? 'none' : '1px solid var(--card-border)',
            background: activeTab === tab ? 'var(--accent)' : 'transparent',
            color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
            fontFamily: 'inherit'
          }}>{tab}</button>
        ))}
      </div>

      {/* Job Cards */}
      {filteredJobs.map(job => {
        const kc = KEYWORD_COLORS[job.keyword] || KEYWORD_COLORS.Claude
        return (
          <div key={job.id} style={{
            background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 14,
            padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12,
            transition: 'border-color 0.2s'
          }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: kc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Briefcase size={19} style={{ color: kc.color }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                {job.title}
                {job.isNew && <span style={{ background: 'var(--green)', color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>NEW</span>}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{job.company}</div>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--green)', textAlign: 'right' }}>{job.salary}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>{job.posted}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginLeft: 16 }}>
              <button style={{ ...btnOutline, padding: '8px 16px', fontSize: 12 }}>
                <Star size={12} /> Save
              </button>
              <button style={{ ...btnAccent, padding: '8px 16px', fontSize: 12 }}>
                Apply
              </button>
            </div>
          </div>
        )
      })}

      {/* Backend notice */}
      <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: 13 }}>
        🔍 Jobs shown above are placeholder data. Once the backend is connected, onlinejobs.ph will be scraped daily for N8N, GHL, and Claude keywords via Vercel Cron Jobs.
      </div>
    </div>
  )
}

const btnOutline: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: '1px solid var(--card-border)', background: 'var(--surface)', color: 'var(--text)', fontFamily: 'inherit' }
const btnAccent: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', background: 'linear-gradient(135deg, #6C5CE7, #7C6CF7)', color: '#fff', fontFamily: 'inherit' }

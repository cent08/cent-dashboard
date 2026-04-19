'use client'

import { Search, Filter } from 'lucide-react'

const newsItems = [
  { title: 'OpenAI Announces GPT-5 with Real-Time Reasoning', summary: 'The latest model features real-time reasoning capabilities, allowing users to interact with AI while it processes complex multi-step problems...', source: 'TechCrunch', time: '2h ago', category: 'LLM' },
  { title: 'Claude 4.5 Sets New Benchmark in Agentic Coding Tasks', summary: 'Anthropic\'s latest model excels at multi-file code generation and debugging. Independent evaluations show it outperforms competitors in real-world scenarios...', source: 'The Verge', time: '4h ago', category: 'Anthropic' },
  { title: 'N8N Raises $40M Series B for AI Workflow Automation', summary: 'The open-source automation platform secures major funding to expand AI-native workflow capabilities with native LLM nodes and agent orchestration...', source: 'VentureBeat', time: '6h ago', category: 'Automation' },
  { title: 'Google DeepMind\'s New Model Achieves PhD-Level Science', summary: 'Demonstrating breakthrough reasoning in chemistry, physics, and biology tasks, the model can now solve graduate-level research problems...', source: 'MIT Tech Review', time: '8h ago', category: 'Research' },
]

const youtubeItems = [
  { channel: 'Liam Ottley', title: 'How I Built a ₱2.8M/mo AI Agency in 6 Months', views: '45K views', date: 'Apr 18', duration: '24:31', summary: 'Liam breaks down his exact process for scaling an AI automation agency, covering client acquisition, pricing, and tools...' },
  { channel: 'Nate Herk', title: 'The N8N Workflow That Replaced My VA', views: '32K views', date: 'Apr 17', duration: '18:42', summary: 'Nate walks through his full automation workflow handling lead management, email follow-ups, and CRM updates using N8N + Claude...' },
  { channel: 'Liam Ottley', title: '2026 AI Agency Blueprint — Complete Beginner Guide', views: '89K views', date: 'Apr 15', duration: '42:15', summary: 'A comprehensive guide from choosing your niche, setting up GHL and N8N, to landing your first client...' },
]

const tabs = ['All', 'LLM', 'Automation', 'Anthropic', 'Research', 'Policy']

export default function NewsletterPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>AI Newsletter</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Auto-generated daily summaries from top AI sources</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid var(--card-border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13 }}>
            <Search size={14} /> Search news...
          </div>
          <button style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid var(--card-border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}>
            <Filter size={14} /> Today
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {tabs.map((tab, i) => (
          <button key={tab} style={{
            padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            border: i === 0 ? 'none' : '1px solid var(--card-border)',
            background: i === 0 ? 'var(--accent)' : 'transparent',
            color: i === 0 ? '#fff' : 'var(--text-secondary)',
            fontFamily: 'inherit'
          }}>{tab}</button>
        ))}
      </div>

      {/* News Cards */}
      {newsItems.map((item, i) => (
        <div key={i} style={{
          background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 14,
          padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 16,
          cursor: 'pointer', marginBottom: 12, transition: 'border-color 0.2s'
        }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width={19} height={19} style={{ color: 'var(--accent)' }} stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24"><circle cx={12} cy={12} r={10} /></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{item.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.summary}</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
              <span>{item.source}</span><span>·</span><span>{item.time}</span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: 'var(--accent-glow)', color: 'var(--accent)' }}>{item.category}</span>
            </div>
          </div>
        </div>
      ))}

      {/* YouTube Section */}
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: '32px 0 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: '#FF0000' }}>▶</span> YouTube Summaries
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {youtubeItems.map((item, i) => (
          <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 14, overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ height: 130, background: 'linear-gradient(135deg, var(--surface-hover), var(--card-border))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, background: 'rgba(255,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18 }}>▶</div>
              <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 4 }}>{item.duration}</span>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{item.channel}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, marginBottom: 8 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.views} · {item.date}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--card-border)' }}>{item.summary}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Backend notice */}
      <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: 13 }}>
        📡 Content shown above is placeholder data. Once the backend is connected, news and YouTube summaries will be fetched automatically via RSS feeds and YouTube Data API, then summarized by Claude AI.
      </div>
    </div>
  )
}

// Data types and initial sample data for the dashboard
// This in-memory store will be replaced with Supabase queries in Phase 2

export interface Client {
  id: number
  name: string
  platform: string
  status: 'active' | 'terminated'
}

export interface Payment {
  id: number
  clientId: number
  amount: number
  date: string
  notes: string
  screenshot?: { name: string; dataUrl: string }
}

export interface Course {
  id: number
  name: string
  category: 'N8N' | 'GHL' | 'Claude' | 'Other'
  totalHours: number
  completedHours: number
}

export interface TrainingLog {
  id: number
  courseId: number
  hours: number
  date: string
  notes: string
}

export interface DailySteps {
  date: string
  steps: number
  notes: string
}

export interface DashboardData {
  clients: Client[]
  payments: Payment[]
  courses: Course[]
  trainingLogs: TrainingLog[]
  dailySteps: DailySteps[]
  incomeGoal: number
  stepsGoal: number
  nextId: { client: number; payment: number; course: number; trainingLog: number }
}

export const initialData: DashboardData = {
  clients: [
    { id: 1, name: 'Agency X', platform: 'Direct', status: 'active' },
    { id: 2, name: 'StartupCo', platform: 'Upwork', status: 'active' },
    { id: 3, name: 'Local Biz', platform: 'Direct', status: 'active' },
    { id: 4, name: 'Freelance', platform: 'OnlineJobs.ph', status: 'active' },
  ],
  payments: [
    { id: 1, clientId: 1, amount: 65000, date: '2026-01-15', notes: 'January retainer' },
    { id: 2, clientId: 2, amount: 45000, date: '2026-01-20', notes: 'Project milestone' },
    { id: 3, clientId: 1, amount: 70000, date: '2026-02-15', notes: 'February retainer' },
    { id: 4, clientId: 3, amount: 35000, date: '2026-02-18', notes: 'Website automation' },
    { id: 5, clientId: 2, amount: 55000, date: '2026-03-10', notes: 'Phase 2 delivery' },
    { id: 6, clientId: 4, amount: 28000, date: '2026-03-22', notes: 'GHL setup' },
    { id: 7, clientId: 1, amount: 72000, date: '2026-03-15', notes: 'March retainer' },
    { id: 8, clientId: 1, amount: 75000, date: '2026-04-15', notes: 'April retainer' },
    { id: 9, clientId: 3, amount: 42000, date: '2026-04-10', notes: 'N8N workflow build' },
    { id: 10, clientId: 2, amount: 38000, date: '2026-04-12', notes: 'Maintenance' },
  ],
  courses: [
    { id: 1, name: 'N8N Advanced Workflows', category: 'N8N', totalHours: 30, completedHours: 18 },
    { id: 2, name: 'GHL SaaS Mode Setup', category: 'GHL', totalHours: 20, completedHours: 12 },
    { id: 3, name: 'Claude API Masterclass', category: 'Claude', totalHours: 15, completedHours: 8 },
    { id: 4, name: 'N8N + AI Agents', category: 'N8N', totalHours: 25, completedHours: 5 },
  ],
  trainingLogs: [],
  dailySteps: [
    { date: '2026-04-13', steps: 8200, notes: 'Morning run' },
    { date: '2026-04-14', steps: 6500, notes: '' },
    { date: '2026-04-15', steps: 10200, notes: 'Hit goal! Long walk' },
    { date: '2026-04-16', steps: 7800, notes: 'Office day' },
    { date: '2026-04-17', steps: 9100, notes: 'Evening jog' },
    { date: '2026-04-18', steps: 11500, notes: 'Weekend hike' },
    { date: '2026-04-19', steps: 5400, notes: 'Rest day' },
  ],
  incomeGoal: 2500000,
  stepsGoal: 10000,
  nextId: { client: 5, payment: 11, course: 5, trainingLog: 1 },
}

export const CAT_COLORS: Record<string, string> = {
  N8N: '#FF6EAD',
  GHL: '#4DA8FF',
  Claude: '#6C5CE7',
  Other: '#FDAB3D',
}

export const CLIENT_COLORS = ['#6C5CE7','#00D68F','#4DA8FF','#FDAB3D','#FF6EAD','#00D4FF','#FFE066','#FF6B6B']

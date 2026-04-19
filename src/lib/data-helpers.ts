import { DashboardData, CLIENT_COLORS } from './store'

export function getMonthlyEarnings(data: DashboardData): number[] {
  const months = Array(12).fill(0)
  data.payments.forEach(p => {
    const m = new Date(p.date).getMonth()
    months[m] += p.amount
  })
  return months
}

export function getTotalEarnings(data: DashboardData): number {
  return data.payments.reduce((s, p) => s + p.amount, 0)
}

export function getClientTotals(data: DashboardData) {
  const totals: Record<number, number> = {}
  data.payments.forEach(p => {
    totals[p.clientId] = (totals[p.clientId] || 0) + p.amount
  })
  return data.clients
    .map((c, i) => ({
      name: c.name,
      value: totals[c.id] || 0,
      color: CLIENT_COLORS[i % CLIENT_COLORS.length],
    }))
    .filter(c => c.value > 0)
}

export function getCategoryHours(data: DashboardData) {
  const hours: Record<string, number> = {}
  data.courses.forEach(c => {
    hours[c.category] = (hours[c.category] || 0) + c.completedHours
  })
  return Object.entries(hours).map(([k, v]) => ({
    name: k,
    value: v,
  }))
}

export function getTotalTrainingHours(data: DashboardData): number {
  return data.courses.reduce((s, c) => s + c.completedHours, 0)
}

export function getTodaySteps(data: DashboardData): number {
  const today = new Date().toISOString().split('T')[0]
  const entry = data.dailySteps.find(s => s.date === today)
  return entry ? entry.steps : 0
}

export function getWeeklySteps(data: DashboardData) {
  const sorted = [...data.dailySteps].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return sorted.slice(0, 7)
}

export function getWeeklyAvg(data: DashboardData): number {
  const week = getWeeklySteps(data)
  if (week.length === 0) return 0
  return Math.round(week.reduce((s, d) => s + d.steps, 0) / week.length)
}

export function getStreak(data: DashboardData): number {
  const sorted = [...data.dailySteps].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  let streak = 0
  for (const entry of sorted) {
    if (entry.steps >= data.stepsGoal) streak++
    else break
  }
  return streak
}

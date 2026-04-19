'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from './supabase'
import { DashboardData, initialData } from './store'

interface DataContextType {
  data: DashboardData
  loading: boolean
  addClient: (name: string, platform: string) => void
  toggleClientStatus: (clientId: number) => void
  addPayment: (clientId: number, amount: number, date: string, notes: string, screenshot?: { name: string; dataUrl: string }) => void
  deletePayment: (id: number) => void
  addCourse: (name: string, category: string, totalHours: number) => void
  logHours: (courseId: number, hours: number, date: string, notes: string) => void
  deleteTrainingLog: (id: number, courseId: number, hours: number) => void
  setIncomeGoal: (amount: number) => void
  logSteps: (date: string, steps: number, notes: string) => void
  deleteStepsEntry: (date: string) => void
  setStepsGoal: (goal: number) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const EMPTY: DashboardData = {
  clients: [], payments: [], courses: [], trainingLogs: [], dailySteps: [],
  incomeGoal: initialData.incomeGoal,
  stepsGoal: initialData.stepsGoal,
  nextId: { client: 1, payment: 1, course: 1, trainingLog: 1 },
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DashboardData>(EMPTY)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [
        { data: clients },
        { data: payments },
        { data: courses },
        { data: trainingLogs },
        { data: dailySteps },
        { data: settings },
      ] = await Promise.all([
        supabase.from('clients').select('*').order('id'),
        supabase.from('payments').select('*').order('date', { ascending: false }),
        supabase.from('courses').select('*').order('id'),
        supabase.from('training_logs').select('*').order('date', { ascending: false }),
        supabase.from('daily_steps').select('*').order('date', { ascending: false }),
        supabase.from('settings').select('*'),
      ])

      const settingsMap: Record<string, string> = {}
      settings?.forEach((s: { key: string; value: string }) => { settingsMap[s.key] = s.value })

      setData({
        clients: (clients || []).map((c: any) => ({
          id: c.id, name: c.name, platform: c.platform, status: c.status,
        })),
        payments: (payments || []).map((p: any) => ({
          id: p.id, clientId: p.client_id, amount: Number(p.amount),
          date: p.date, notes: p.notes || '',
          ...(p.screenshot_name && p.screenshot_data_url
            ? { screenshot: { name: p.screenshot_name, dataUrl: p.screenshot_data_url } }
            : {}),
        })),
        courses: (courses || []).map((c: any) => ({
          id: c.id, name: c.name, category: c.category,
          totalHours: Number(c.total_hours), completedHours: Number(c.completed_hours),
        })),
        trainingLogs: (trainingLogs || []).map((l: any) => ({
          id: l.id, courseId: l.course_id, hours: Number(l.hours),
          date: l.date, notes: l.notes || '',
        })),
        dailySteps: (dailySteps || []).map((s: any) => ({
          date: s.date, steps: s.steps, notes: s.notes || '',
        })),
        incomeGoal: settingsMap['income_goal']
          ? Number(settingsMap['income_goal'])
          : initialData.incomeGoal,
        stepsGoal: settingsMap['steps_goal']
          ? Number(settingsMap['steps_goal'])
          : initialData.stepsGoal,
        nextId: { client: 1, payment: 1, course: 1, trainingLog: 1 },
      })
      setLoading(false)
    }
    load()
  }, [])

  const addClient = async (name: string, platform: string) => {
    const { data: row } = await supabase
      .from('clients')
      .insert({ name, platform, status: 'active' })
      .select()
      .single()
    if (row) {
      setData(prev => ({
        ...prev,
        clients: [...prev.clients, { id: row.id, name: row.name, platform: row.platform, status: row.status }],
      }))
    }
  }

  const toggleClientStatus = async (clientId: number) => {
    const client = data.clients.find(c => c.id === clientId)
    if (!client) return
    const newStatus = client.status === 'active' ? 'terminated' : 'active'
    await supabase.from('clients').update({ status: newStatus }).eq('id', clientId)
    setData(prev => ({
      ...prev,
      clients: prev.clients.map(c => c.id === clientId ? { ...c, status: newStatus } : c),
    }))
  }

  const addPayment = async (
    clientId: number, amount: number, date: string, notes: string,
    screenshot?: { name: string; dataUrl: string }
  ) => {
    const { data: row } = await supabase
      .from('payments')
      .insert({
        client_id: clientId, amount, date, notes,
        screenshot_name: screenshot?.name ?? null,
        screenshot_data_url: screenshot?.dataUrl ?? null,
      })
      .select()
      .single()
    if (row) {
      setData(prev => ({
        ...prev,
        payments: [{
          id: row.id, clientId: row.client_id, amount: Number(row.amount),
          date: row.date, notes: row.notes || '',
          ...(row.screenshot_name && row.screenshot_data_url
            ? { screenshot: { name: row.screenshot_name, dataUrl: row.screenshot_data_url } }
            : {}),
        }, ...prev.payments],
      }))
    }
  }

  const deletePayment = async (id: number) => {
    await supabase.from('payments').delete().eq('id', id)
    setData(prev => ({ ...prev, payments: prev.payments.filter(p => p.id !== id) }))
  }

  const addCourse = async (name: string, category: string, totalHours: number) => {
    const { data: row } = await supabase
      .from('courses')
      .insert({ name, category, total_hours: totalHours, completed_hours: 0 })
      .select()
      .single()
    if (row) {
      setData(prev => ({
        ...prev,
        courses: [...prev.courses, {
          id: row.id, name: row.name, category: row.category,
          totalHours: Number(row.total_hours), completedHours: 0,
        }],
      }))
    }
  }

  const logHours = async (courseId: number, hours: number, date: string, notes: string) => {
    const course = data.courses.find(c => c.id === courseId)
    if (!course) return
    const newCompleted = Math.min(course.completedHours + hours, course.totalHours)

    const [{ data: logRow }] = await Promise.all([
      supabase.from('training_logs').insert({ course_id: courseId, hours, date, notes }).select().single(),
      supabase.from('courses').update({ completed_hours: newCompleted }).eq('id', courseId),
    ])

    if (logRow) {
      setData(prev => ({
        ...prev,
        trainingLogs: [
          { id: logRow.id, courseId: logRow.course_id, hours: Number(logRow.hours), date: logRow.date, notes: logRow.notes || '' },
          ...prev.trainingLogs,
        ],
        courses: prev.courses.map(c => c.id === courseId ? { ...c, completedHours: newCompleted } : c),
      }))
    }
  }

  const deleteTrainingLog = async (id: number, courseId: number, hours: number) => {
    const course = data.courses.find(c => c.id === courseId)
    const newCompleted = Math.max(0, (course?.completedHours ?? 0) - hours)

    await Promise.all([
      supabase.from('training_logs').delete().eq('id', id),
      supabase.from('courses').update({ completed_hours: newCompleted }).eq('id', courseId),
    ])

    setData(prev => ({
      ...prev,
      trainingLogs: prev.trainingLogs.filter(l => l.id !== id),
      courses: prev.courses.map(c => c.id === courseId ? { ...c, completedHours: newCompleted } : c),
    }))
  }

  const setIncomeGoal = async (amount: number) => {
    await supabase.from('settings').upsert({ key: 'income_goal', value: String(amount) })
    setData(prev => ({ ...prev, incomeGoal: amount }))
  }

  const logSteps = async (date: string, steps: number, notes: string) => {
    await supabase.from('daily_steps').upsert({ date, steps, notes })
    setData(prev => {
      const exists = prev.dailySteps.some(s => s.date === date)
      return {
        ...prev,
        dailySteps: exists
          ? prev.dailySteps.map(s => s.date === date ? { date, steps, notes } : s)
          : [{ date, steps, notes }, ...prev.dailySteps],
      }
    })
  }

  const deleteStepsEntry = async (date: string) => {
    await supabase.from('daily_steps').delete().eq('date', date)
    setData(prev => ({ ...prev, dailySteps: prev.dailySteps.filter(s => s.date !== date) }))
  }

  const setStepsGoal = async (goal: number) => {
    await supabase.from('settings').upsert({ key: 'steps_goal', value: String(goal) })
    setData(prev => ({ ...prev, stepsGoal: goal }))
  }

  return (
    <DataContext.Provider value={{
      data, loading,
      addClient, toggleClientStatus,
      addPayment, deletePayment,
      addCourse, logHours, deleteTrainingLog,
      setIncomeGoal,
      logSteps, deleteStepsEntry, setStepsGoal,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) throw new Error('useData must be used within a DataProvider')
  return context
}

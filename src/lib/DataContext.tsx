'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { DashboardData, initialData, Client, Payment, Course, TrainingLog, DailySteps } from './store'

interface DataContextType {
  data: DashboardData
  addClient: (name: string, platform: string) => void
  toggleClientStatus: (clientId: number) => void
  addPayment: (clientId: number, amount: number, date: string, notes: string, screenshot?: { name: string; dataUrl: string }) => void
  addCourse: (name: string, category: string, totalHours: number) => void
  logHours: (courseId: number, hours: number, date: string, notes: string) => void
  setIncomeGoal: (amount: number) => void
  logSteps: (date: string, steps: number, notes: string) => void
  setStepsGoal: (goal: number) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DashboardData>(initialData)

  const addClient = (name: string, platform: string) => {
    setData(prevData => ({
      ...prevData,
      clients: [
        ...prevData.clients,
        {
          id: prevData.nextId.client,
          name,
          platform,
          status: 'active' as const,
        },
      ],
      nextId: {
        ...prevData.nextId,
        client: prevData.nextId.client + 1,
      },
    }))
  }

  const toggleClientStatus = (clientId: number) => {
    setData(prevData => ({
      ...prevData,
      clients: prevData.clients.map(client =>
        client.id === clientId
          ? { ...client, status: client.status === 'active' ? 'terminated' : 'active' }
          : client
      ),
    }))
  }

  const addPayment = (
    clientId: number,
    amount: number,
    date: string,
    notes: string,
    screenshot?: { name: string; dataUrl: string }
  ) => {
    setData(prevData => ({
      ...prevData,
      payments: [
        ...prevData.payments,
        {
          id: prevData.nextId.payment,
          clientId,
          amount,
          date,
          notes,
          ...(screenshot && { screenshot }),
        },
      ],
      nextId: {
        ...prevData.nextId,
        payment: prevData.nextId.payment + 1,
      },
    }))
  }

  const addCourse = (name: string, category: string, totalHours: number) => {
    setData(prevData => ({
      ...prevData,
      courses: [
        ...prevData.courses,
        {
          id: prevData.nextId.course,
          name,
          category: category as 'N8N' | 'GHL' | 'Claude' | 'Other',
          totalHours,
          completedHours: 0,
        },
      ],
      nextId: {
        ...prevData.nextId,
        course: prevData.nextId.course + 1,
      },
    }))
  }

  const logHours = (courseId: number, hours: number, date: string, notes: string) => {
    setData(prevData => {
      const course = prevData.courses.find(c => c.id === courseId)
      const newCompletedHours = course
        ? Math.min(course.completedHours + hours, course.totalHours)
        : 0

      return {
        ...prevData,
        trainingLogs: [
          ...prevData.trainingLogs,
          {
            courseId,
            hours,
            date,
            notes,
          },
        ],
        courses: prevData.courses.map(course =>
          course.id === courseId
            ? { ...course, completedHours: newCompletedHours }
            : course
        ),
      }
    })
  }

  const setIncomeGoal = (amount: number) => {
    setData(prevData => ({
      ...prevData,
      incomeGoal: amount,
    }))
  }

  const logSteps = (date: string, steps: number, notes: string) => {
    setData(prevData => {
      const existingIndex = prevData.dailySteps.findIndex(entry => entry.date === date)

      if (existingIndex >= 0) {
        // Update existing entry
        return {
          ...prevData,
          dailySteps: prevData.dailySteps.map((entry, index) =>
            index === existingIndex
              ? { ...entry, steps, notes }
              : entry
          ),
        }
      } else {
        // Add new entry
        return {
          ...prevData,
          dailySteps: [
            ...prevData.dailySteps,
            { date, steps, notes },
          ],
        }
      }
    })
  }

  const setStepsGoal = (goal: number) => {
    setData(prevData => ({
      ...prevData,
      stepsGoal: goal,
    }))
  }

  const value: DataContextType = {
    data,
    addClient,
    toggleClientStatus,
    addPayment,
    addCourse,
    logHours,
    setIncomeGoal,
    logSteps,
    setStepsGoal,
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

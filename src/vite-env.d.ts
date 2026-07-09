/// <reference types="vite/client" />

type StoredTask = {
  id: string
  title: string
  completed: boolean
}

type StoredStudySession = {
  id: string
  name: string
  durationSeconds: number
  date: string
}

interface Window {
    focusDeskStorage: {
        getTasks: () => Promise<StoredTask[]>
        setTasks: (tasks: StoredTask[]) => Promise<void>

        getSessions: () => Promise<StoredStudySession[]>
        setSessions: (sessions: StoredStudySession[]) => Promise<void>
    }
}
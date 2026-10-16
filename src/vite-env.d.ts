/// <reference types="vite/client" />

import type { Task, StudySession, StudySection } from './types'

declare global {
  interface Window {
    focusDeskStorage: {
      getTasks: () => Promise<Task[]>
      setTasks: (tasks: Task[]) => Promise<void>
      getSessions: () => Promise<StudySession[]>
      setSessions: (sessions: StudySession[]) => Promise<void>
      getSections: () => Promise<StudySection[]>
      createSection: (name: string, color: string) => Promise<StudySection>
      deleteSection: (sectionId: string) => Promise<void>
    }
  }
}

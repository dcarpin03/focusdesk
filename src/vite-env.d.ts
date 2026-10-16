/// <reference types="vite/client" />

import type { Task, StudySession, StudySection, Theme } from './types'
import type { AvailableLayoutId } from './utils/layouts'

declare global {
  interface Window {
    focusDeskStorage: {
      getLayout: () => Promise<AvailableLayoutId>
      setLayout: (layout: AvailableLayoutId) => Promise<void>
      getTheme: () => Promise<Theme>
      setTheme: (theme: Theme) => Promise<void>
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

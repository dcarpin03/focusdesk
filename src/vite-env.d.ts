/// <reference types="vite/client" />

import type { Task, StudySession, StudySection, Theme, BackgroundResult } from './types'

declare global {
  interface Window {
    focusDeskStorage: {
      getBackground: () => Promise<BackgroundResult>
      importBackground: () => Promise<BackgroundResult>
      resetBackground: () => Promise<BackgroundResult>
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

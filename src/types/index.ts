export type StudySession = {
  id: string
  name: string
  durationSeconds: number
  date: string
  sectionId?: string
}

export type StudySection = {
  id: string
  name: string
}

export type Task = {
  id: string
  title: string
  completed: boolean
}

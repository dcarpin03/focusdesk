import Store from 'electron-store'

export type StoredTask = {
  id: string
  title: string
  completed: boolean
}

export type StoredStudySession = {
  id: string
  name: string
  durationSeconds: number
  date: string
}

type StoreSchema = {
  tasks: StoredTask[]
  sessions: StoredStudySession[]
}

export const store = new Store<StoreSchema>({
  defaults: {
    tasks: [],
    sessions: []
  }
})
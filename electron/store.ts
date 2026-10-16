import Store from 'electron-store'
import type { Task, StudySession, StudySection } from '../src/types'

type StoreSchema = {
  tasks: Task[]
  sessions: StudySession[]
  sections: StudySection[]
}

export const store = new Store<StoreSchema>({
  defaults: {
    tasks: [],
    sessions: [],
    sections: []
  }
})

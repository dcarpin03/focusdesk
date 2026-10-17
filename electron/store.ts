import Store from 'electron-store'
import type { Task, StudySession, StudySection } from '../src/types'
import { DEFAULT_SECTION_COLOR } from '../src/utils/sectionColors'
import { DEFAULT_THEME, isTheme } from '../src/utils/themes'

type StoredStudySection = Omit<StudySection, 'color'> & { color?: string }

type StoreSchema = {
  tasks: Task[]
  sessions: StudySession[]
  sections: StoredStudySection[]
  backgroundImage: unknown
  theme: unknown
}

export const store = new Store<StoreSchema>({
  defaults: {
    tasks: [],
    sessions: [],
    sections: [],
    backgroundImage: null,
    theme: DEFAULT_THEME
  }
})

export function getTheme() {
  const theme = store.get('theme')
  return isTheme(theme) ? theme : DEFAULT_THEME
}

export function getSections(): StudySection[] {
  const storedSections = store.get('sections')
  const sections = storedSections.map((section) => ({
    ...section,
    color: section.color || DEFAULT_SECTION_COLOR
  }))

  // Add missing colors without changing section IDs or historical sessions.
  if (storedSections.some((section) => !section.color)) {
    store.set('sections', sections)
  }

  return sections
}

import Store from 'electron-store'
import type { Task, StudySession, StudySection } from '../src/types'
import { DEFAULT_SECTION_COLOR } from '../src/utils/sectionColors'
import { DEFAULT_THEME, isTheme } from '../src/utils/themes'
import { DEFAULT_LAYOUT, isAvailableLayout } from '../src/utils/layouts'

type StoredStudySection = Omit<StudySection, 'color'> & { color?: string }

type StoreSchema = {
  tasks: Task[]
  sessions: StudySession[]
  sections: StoredStudySection[]
  theme: unknown
  layout: unknown
}

export const store = new Store<StoreSchema>({
  defaults: {
    tasks: [],
    sessions: [],
    sections: [],
    theme: DEFAULT_THEME,
    layout: DEFAULT_LAYOUT
  }
})

export function getTheme() {
  const theme = store.get('theme')
  return isTheme(theme) ? theme : DEFAULT_THEME
}

export function getLayout() {
  const layout = store.get('layout')
  return isAvailableLayout(layout) ? layout : DEFAULT_LAYOUT
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

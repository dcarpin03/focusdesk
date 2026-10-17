import type { StudySection } from '../types'

type SectionPickerProps = {
  sections: StudySection[]
  selectedSectionId: string
  disabled: boolean
  onSectionChange: (sectionId: string) => void
}

export function SectionPicker({ sections, selectedSectionId, disabled, onSectionChange }: SectionPickerProps) {
  const selectedSection = sections.find((section) => section.id === selectedSectionId)
  return (
    <label className='field section-picker'>
      <span>Sección</span>
      <span className='section-select-control'>
        <i className='section-selected-color' aria-hidden='true' style={{ backgroundColor: selectedSection?.color ?? 'var(--color-surface-muted)' }} />
        <select value={selectedSectionId} disabled={disabled} required onChange={(event) => onSectionChange(event.target.value)}>
        <option value=''>Selecciona una sección</option>
        {sections.map((section) => <option key={section.id} value={section.id}>{section.name}</option>)}
        </select>
      </span>
    </label>
  )
}

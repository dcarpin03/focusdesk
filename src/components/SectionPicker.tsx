import type { StudySection } from '../types'

type SectionPickerProps = {
  sections: StudySection[]
  selectedSectionId: string
  disabled: boolean
  onSectionChange: (sectionId: string) => void
}

export function SectionPicker({ sections, selectedSectionId, disabled, onSectionChange }: SectionPickerProps) {
  return (
    <label className='field section-picker'>
      <span>Sección (obligatoria)</span>
      <select value={selectedSectionId} disabled={disabled} required onChange={(event) => onSectionChange(event.target.value)}>
        <option value=''>Selecciona una sección</option>
        {sections.map((section) => <option key={section.id} value={section.id}>{section.name}</option>)}
      </select>
    </label>
  )
}

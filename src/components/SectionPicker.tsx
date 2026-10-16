import { useState } from 'react'
import type { StudySection } from '../types'

type SectionPickerProps = {
  sections: StudySection[]
  selectedSectionId: string
  disabled: boolean
  onSectionChange: (sectionId: string) => void
  onAddSection: (name: string) => Promise<void>
}

export function SectionPicker({ sections, selectedSectionId, disabled, onSectionChange, onAddSection }: SectionPickerProps) {
  const [sectionName, setSectionName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = sectionName.trim()
    if (disabled || !name) return

    if (sections.some((section) => section.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      setError('Ya existe una sección con ese nombre.')
      return
    }

    setError('')
    try {
      await onAddSection(name)
      setSectionName('')
    } catch {
      setError('No se pudo crear la sección. Inténtalo de nuevo.')
    }
  }

  return (
    <div className='section-picker'>
      <label className='field'>
        <span>Sección (obligatoria)</span>
        <select value={selectedSectionId} disabled={disabled} required onChange={(event) => onSectionChange(event.target.value)}>
          <option value=''>Selecciona una sección</option>
          {sections.map((section) => <option key={section.id} value={section.id}>{section.name}</option>)}
        </select>
      </label>
      <form className='section-form' onSubmit={handleSubmit}>
        <label className='field'>
          <span>Nueva sección</span>
          <input
            value={sectionName}
            placeholder='Ej. Matemáticas'
            disabled={disabled}
            onChange={(event) => { setSectionName(event.target.value); setError('') }}
          />
        </label>
        <button type='submit' disabled={disabled || !sectionName.trim()}>Crear sección</button>
      </form>
      {error && <p className='section-error' role='alert'>{error}</p>}
    </div>
  )
}

import { useState } from 'react'
import type { ReactNode } from 'react'
import type { StudySection } from '../types'
import { DEFAULT_SECTION_COLOR, SECTION_COLORS } from '../utils/sectionColors'

type SectionFormProps = {
  icon?: ReactNode
  title?: string
  sections: StudySection[]
  disabled: boolean
  onAddSection: (name: string, color: string) => Promise<void>
}

export function SectionForm({ sections, disabled, onAddSection, icon, title = 'Nueva sección' }: SectionFormProps) {
  const [sectionName, setSectionName] = useState('')
  const [color, setColor] = useState<string>(DEFAULT_SECTION_COLOR)
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (disabled) return
    const name = sectionName.trim()
    if (!name) {
      setError('Introduce un nombre para la sección.')
      return
    }
    if (sections.some((section) => section.name.trim().toLocaleLowerCase() === name.toLocaleLowerCase())) {
      setError('Ya existe una sección con ese nombre.')
      return
    }

    setError('')
    try {
      await onAddSection(name, color)
      setSectionName('')
    } catch {
      setError('No se pudo crear la sección. Inténtalo de nuevo.')
    }
  }

  return (
    <form className='section-form' aria-label='Crear una sección' onSubmit={handleSubmit}>
      {icon && <span className='section-form-icon' aria-hidden='true'>{icon}</span>}
      <label className='field'>
        <span>{title}</span>
        <input
          value={sectionName}
          placeholder='Ej. Matemáticas'
          disabled={disabled}
          aria-required='true'
          aria-invalid={!!error}
          aria-describedby={error ? 'new-section-error' : undefined}
          onChange={(event) => { setSectionName(event.target.value); setError('') }}
        />
      </label>
      <fieldset className='color-palette' disabled={disabled}>
        <legend>Color: {SECTION_COLORS.find((option) => option.value === color)?.name}</legend>
        <div className='color-options'>
          {SECTION_COLORS.map((option) => (
            <input
              key={option.value}
              type='radio'
              name='section-color'
              value={option.value}
              aria-label={option.name}
              title={option.name}
              style={{ backgroundColor: option.value }}
              checked={color === option.value}
              onChange={() => setColor(option.value)}
            />
          ))}
        </div>
      </fieldset>
      <button type='submit' disabled={disabled}>Crear sección</button>
      {error && <p className='section-error' id='new-section-error' role='alert'>{error}</p>}
    </form>
  )
}

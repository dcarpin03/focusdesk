import type { StudySection } from '../types'
import { SectionPicker } from './SectionPicker'

type SessionFormProps = {
    sections: StudySection[]
    selectedSectionId: string
    onSectionChange: (sectionId: string) => void
    isSectionPending: boolean
    sessionName: string
    isRunning: boolean
    onSessionNameChange: (value: string) => void
}

export function SessionForm({
    sections,
    selectedSectionId,
    onSectionChange,
    isSectionPending,
    sessionName,
    isRunning,
    onSessionNameChange
}: SessionFormProps) {
    return (
        <div className='session-form'>
          <div className='session-fields'>
            <label className='field'>
              <span>Nombre de la sesión (obligatorio)</span>
              <input
                type='text'
                placeholder='Ej. Leer libro'
                value={sessionName}
                required
                readOnly={isRunning}
                aria-describedby='session-name-hint'
                onChange={(event) => onSessionNameChange(event.target.value)}
              />
            </label>
            <SectionPicker
              sections={sections}
              selectedSectionId={selectedSectionId}
              disabled={isRunning || isSectionPending}
              onSectionChange={onSectionChange}
            />
          </div>

          <p className='session-hint' id='session-name-hint'>
            {isRunning
              ? 'Podrás editar el nombre al finalizar la sesión.'
              : 'Introduce un nombre para iniciar la sesión.'}
          </p>

          {sessionName.trim() && (
            <p className='session-preview'>Sesión actual: {sessionName}</p>
          )}

        </div>
    )
}

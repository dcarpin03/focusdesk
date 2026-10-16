import { useState } from 'react'
import type { StudySection, StudySession } from '../types'

type HistoryCardProps = {
  sessions: StudySession[]
  sections: StudySection[]
  activeSectionId: string
  isSectionPending: boolean
  onDeleteSection: (sectionId: string) => Promise<void>
  formatTime: (seconds: number) => string
}

export function HistoryCard({ sessions, sections, activeSectionId, isSectionPending, onDeleteSection, formatTime }: HistoryCardProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set(['unassigned']))
  const [error, setError] = useState('')
  const sectionIds = new Set(sections.map((section) => section.id))
  const unassignedSessions = sessions.filter((session) => !session.sectionId || !sectionIds.has(session.sectionId))
  const groups = sections.map((section) => ({
    id: section.id,
    name: section.name,
    removable: true,
    sessions: sessions.filter((session) => session.sectionId === section.id)
  }))

  if (unassignedSessions.length > 0) {
    groups.push({ id: 'unassigned', name: 'Sin sección', removable: false, sessions: unassignedSessions })
  }

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((currentGroups) => {
      const nextGroups = new Set(currentGroups)
      if (nextGroups.has(groupId)) nextGroups.delete(groupId)
      else nextGroups.add(groupId)
      return nextGroups
    })
  }

  const handleDelete = async (sectionId: string) => {
    setError('')
    try {
      await onDeleteSection(sectionId)
    } catch {
      setError('No se pudo eliminar la sección. Solo se pueden eliminar secciones vacías y sin una sesión en curso.')
    }
  }

  return (
    <section className='history-card'>
      <div className='history-header'>
        <div className='card-title'><h2>Historial de sesiones</h2></div>
      </div>
      <p className='history-help'>Solo puedes eliminar secciones vacías.</p>
      {error && <p className='section-error' role='alert'>{error}</p>}
      <ul className='history-list'>
        {groups.length === 0 ? (
          <li className='history-empty'>Todavía no hay sesiones ni secciones guardadas.</li>
        ) : groups.map((group) => {
          const expanded = expandedGroups.has(group.id)
          const isActive = activeSectionId === group.id
          const canDelete = group.sessions.length === 0 && !isActive && !isSectionPending
          return (
            <li className='history-group' key={group.id}>
              <div className='history-group-header'>
                <button
                  type='button'
                  className='section-toggle'
                  aria-expanded={expanded}
                  aria-controls={`history-group-${group.id}`}
                  onClick={() => toggleGroup(group.id)}
                >
                  <span aria-hidden='true'>{expanded ? '▾' : '▸'}</span>
                  <span className='section-name'>{group.name} ({group.sessions.length})</span>
                </button>
                {group.removable && (
                  <button
                    type='button'
                    className='section-delete'
                    aria-label={`Eliminar sección ${group.name}`}
                    disabled={!canDelete}
                    title={isActive ? 'Hay una sesión en curso en esta sección.' : group.sessions.length > 0 ? 'Esta sección contiene sesiones y no se puede eliminar.' : 'Eliminar sección vacía'}
                    onClick={() => handleDelete(group.id)}
                  >Eliminar sección</button>
                )}
              </div>
              <ul className='section-sessions' id={`history-group-${group.id}`} hidden={!expanded}>
                {group.sessions.length === 0 ? (
                  <li className='history-empty'>Todavía no hay sesiones en esta sección.</li>
                ) : group.sessions.map((session) => (
                  <li className='history-item' key={session.id}>
                    <span className='history-dot' aria-hidden='true'></span>
                    <span className='history-name'>{session.name}</span>
                    <span className='history-duration'>{formatTime(session.durationSeconds)}</span>
                    <span className='history-date'>{session.date}</span>
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

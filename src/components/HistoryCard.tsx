import { useState } from 'react'
import type { StudySection, StudySession } from '../types'
import { DEFAULT_SECTION_COLOR } from '../utils/sectionColors'
import { Icon } from './Icon'

type HistoryCardProps = {
  showSummary?: boolean
  isOpen: boolean
  onToggle: () => void
  sessions: StudySession[]
  sections: StudySection[]
  activeSectionId: string
  isSectionPending: boolean
  onDeleteSection: (sectionId: string) => Promise<void>
  onDeleteSession: (sessionId: string) => void
  formatTime: (seconds: number) => string
}

export function HistoryCard({ showSummary = false, isOpen, onToggle, sessions, sections, activeSectionId, isSectionPending, onDeleteSection, onDeleteSession, formatTime }: HistoryCardProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set(['unassigned']))
  const [error, setError] = useState('')
  const sectionIds = new Set(sections.map((section) => section.id))
  const unassignedSessions = sessions.filter((session) => !session.sectionId || !sectionIds.has(session.sectionId))
  const groups = sections.map((section) => ({
    id: section.id,
    name: section.name,
    color: section.color,
    removable: true,
    sessions: sessions.filter((session) => session.sectionId === section.id)
  }))

  if (unassignedSessions.length > 0) {
    groups.push({ id: 'unassigned', name: 'Sin sección', color: DEFAULT_SECTION_COLOR, removable: false, sessions: unassignedSessions })
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
      <h2 className='panel-header'>
        <button
          type='button'
          className='panel-toggle'
          id='history-panel-toggle'
          aria-expanded={isOpen}
          aria-controls='history-panel-content'
          onClick={onToggle}
        >
          {showSummary && <span className='card-icon'><Icon name='clock' /></span>}
          <span className='panel-title'>Historial de sesiones</span>
          {showSummary && <span className='panel-summary'>{sessions.length} {sessions.length === 1 ? 'sesión' : 'sesiones'}</span>}
          <span className='panel-arrow' aria-hidden='true'>{showSummary ? <Icon name='chevron' /> : isOpen ? '▾' : '▸'}</span>
        </button>
      </h2>
      <div className='panel-content' id='history-panel-content' hidden={!isOpen}>
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
                    {!showSummary && <span aria-hidden='true'>{expanded ? '▾' : '▸'}</span>}
                    <span className='section-color-dot' aria-hidden='true' style={{ backgroundColor: group.color }}></span>
                    <span className='section-name'>
                      {group.name}
                      {showSummary
                        ? <small className='section-count'>{group.sessions.length} {group.sessions.length === 1 ? 'sesión' : 'sesiones'}</small>
                        : ` (${group.sessions.length})`}
                    </span>
                    {showSummary && <span className='section-total' title='Tiempo acumulado de la sección'>{formatTime(group.sessions.reduce((total, session) => total + session.durationSeconds, 0))}</span>}
                    {showSummary && <span className='group-arrow' aria-hidden='true'><Icon name='chevron' /></span>}
                  </button>
                  {group.removable && (
                    <button
                      type='button'
                      className='section-delete'
                      aria-label={`Eliminar sección ${group.name}`}
                      disabled={!canDelete}
                      title={isActive ? 'Hay una sesión en curso en esta sección.' : group.sessions.length > 0 ? 'Esta sección contiene sesiones y no se puede eliminar.' : 'Eliminar sección vacía'}
                      onClick={() => handleDelete(group.id)}
                    >{showSummary ? <Icon name='trash' /> : 'Eliminar sección'}</button>
                  )}
                </div>
                <ul className='section-sessions' id={`history-group-${group.id}`} hidden={!expanded}>
                  {group.sessions.length === 0 ? (
                    <li className='history-empty'>Todavía no hay sesiones en esta sección.</li>
                  ) : group.sessions.map((session) => (
                    <li className='history-item' key={session.id}>
                      <span className='history-dot' aria-hidden='true'>{showSummary && <Icon name='clock' />}</span>
                      <span className='history-name'>{session.name}</span>
                      <span className='history-duration'>{formatTime(session.durationSeconds)}</span>
                      <span className='history-date'>{session.date}</span>
                      <button
                        type='button'
                        className='session-delete'
                        aria-label={`Eliminar sesión ${session.name}`}
                        title='Eliminar sesión'
                        onClick={(event) => {
                          event.stopPropagation()
                          onDeleteSession(session.id)
                        }}
                      >
                        {showSummary ? <Icon name='trash' /> : <span aria-hidden='true'>×</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

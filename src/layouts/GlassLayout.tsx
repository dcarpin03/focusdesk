import { SettingsPanel } from '../components/SettingsPanel'
import { TimerCard } from '../components/TimerCard'
import { SessionForm } from '../components/SessionForm'
import { SectionPicker } from '../components/SectionPicker'
import { SectionForm } from '../components/SectionForm'
import { TasksCard } from '../components/TasksCard'
import { HistoryCard } from '../components/HistoryCard'
import { Footer } from '../components/Footer'
import { Icon } from '../components/Icon'
import { formatTime } from '../utils/time'
import type { LayoutProps } from './types'
import './GlassLayout.css'

export function GlassLayout({ model }: LayoutProps) {
  const sectionPending = model.isSectionPending || !model.isStorageLoaded

  return (
    <div className='app glass-layout'>
      <header className='glass-header'>
        <div className='glass-brand'>
          <Icon name='leaf' />
          <div><h1>FocusDesk</h1><p>Un espacio para concentrarte.</p></div>
        </div>
        <p className='glass-header-quote'>Un poco de progreso, cada día.</p>
        <SettingsPanel layout={model.layout} onLayoutChange={model.handleLayoutChange} layoutError={model.layoutError} theme={model.theme} onThemeChange={model.handleThemeChange} error={model.themeError} />
      </header>
      <main className='glass-content'>
        <aside className='glass-sections' aria-label='Gestión de secciones'>
          <div className='glass-section-selection'>
            <h2><Icon name='folder' />Tu espacio de estudio</h2>
            <SectionPicker sections={model.sections} selectedSectionId={model.selectedSectionId} disabled={model.isRunning || sectionPending} onSectionChange={model.setSelectedSectionId} />
          </div>
          <SectionForm title='Nueva sección' sections={model.sections} disabled={model.isRunning || sectionPending} onAddSection={model.handleAddSection} />
        </aside>
        <section className='glass-focus' aria-label='Espacio de estudio'>
          <TimerCard variant='glass' elapsedSeconds={model.elapsedSeconds} isRunning={model.isRunning} canStart={model.canStartSession} onStart={model.handleStartTimer} onStop={model.handleStopTimer}
            sessionForm={<SessionForm showSectionPicker={false} showPreview={false} sections={model.sections} selectedSectionId={model.selectedSectionId} onSectionChange={model.setSelectedSectionId} isSectionPending={sectionPending} sessionName={model.sessionName} isRunning={model.isRunning} onSessionNameChange={model.setSessionName} />} />
          <Footer variant='glass' totalTodaySeconds={model.totalTodaySeconds} />
        </section>
        <aside className={`glass-sidebar side-content${model.isTasksOpen ? ' side-content-tasks-open' : ''}${model.isHistoryOpen ? ' side-content-history-open' : ''}`} aria-label='Organización del estudio'>
          <TasksCard showSummary isOpen={model.isTasksOpen} onToggle={() => model.setIsTasksOpen((open) => !open)} tasks={model.tasks} taskTitle={model.taskTitle} onTaskTitleChange={model.setTaskTitle} onAddTask={model.handleAddTask} onToggleTask={model.handleToggleTask} onDeleteTask={model.handleDeleteTask} />
          <HistoryCard showSummary isOpen={model.isHistoryOpen} onToggle={() => model.setIsHistoryOpen((open) => !open)} sessions={model.sessions} sections={model.sections} activeSectionId={model.isRunning ? model.activeSectionId : ''} isSectionPending={sectionPending} onDeleteSection={model.handleDeleteSection} onDeleteSession={model.handleDeleteSession} formatTime={formatTime} />
        </aside>
      </main>
    </div>
  )
}

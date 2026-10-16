import { SettingsPanel } from '../components/SettingsPanel'
import { TimerCard } from '../components/TimerCard'
import { SessionForm } from '../components/SessionForm'
import { SectionForm } from '../components/SectionForm'
import { TasksCard } from '../components/TasksCard'
import { HistoryCard } from '../components/HistoryCard'
import { Footer } from '../components/Footer'
import { Icon } from '../components/Icon'
import { formatTime } from '../utils/time'
import type { LayoutProps } from './types'
import './EditorialLayout.css'

export function EditorialLayout({ model }: LayoutProps) {
  const sectionPending = model.isSectionPending || !model.isStorageLoaded

  return (
    <div className='app editorial-layout'>
      <header className='editorial-header'>
        <h1 className='editorial-brand'><Icon name='leaf' />FocusDesk</h1>
        <span className='editorial-current-screen'><Icon name='study' />Estudio</span>
        <p className='editorial-header-quote'>Un poco de progreso, cada día.</p>
        <SettingsPanel theme={model.theme} onThemeChange={model.handleThemeChange} error={model.themeError} />
      </header>

      <main className='editorial-content'>
        <section className='editorial-focus' aria-label='Espacio de estudio'>
          <div className='editorial-studio'>
            <div className='editorial-inspiration' aria-hidden='true'>
              <span>UN MOMENTO PARA TI</span>
              <p>Las grandes ideas<br />empiezan con<br />un pequeño paso.</p>
              <i />
            </div>
            <TimerCard
              variant='editorial'
              elapsedSeconds={model.elapsedSeconds}
              isRunning={model.isRunning}
              canStart={model.canStartSession}
              onStart={model.handleStartTimer}
              onStop={model.handleStopTimer}
              sessionForm={
                <SessionForm
                  showPreview={false}
                  sections={model.sections}
                  selectedSectionId={model.selectedSectionId}
                  onSectionChange={model.setSelectedSectionId}
                  isSectionPending={sectionPending}
                  sessionName={model.sessionName}
                  isRunning={model.isRunning}
                  onSessionNameChange={model.setSessionName}
                />
              }
            />
          </div>
          <Footer variant='editorial' totalTodaySeconds={model.totalTodaySeconds} />
        </section>

        <aside className='editorial-sidebar' aria-label='Organización del estudio'>
          <SectionForm
            icon={<Icon name='folder' />}
            sections={model.sections}
            disabled={model.isRunning || sectionPending}
            onAddSection={model.handleAddSection}
          />
          <div className={`side-content${model.isTasksOpen ? ' side-content-tasks-open' : ''}${model.isHistoryOpen ? ' side-content-history-open' : ''}`}>
            <TasksCard
              showSummary
              isOpen={model.isTasksOpen}
              onToggle={() => model.setIsTasksOpen((open) => !open)}
              tasks={model.tasks}
              taskTitle={model.taskTitle}
              onTaskTitleChange={model.setTaskTitle}
              onAddTask={model.handleAddTask}
              onToggleTask={model.handleToggleTask}
              onDeleteTask={model.handleDeleteTask}
            />
            <HistoryCard
              showSummary
              isOpen={model.isHistoryOpen}
              onToggle={() => model.setIsHistoryOpen((open) => !open)}
              sessions={model.sessions}
              sections={model.sections}
              activeSectionId={model.isRunning ? model.activeSectionId : ''}
              isSectionPending={sectionPending}
              onDeleteSection={model.handleDeleteSection}
              onDeleteSession={model.handleDeleteSession}
              formatTime={formatTime}
            />
          </div>
        </aside>
      </main>
    </div>
  )
}

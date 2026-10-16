import { SettingsPanel } from '../components/SettingsPanel'
import { TimerCard } from '../components/TimerCard'
import { SectionForm } from '../components/SectionForm'
import { TasksCard } from '../components/TasksCard'
import { HistoryCard } from '../components/HistoryCard'
import { Footer } from '../components/Footer'
import { formatTime } from '../utils/time'
import { SessionForm } from '../components/SessionForm'
import type { LayoutProps } from './types'

export function CurrentLayout({ model }: LayoutProps) {
  const {
    theme,
    themeError,
    handleThemeChange,
    elapsedSeconds,
    isRunning,
    sessionName,
    setSessionName,
    sections,
    selectedSectionId,
    setSelectedSectionId,
    activeSectionId,
    isSectionPending,
    sessions,
    taskTitle,
    setTaskTitle,
    tasks,
    isStorageLoaded,
    canStartSession,
    isTasksOpen,
    setIsTasksOpen,
    isHistoryOpen,
    setIsHistoryOpen,
    handleStartTimer,
    handleStopTimer,
    handleAddSection,
    handleDeleteSection,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    handleDeleteSession,
    totalTodaySeconds
  } = model

  return (
    <div className='app'>
      <div className='app-toolbar'>
        <SectionForm
          sections={sections}
          disabled={isRunning || isSectionPending || !isStorageLoaded}
          onAddSection={handleAddSection}
        />
        <SettingsPanel theme={theme} onThemeChange={handleThemeChange} error={themeError} />
      </div>
      <main className='app-content'>
        <TimerCard
            elapsedSeconds={elapsedSeconds}
            isRunning={isRunning}
            onStart={handleStartTimer}
            onStop={handleStopTimer}
            canStart={canStartSession}
            sessionForm={
              <SessionForm
                sections={sections}
                selectedSectionId={selectedSectionId}
                onSectionChange={setSelectedSectionId}
                isSectionPending={isSectionPending || !isStorageLoaded}
                sessionName={sessionName}
                isRunning={isRunning}
                onSessionNameChange={setSessionName}
              />
            }
        />

        <section className={`side-content${isTasksOpen ? ' side-content-tasks-open' : ''}${isHistoryOpen ? ' side-content-history-open' : ''}`}>
          <TasksCard
            isOpen={isTasksOpen}
            onToggle={() => setIsTasksOpen((isOpen) => !isOpen)}
            tasks={tasks}
            taskTitle={taskTitle}
            onTaskTitleChange={setTaskTitle}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />

          <HistoryCard
            isOpen={isHistoryOpen}
            onToggle={() => setIsHistoryOpen((isOpen) => !isOpen)}
            sessions={sessions}
            sections={sections}
            activeSectionId={isRunning ? activeSectionId : ''}
            isSectionPending={isSectionPending || !isStorageLoaded}
            onDeleteSection={handleDeleteSection}
            onDeleteSession={handleDeleteSession}
            formatTime={formatTime}
          />

        </section>
      </main>

      <Footer totalTodaySeconds={totalTodaySeconds}/>
    </div>
  )
}

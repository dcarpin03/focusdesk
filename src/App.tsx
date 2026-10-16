import { useEffect, useState } from 'react'
import './App.css'
import type { StudySection, StudySession, Task } from './types'
import { TimerCard } from './components/TimerCard'
import { SectionForm } from './components/SectionForm'
import { TasksCard } from './components/TasksCard'
import { HistoryCard } from './components/HistoryCard'
import { Footer } from './components/Footer'
import { formatTime } from './utils/time'
import { useTimer } from './hooks/useTimer'

function App() {
  const {
    elapsedSeconds,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer
  } = useTimer()

  const [sessionName, setSessionName] = useState('')
  const [activeSessionName, setActiveSessionName] = useState('')
  const [sections, setSections] = useState<StudySection[]>([])
  const [selectedSectionId, setSelectedSectionId] = useState('')
  const [activeSectionId, setActiveSectionId] = useState('')
  const [isSectionPending, setIsSectionPending] = useState(false)
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [taskTitle, setTaskTitle] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [isStorageLoaded, setIsStorageLoaded] = useState(false)

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedTasks = await window.focusDeskStorage.getTasks()
        const storedSessions = await window.focusDeskStorage.getSessions()
        const storedSections = await window.focusDeskStorage.getSections()

        setTasks(storedTasks)
        setSessions(storedSessions)
        setSections(storedSections)
        setIsStorageLoaded(true)
      } catch(error) {
        console.error('Error al cargar los datos de FocusDesk:', error)
      }
      
    }

    loadStoredData()
  }, [])

  useEffect(() => {
    if(!isStorageLoaded){
      return
    }

    window.focusDeskStorage.setTasks(tasks).catch((error) => {
      console.error('Error al guardar las tareas:', error)
    })
  }, [tasks, isStorageLoaded])

  useEffect(() => {
    if (!isStorageLoaded) {
      return
    }

    window.focusDeskStorage.setSessions(sessions).catch((error) => {
      console.error('Error al guardar las sesiones:', error)
    })
  }, [sessions, isStorageLoaded])

  const handleStartTimer = () => {
    const trimmedName = sessionName.trim()

    if (isRunning || !trimmedName || !isStorageLoaded || isSectionPending ||
      !sections.some((section) => section.id === selectedSectionId)) {
      return
    }

    setSessionName(trimmedName)
    setActiveSessionName(trimmedName)
    setActiveSectionId(selectedSectionId)
    startTimer()
  }

  const handleStopTimer = () => {
    if(!isRunning || elapsedSeconds === 0){
      return
    }

    const newSession: StudySession = {
      id: crypto.randomUUID(),
      name: activeSessionName,
      sectionId: activeSectionId,
      durationSeconds: elapsedSeconds,
      date: new Date().toLocaleDateString('es-ES')
    }

    setSessions((currentSessions) => [newSession, ...currentSessions])
    stopTimer()
    resetTimer()
    setSessionName('')
    setActiveSessionName('')
    setActiveSectionId('')
  }

  const handleAddSection = async (name: string, color: string) => {
    if (isRunning || isSectionPending || !isStorageLoaded) {
      throw new Error('No se puede crear la sección en este momento.')
    }

    setIsSectionPending(true)
    try {
      const section = await window.focusDeskStorage.createSection(name, color)
      setSections((currentSections) => [...currentSections, section])
      setSelectedSectionId(section.id)
    } finally {
      setIsSectionPending(false)
    }
  }

  const handleDeleteSection = async (sectionId: string) => {
    if (isSectionPending || !isStorageLoaded ||
      (isRunning && activeSectionId === sectionId) ||
      sessions.some((session) => session.sectionId === sectionId)) {
      throw new Error('Solo se pueden eliminar secciones vacías y sin una sesión en curso.')
    }

    setIsSectionPending(true)
    try {
      await window.focusDeskStorage.deleteSection(sectionId)
      setSections((currentSections) => currentSections.filter((section) => section.id !== sectionId))
      if (selectedSectionId === sectionId) {
        setSelectedSectionId('')
      }
    } finally {
      setIsSectionPending(false)
    }
  }

  const handleAddTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if(taskTitle.trim() === ''){
      return
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskTitle.trim(),
      completed: false
    }

    setTasks((currentTasks) => [newTask, ...currentTasks])
    setTaskTitle('')
  }

  const handleToggleTask = (taskId: string) => {
    setTasks((currentTasks) => 
      currentTasks.map((task) => 
        task.id === taskId ? {...task, completed: !task.completed } : task
      )
    )
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks((currentTasks) => 
      currentTasks.filter((task) => task.id !== taskId)
    )
  }

  const today = new Date().toLocaleDateString('es-ES')
  const totalTodaySeconds = sessions
  .filter((session) => session.date === today)
  .reduce((total, session) => total + session.durationSeconds, 0)

  return (
    <div className='app'>
      <SectionForm
        sections={sections}
        disabled={isRunning || isSectionPending || !isStorageLoaded}
        onAddSection={handleAddSection}
      />
      <main className='app-content'>
        <TimerCard 
            sections={sections}
            selectedSectionId={selectedSectionId}
            onSectionChange={setSelectedSectionId}
            isSectionPending={isSectionPending || !isStorageLoaded}
            sessionName={sessionName}
            elapsedSeconds={elapsedSeconds}
            isRunning={isRunning}
            onSessionNameChange={setSessionName}
            onStart={handleStartTimer}
            onStop={handleStopTimer}
            formatTime={formatTime}
        />

        <section className='side-content'>
          <TasksCard 
            tasks={tasks}
            taskTitle={taskTitle}
            onTaskTitleChange={setTaskTitle}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />

          <HistoryCard
            sessions={sessions}
            sections={sections}
            activeSectionId={isRunning ? activeSectionId : ''}
            isSectionPending={isSectionPending || !isStorageLoaded}
            onDeleteSection={handleDeleteSection}
            formatTime={formatTime}
          />

        </section>
      </main>

      <Footer totalTodaySeconds={totalTodaySeconds}/>
    </div>
  )
}

export default App

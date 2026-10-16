import { useEffect, useState } from 'react'
import type { StudySection, StudySession, Task, Theme } from '../types'
import { useTimer } from './useTimer'
import type { AvailableLayoutId } from '../utils/layouts'

export function useFocusDesk(initialTheme: Theme, initialLayout: AvailableLayoutId) {
  const [layout, setLayout] = useState(initialLayout)
  const [layoutError, setLayoutError] = useState('')

  const handleLayoutChange = (nextLayout: AvailableLayoutId) => {
    setLayout(nextLayout)
    setLayoutError('')
    window.focusDeskStorage.setLayout(nextLayout).catch(() => {
      setLayoutError('No se pudo guardar el diseño. Se aplicará solo durante esta ejecución.')
    })
  }

  const [theme, setTheme] = useState<Theme>(initialTheme)
  const [themeError, setThemeError] = useState('')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const handleThemeChange = (nextTheme: Theme) => {
    setTheme(nextTheme)
    setThemeError('')
    window.focusDeskStorage.setTheme(nextTheme).catch(() => {
      setThemeError('No se pudo guardar el tema. Se aplicará solo durante esta ejecución.')
    })
  }

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
  const [isTasksOpen, setIsTasksOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

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

  const handleDeleteSession = (sessionId: string) => {
    const session = sessions.find((session) => session.id === sessionId)
    if (!session || !window.confirm(
      `¿Eliminar la sesión «${session.name}»?\n\nEsta acción eliminará el registro de la sesión del historial.`
    )) {
      return
    }

    setSessions((currentSessions) => currentSessions.filter((session) => session.id !== sessionId))
  }

  const today = new Date().toLocaleDateString('es-ES')
  const totalTodaySeconds = sessions
  .filter((session) => session.date === today)
  .reduce((total, session) => total + session.durationSeconds, 0)

  const canStartSession = !!sessionName.trim() && !!selectedSectionId &&
    !isSectionPending && isStorageLoaded

  return {
    layout,
    layoutError,
    handleLayoutChange,
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
  }
}

export type FocusDeskModel = ReturnType<typeof useFocusDesk>

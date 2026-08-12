import { useEffect, useState } from 'react'
import './App.css'
import type { StudySession, Task } from './types'
import { Header } from './components/Header'
import { TimerCard } from './components/TimerCard'
import { TasksCard } from './components/TasksCard'
import { HistoryCard } from './components/HistoryCard'

function App() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0) 
  const [isRunning, setIsRunning] = useState(false)
  const [sessionName, setSessionName] = useState('')
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [taskTitle, setTaskTitle] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [isStorageLoaded, setIsStorageLoaded] = useState(false)

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':')
  }

  useEffect(() => {
    if(!isRunning){
      return
    }

    //Crea intervalo que se ejecuta cada segundo, coge valor actual y le suma 1
    const intervalId = window.setInterval(() => {
      setElapsedSeconds((currentSeconds) => currentSeconds + 1)
    }, 1000)

    //Limpiar intervalo cuándo no haga falta
    return () => {
      window.clearInterval(intervalId)
    }
  }, [isRunning])

  useEffect(() => {
    const loadStoredData = async () => {
      const storedTasks = await window.focusDeskStorage.getTasks()
      const storedSessions = await window.focusDeskStorage.getSessions()

      setTasks(storedTasks)
      setSessions(storedSessions)
      setIsStorageLoaded(true)
    }

    loadStoredData()
  }, [])

  useEffect(() => {
    if(!isStorageLoaded){
      return
    }

    window.focusDeskStorage.setTasks(tasks)
  }, [tasks, isStorageLoaded])

  useEffect(() => {
    if (!isStorageLoaded) {
      return
    }

    window.focusDeskStorage.setSessions(sessions)
  }, [sessions, isStorageLoaded])

  const handleStartTimer = () => {
    setIsRunning(true)
  }

  const handleStopTimer = () => {
    if(elapsedSeconds === 0){
      return
    }

    const newSession: StudySession = {
      id: crypto.randomUUID(),
      name: sessionName.trim() || 'Sesión sin nombre',
      durationSeconds: elapsedSeconds,
      date: new Date().toLocaleDateString('es-ES')
    }

    setSessions((currentSessions) => [newSession, ...currentSessions])
    setIsRunning(false)
    setElapsedSeconds(0)
    setSessionName('')
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

  return (
    <div className='app'>
      <Header />

      <main className='app-content'>
        <TimerCard 
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

          <HistoryCard sessions={sessions} formatTime={formatTime} />

        </section>
      </main>

      <footer className='app-footer'>
        <span>Tiempo total hoy: </span>
      </footer>
    </div>
  )
}

export default App

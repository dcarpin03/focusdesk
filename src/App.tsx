import { useEffect, useState } from 'react'
import './App.css'
import type { StudySession, Task } from './types'
import { Header } from './components/Header'
import { TimerCard } from './components/TimerCard'
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
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [taskTitle, setTaskTitle] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [isStorageLoaded, setIsStorageLoaded] = useState(false)

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
    startTimer()
  }

  const handleStopTimer = () => {
    if(!isRunning || elapsedSeconds === 0){
      return
    }

    const newSession: StudySession = {
      id: crypto.randomUUID(),
      name: sessionName.trim() || 'Sesión sin nombre',
      durationSeconds: elapsedSeconds,
      date: new Date().toLocaleDateString('es-ES')
    }

    setSessions((currentSessions) => [newSession, ...currentSessions])
    stopTimer()
    resetTimer()
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

  const today = new Date().toLocaleDateString('es-ES')
  const totalTodaySeconds = sessions
  .filter((session) => session.date === today)
  .reduce((total, session) => total + session.durationSeconds, 0)

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

      <Footer totalTodaySeconds={totalTodaySeconds}/>
    </div>
  )
}

export default App

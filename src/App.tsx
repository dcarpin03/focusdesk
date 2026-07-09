import { useEffect, useState } from 'react'
import './App.css'

type StudySession = {
  id: string
  name: string
  durationSeconds: number
  date: string
}

type Task = {
  id: string
  title: string
  completed: boolean
}

function App() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionName, setSessionName] = useState('')
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [taskTitle, setTaskTitle] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])

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

  return (
    <div className='app'>
      <header className='app-header'>
        <div>
          <p className='app-logo'>FocusDesk</p>
          <h1>Tu espacio para estudiar</h1>
        </div>

        <button type='button' className='break-button'>
          Tomar descanso
        </button>
      </header>

      <main className='app-content'>
        <section className='timer-card'>
          <div className='session-form'>
            <label className='field'>
              <span>Nombre de la sesión</span>
              <input 
                type='text' 
                placeholder='Ej. Leer libro'
                value={sessionName}
                onChange={(event) => setSessionName(event.target.value)}
              />
            </label>

            <p className='session-preview'>Sesión actual: {sessionName}</p>

            <label className='field'>
              <span>Actividad</span>
              <select defaultValue="lectura">
                <option value="lectura">Lectura</option>
                <option value="matematicas">Matemáticas</option>
                <option value="historia">Historia</option>
                <option value="programacion">Programación</option>
              </select>
            </label>
          </div>

          <div className='timer-display'>
            <div className='timer-circle'>
              <p className='timer-time'>{formatTime(elapsedSeconds)}</p>
              <p className='timer-label'>Tiempo de estudio</p>
            </div>
          </div>

          <div className='timer-actions'>
            <button type='button' className='primary-button' onClick={handleStartTimer}>
              {isRunning ? '▶ En curso' : '▶ Iniciar'}
            </button>

            <button type='button' className='secondary-button' onClick={handleStopTimer}>
              ■ Detener
            </button>
          </div>
        </section>

        <section className='side-content'>
          <section className='tasks-card'>
            <div className='card-title'>
              <span className='card-icon'>☷</span>
              <h2>Tareas</h2>
            </div>

            <form className='task-form' onSubmit={handleAddTask}>
              <input 
                type='text' 
                placeholder='Nueva tarea...'
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
              />
              <button type='submit'>Añadir</button>
            </form>

            <ul className='task-list'>
              {tasks.length === 0 ? (
                <li className="task-empty">Todavía no hay tareas creadas.</li>
              ) : (
                tasks.map((task) => (
                  <li className={`task-item ? ${task.completed ? 'task-item-completed' : ''}`} key={task.id}>
                    
                    <input 
                      type='checkbox'
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                    />

                    <span className='task-title'>{task.title}</span>

                    <span 
                    className={`task-status ${
                      task.completed ? 'task-status-done' : 'task-status-pending'
                      }`}>
                      {task.completed ? 'Finalizada' : 'Pendiente'}
                    </span>

                    <button type='button' className='task-menu'>
                      ⋮
                    </button>
                  </li>
                ))
              )}
            </ul>
          </section>

          <section className='history-card'>
            <div className='history-header'>
              <div className='card-title'>
                <h2>Historial de sesiones</h2>
              </div>

              <button type='button' className='history-link'>
                Ver todo
              </button>
            </div>

            <ul className="history-list">
              {sessions.length === 0 ? (
                <li className='history-empty'>Todavía no hay sesiones guardadas.</li>
              ) : (
                  sessions.map((session) => (
                    <li className="history-item" key={session.id}>
                      <span className="history-dot"></span>
                      <span className="history-name">{session.name}</span>
                      <span className="history-duration">{formatTime(session.durationSeconds)}</span>
                      <span className="history-date">{session.date}</span>
                    </li>
                  ))
              )}
            </ul>
          </section>
        </section>
      </main>

      <footer className='app-footer'>
        <span>Tiempo total hoy: </span>
      </footer>
    </div>
  )
}

export default App

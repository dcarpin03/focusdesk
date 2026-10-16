import type { Task } from "../types";
import { Icon } from './Icon'

type TasksCardProps = {
    showSummary?: boolean
    isOpen: boolean
    onToggle: () => void
    tasks: Task[]
    taskTitle: string
    onTaskTitleChange: (value: string) => void
    onAddTask: (event: React.FormEvent<HTMLFormElement>) => void
    onToggleTask: (taskId: string) => void
    onDeleteTask: (taskId: string) => void
}

export function TasksCard({
    showSummary = false,
    isOpen,
    onToggle,
    tasks,
    taskTitle,
    onTaskTitleChange,
    onAddTask,
    onToggleTask,
    onDeleteTask
}: TasksCardProps) {
    return (
        <section className='tasks-card'>
            <h2 className='panel-header'>
              <button
                type='button'
                className='panel-toggle'
                id='tasks-panel-toggle'
                aria-expanded={isOpen}
                aria-controls='tasks-panel-content'
                onClick={onToggle}
              >
                <span className='card-icon' aria-hidden='true'>{showSummary ? <Icon name='check' /> : '☷'}</span>
                <span className='panel-title'>Tareas</span>
                {showSummary && <span className='panel-summary'>{tasks.filter((task) => task.completed).length} de {tasks.length} completadas</span>}
                <span className='panel-arrow' aria-hidden='true'>{showSummary ? <Icon name='chevron' /> : isOpen ? '▾' : '▸'}</span>
              </button>
            </h2>

            <div className='panel-content' id='tasks-panel-content' hidden={!isOpen}>
              <form className='task-form' aria-label='Añadir una tarea' onSubmit={onAddTask}>
                <input
                  type='text'
                  aria-label='Nueva tarea'
                  placeholder='Nueva tarea...'
                  value={taskTitle}
                  onChange={(event) => onTaskTitleChange(event.target.value)}
                />
                <button type='submit'>Añadir</button>
              </form>

              <ul className='task-list'>
                {tasks.length === 0 ? (
                  <li className="task-empty">Todavía no hay tareas creadas.</li>
                ) : (
                  tasks.map((task) => (
                    <li
                      className={`task-item ${task.completed ? 'task-item-completed' : ''}`}
                      key={task.id}
                    >

                      <input
                        type='checkbox'
                        aria-label={`Completar tarea ${task.title}`}
                        checked={task.completed}
                        onChange={() => onToggleTask(task.id)}
                      />

                      <span className='task-title'>{task.title}</span>

                      <span
                      className={`task-status ${
                        task.completed ? 'task-status-done' : 'task-status-pending'
                        }`}>
                        {task.completed ? 'Finalizada' : 'Pendiente'}
                      </span>

                      <button
                        type='button'
                        className='task-menu'
                        onClick={() => onDeleteTask(task.id)}
                        aria-label={`Eliminar tarea ${task.title}`}
                        >
                        {showSummary ? <Icon name='trash' /> : 'x'}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </section>
    )
}

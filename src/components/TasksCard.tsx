import type { Task } from "../types";

type TasksCardProps = {
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
                <span className='card-icon' aria-hidden='true'>☷</span>
                <span>Tareas</span>
                <span className='panel-arrow' aria-hidden='true'>{isOpen ? '▾' : '▸'}</span>
              </button>
            </h2>

            <div className='panel-content' id='tasks-panel-content' hidden={!isOpen}>
              <form className='task-form' onSubmit={onAddTask}>
                <input
                  type='text'
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
                        x
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </section>
    )
}

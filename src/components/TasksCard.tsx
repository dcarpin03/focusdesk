import type { Task } from "../types";

type TasksCardProps = {
    tasks: Task[]
    taskTitle: string
    onTaskTitleChange: (value: string) => void
    onAddTask: (event: React.FormEvent<HTMLFormElement>) => void
    onToggleTask: (taskId: string) => void
    onDeleteTask: (taskId: string) => void
}

export function TasksCard({
    tasks,
    taskTitle,
    onTaskTitleChange,
    onAddTask,
    onToggleTask,
    onDeleteTask
}: TasksCardProps) {
    return (
        <section className='tasks-card'>
            <div className='card-title'>
              <span className='card-icon'>☷</span>
              <h2>Tareas</h2>
            </div>

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
                  <li className={`task-item ? ${task.completed ? 'task-item-completed' : ''}`} key={task.id}>
                    
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
          </section>
    )
}
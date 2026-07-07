import './App.css'

function App() {
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
              <input type='text' placeholder='Ej. Leer libro'></input>
            </label>

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
              <p className='timer-time'>00:00:00</p>
              <p className='timer-label'>Tiempo de estudio</p>
            </div>
          </div>

          <div className='timer-actions'>
            <button type='button' className='primary-button'>
              ▶ Iniciar
            </button>

            <button type='button' className='secondary-button'>
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

            <form className='task-form'>
              <input type='text' placeholder='Nueva tarea...'></input>
              <button type='submit'>Añadir</button>
            </form>

            <ul className='task-list'>
              <li className='task-item'>
                <input type='checkbox'></input>
                <span className='task-title'>Leer capítulo 4 de Matemáticas</span>
                <span className='task-status task-status-pending'>Pendiente</span>
                <button type='button' className='task-menu'>
                  ⋮
                </button>
              </li>

              <li className="task-item">
                <input type="checkbox" />
                <span className="task-title">Resumir apuntes de Biología</span>
                <span className="task-status task-status-pending">Pendiente</span>
                <button type="button" className="task-menu">
                  ⋮
                </button>
              </li>

              <li className="task-item task-item-completed">
                <input type="checkbox" defaultChecked />
                <span className="task-title">Repasar ejercicios de Física</span>
                <span className="task-status task-status-done">Finalizada</span>
                <button type="button" className="task-menu">
                  ⋮
                </button>
              </li>

              <li className="task-item task-item-completed">
                <input type="checkbox" defaultChecked />
                <span className="task-title">Ver vídeo de Historia</span>
                <span className="task-status task-status-done">Finalizada</span>
                <button type="button" className="task-menu">
                  ⋮
                </button>
              </li>
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
              <li className="history-item">
                <span className="history-dot"></span>
                <span className="history-name">Leer libro</span>
                <span className="history-duration">25:00</span>
                <span className="history-date">24/05/2025</span>
              </li>

              <li className="history-item">
                <span className="history-dot"></span>
                <span className="history-name">Resumir apuntes</span>
                <span className="history-duration">50:00</span>
                <span className="history-date">24/05/2025</span>
              </li>

              <li className="history-item">
                <span className="history-dot"></span>
                <span className="history-name">Sesión de estudio</span>
                <span className="history-duration">25:00</span>
                <span className="history-date">23/05/2025</span>
              </li>

              <li className="history-item">
                <span className="history-dot"></span>
                <span className="history-name">Resolver ejercicios</span>
                <span className="history-duration">40:00</span>
                <span className="history-date">23/05/2025</span>
              </li>
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

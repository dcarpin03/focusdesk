type TimerCardProps = {
    sessionName: string
    elapsedSeconds: number
    isRunning: boolean
    onSessionNameChange: (value: string) => void
    onStart: () => void
    onStop: () => void
    formatTime: (seconds: number) => string
}

export function TimerCard({
    sessionName,
    elapsedSeconds,
    isRunning,
    onSessionNameChange,
    onStart,
    onStop
}: TimerCardProps) {
    return (
        <section className='timer-card'>
          <div className='session-form'>
            <label className='field'>
              <span>Nombre de la sesión</span>
              <input 
                type='text' 
                placeholder='Ej. Leer libro'
                value={sessionName}
                onChange={(event) => onSessionNameChange(event.target.value)}
              />
            </label>

            {sessionName.trim() && (
              <p className='session-preview'>Sesión actual: {sessionName}</p>
            )}

          </div>

          <div className='timer-display'>
            <div className='timer-clock'>
              <span>{String(Math.floor(elapsedSeconds / 3600)).padStart(2, '0')}<small>h</small></span>
              <span>{String(Math.floor((elapsedSeconds % 3600) / 60)).padStart(2, '0')}<small>m</small></span>
              <span className='timer-seconds'>
                {String(elapsedSeconds % 60).padStart(2, '0')}<small>s</small>
              </span>
            </div>

            <p className='timer-label'>Tiempo de estudio</p>
          </div>

          <div className='timer-actions'>
            {!isRunning ? (
              <button type='button' className='primary-button' onClick={onStart}>
                ▶ Iniciar sesión
              </button>
            ) : (
              <button type='button' className='secondary-button' onClick={onStop}>
                ■ Finalizar sesión
              </button>
            )}
          </div>
        </section>
    )
}
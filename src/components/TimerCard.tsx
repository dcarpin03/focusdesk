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
    onStop,
    formatTime
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

            <p className='session-preview'>Sesión actual: {sessionName}</p>

          </div>

          <div className='timer-display'>
            <div className='timer-circle'>
              <p className='timer-time'>{formatTime(elapsedSeconds)}</p>
              <p className='timer-label'>Tiempo de estudio</p>
            </div>
          </div>

          <div className='timer-actions'>
            <button type='button' className='primary-button' onClick={onStart} disabled={isRunning}>
              {isRunning ? '▶ En curso' : '▶ Iniciar'}
            </button>

            <button type='button' className='secondary-button' onClick={onStop} disabled={!isRunning}>
              ■ Detener
            </button>
          </div>
        </section>
    )
}
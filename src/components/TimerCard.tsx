import type { ReactNode } from 'react'

type TimerCardProps = {
    elapsedSeconds: number
    isRunning: boolean
    canStart: boolean
    onStart: () => void
    onStop: () => void
    sessionForm?: ReactNode
}

export function TimerCard({
    elapsedSeconds,
    isRunning,
    canStart,
    onStart,
    onStop,
    sessionForm
}: TimerCardProps) {
    return (
        <section className='timer-card'>
          {sessionForm}

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
              <button type='button' className='primary-button' onClick={onStart} disabled={!canStart}>
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

import type { ReactNode } from 'react'
import { Icon } from './Icon'
import { formatTime } from '../utils/time'

type TimerCardProps = {
    variant?: 'default' | 'editorial'
    elapsedSeconds: number
    isRunning: boolean
    canStart: boolean
    onStart: () => void
    onStop: () => void
    sessionForm?: ReactNode
}

export function TimerCard({
    variant = 'default',
    elapsedSeconds,
    isRunning,
    canStart,
    onStart,
    onStop,
    sessionForm
}: TimerCardProps) {
    const actions = (
        <div className='timer-actions'>
            {!isRunning ? (
                <button type='button' className='primary-button' onClick={onStart} disabled={!canStart}>
                    <span aria-hidden='true'>▶</span> Iniciar sesión
                </button>
            ) : (
                <button type='button' className='secondary-button' onClick={onStop}>
                    <span aria-hidden='true'>■</span> Finalizar sesión
                </button>
            )}
        </div>
    )

    if (variant === 'editorial') {
        const [hours, minutes, seconds] = formatTime(elapsedSeconds).split(':')

        return (
            <section className='timer-card editorial-timer' aria-label='Sesión de estudio'>
                <div className='timer-display editorial-dial'>
                    <Icon name='leaf' />
                    <span className='editorial-timer-state'>{isRunning ? 'Estudiando' : 'Listo para estudiar'}</span>
                    <div className='timer-clock' role='timer' aria-label={`Tiempo transcurrido: ${formatTime(elapsedSeconds)}`} aria-live='off'>
                        <span className='editorial-hours' aria-hidden='true'><span>{hours}</span><small>h</small></span>
                        <span className='editorial-main-time' aria-hidden='true'>
                            <span>{minutes}</span><span className='editorial-time-separator'>:</span><span>{seconds}</span>
                        </span>
                    </div>
                    <p className='timer-label'>Tiempo de estudio</p>
                </div>
                <div className='editorial-session-card'>
                    {sessionForm}
                    {actions}
                </div>
            </section>
        )
    }
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

          {actions}
        </section>
    )
}

import type { CSSProperties, ReactNode } from 'react'
import { Icon } from './Icon'
import { formatCountdown } from '../utils/time'
import { POMODORO_MINUTES } from '../hooks/useTimer'

type TimerCardProps = {
    remainingSeconds: number
    durationMinutes: number
    onDurationChange: (minutes: number) => void
    isRunning: boolean
    canStart: boolean
    onStart: () => void
    onStop: () => void
    sessionForm?: ReactNode
}

export function TimerCard({ remainingSeconds, durationMinutes, onDurationChange, isRunning, canStart, onStart, onStop, sessionForm }: TimerCardProps) {
    const [minutes, seconds] = formatCountdown(remainingSeconds).split(':')
    const ringStyle = { '--pomodoro-remaining': `${remainingSeconds / (durationMinutes * 60) * 360}deg` } as CSSProperties

    return (
        <section className='timer-card editorial-timer' aria-label='Sesión de estudio'>
            <div className='timer-display editorial-dial' style={ringStyle}>
                <Icon name='leaf' />
                <span className='editorial-timer-state'>{isRunning ? 'Estudiando' : 'Listo para estudiar'}</span>
                <div className='timer-clock' role='timer' aria-label={`Tiempo restante: ${formatCountdown(remainingSeconds)}`} aria-live='off'>
                    <span className='editorial-main-time' aria-hidden='true'>
                        <span>{minutes}</span><span className='editorial-time-separator'>:</span><span>{seconds}</span>
                    </span>
                </div>
                <select className='pomodoro-duration' aria-label='Duración del Pomodoro' value={durationMinutes} disabled={isRunning} onChange={(event) => onDurationChange(Number(event.target.value))}>
                    {POMODORO_MINUTES.map((value) => <option key={value} value={value}>Pomodoro · {value} minutos</option>)}
                </select>
            </div>
            <div className='editorial-session-card'>
                {sessionForm}
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
            </div>
        </section>
    )
}

import { formatTime } from '../utils/time'
import { Icon } from './Icon'

type FooterProps = {
    variant?: 'default' | 'editorial' | 'glass'
    totalTodaySeconds: number
}

export function Footer({ totalTodaySeconds, variant = 'default' }: FooterProps) {
    if (variant !== 'default') {
        const hours = Math.floor(totalTodaySeconds / 3600)
        const minutes = Math.floor((totalTodaySeconds % 3600) / 60)
        const seconds = totalTodaySeconds % 60

        return (
            <footer className={`app-footer ${variant}-daily`}>
                <span className={`${variant}-daily-icon`}><Icon name='clock' /></span>
                <div className={`${variant}-daily-summary`}>
                    <span className={`${variant}-daily-title`}>Tiempo total hoy</span>
                    <strong aria-label={`${hours} horas, ${minutes} minutos, ${seconds} segundos`}>
                        <span className={`${variant}-daily-duration`} aria-hidden='true'>
                            {hours > 0 && <span>{hours} <small>h</small></span>}
                            {(minutes > 0 || hours > 0 || seconds === 0) && <span>{minutes} <small>min</small></span>}
                            {seconds > 0 && <span>{seconds} <small>s</small></span>}
                        </span>
                    </strong>
                    <span className={`${variant}-daily-caption`}>
                        {totalTodaySeconds === 0 ? 'Tu primera sesión te espera.' : 'Tiempo dedicado a tus sesiones.'}
                    </span>
                </div>
                <p className={`${variant}-daily-note`}><Icon name='leaf' />Enfocarte también<br />es avanzar.</p>
            </footer>
        )
    }
    return (
        <footer className='app-footer'>
            <span>Tiempo total hoy: {formatTime(totalTodaySeconds)}</span>
        </footer>
    )
}

import { formatTime } from '../utils/time'
import { Icon } from './Icon'

type FooterProps = {
    variant?: 'default' | 'editorial'
    totalTodaySeconds: number
}

export function Footer({ totalTodaySeconds, variant = 'default' }: FooterProps) {
    if (variant === 'editorial') {
        return (
            <footer className='app-footer editorial-daily'>
                <span className='editorial-daily-icon'><Icon name='clock' /></span>
                <div><span>Tiempo total hoy</span><strong>{formatTime(totalTodaySeconds)}</strong></div>
                <p><Icon name='leaf' />Enfocarte también<br />es avanzar.</p>
            </footer>
        )
    }
    return (
        <footer className='app-footer'>
            <span>Tiempo total hoy: {formatTime(totalTodaySeconds)}</span>
        </footer>
    )
}

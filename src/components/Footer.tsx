import { formatTime } from '../utils/time'

type FooterProps = {
    totalTodaySeconds: number
}

export function Footer({ totalTodaySeconds }: FooterProps) {
    return (
        <footer className='app-footer'>
            <span>Tiempo total hoy: {formatTime(totalTodaySeconds)}</span>
        </footer>
    )
}
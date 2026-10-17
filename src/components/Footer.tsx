import { Icon } from './Icon'

type FooterProps = {
    totalTodaySeconds: number
}

export function Footer({ totalTodaySeconds }: FooterProps) {
    const hours = Math.floor(totalTodaySeconds / 3600)
    const minutes = Math.floor((totalTodaySeconds % 3600) / 60)
    const seconds = totalTodaySeconds % 60

    return (
        <footer className='app-footer editorial-daily'>
            <span className='editorial-daily-icon'><Icon name='clock' /></span>
            <div className='editorial-daily-summary'>
                <span className='editorial-daily-title'>Tiempo total hoy</span>
                <strong aria-label={`${hours} horas, ${minutes} minutos, ${seconds} segundos`}>
                    <span className='editorial-daily-duration' aria-hidden='true'>
                        {hours > 0 && <span>{hours} <small>h</small></span>}
                        {(minutes > 0 || hours > 0 || seconds === 0) && <span>{minutes} <small>min</small></span>}
                        {seconds > 0 && <span>{seconds} <small>s</small></span>}
                    </span>
                </strong>
                <span className='editorial-daily-caption'>
                    {totalTodaySeconds === 0 ? 'Tu primera sesión te espera.' : 'Tiempo dedicado a tus sesiones.'}
                </span>
            </div>
            <p className='editorial-daily-note'><Icon name='leaf' />Enfocarte también<br />es avanzar.</p>
        </footer>
    )
}

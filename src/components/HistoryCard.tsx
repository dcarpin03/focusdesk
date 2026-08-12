import type { StudySession } from "../types";

type HistoryCardProps = {
    sessions: StudySession[]
    formatTime: (seconds: number) => string
}

export function HistoryCard({ sessions, formatTime }: HistoryCardProps) {
    return (
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
              {sessions.length === 0 ? (
                <li className='history-empty'>Todavía no hay sesiones guardadas.</li>
              ) : (
                  sessions.map((session) => (
                    <li className="history-item" key={session.id}>
                      <span className="history-dot"></span>
                      <span className="history-name">{session.name}</span>
                      <span className="history-duration">{formatTime(session.durationSeconds)}</span>
                      <span className="history-date">{session.date}</span>
                    </li>
                  ))
              )}
            </ul>
          </section>
    )
}
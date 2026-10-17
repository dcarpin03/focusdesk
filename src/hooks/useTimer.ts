import { useCallback, useEffect, useRef, useState } from 'react'

export const POMODORO_MINUTES = [25, 45, 50] as const

export function useTimer() {
  const [durationMinutes, setDurationMinutes] = useState<number>(25)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const startTimeRef = useRef<number | null>(null)
  const durationSeconds = durationMinutes * 60

  const readElapsed = useCallback(() => startTimeRef.current === null ? 0 : Math.min(
    durationSeconds,
    Math.max(0, Math.floor((Date.now() - startTimeRef.current) / 1000))
  ), [durationSeconds])

  useEffect(() => {
    if (!isRunning) return
    const update = () => {
      if (startTimeRef.current !== null) {
        setElapsedSeconds(readElapsed())
      }
    }
    update()
    const interval = window.setInterval(update, 250)
    window.addEventListener('focus', update)
    document.addEventListener('visibilitychange', update)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', update)
      document.removeEventListener('visibilitychange', update)
    }
  }, [isRunning, readElapsed])

  const changeDuration = (minutes: number) => {
    if (startTimeRef.current !== null || !POMODORO_MINUTES.some((value) => value === minutes)) return
    setDurationMinutes(minutes)
    setElapsedSeconds(0)
  }

  const startTimer = () => {
    if (startTimeRef.current !== null) return
    startTimeRef.current = Date.now()
    setElapsedSeconds(0)
    setIsRunning(true)
  }

  // Claim completion synchronously: a concurrent click/effect cannot save twice.
  const stopTimer = () => {
    if (startTimeRef.current === null) return null
    const studiedSeconds = readElapsed()
    startTimeRef.current = null
    setIsRunning(false)
    setElapsedSeconds(0)
    return studiedSeconds
  }

  return { durationMinutes, changeDuration, remainingSeconds: durationSeconds - elapsedSeconds, isRunning, startTimer, stopTimer }
}

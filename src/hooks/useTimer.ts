import { useEffect, useRef, useState } from "react";

export function useTimer() {
    const [elapsedSeconds, setElapsedSeconds] = useState(0) 
    const [isRunning, setIsRunning] = useState(false)

    //Guardamos el momento en que comenzó la sesión
    const startTimeRef = useRef<number | null>(null)

    useEffect(() => {
        if(!isRunning){
            return
        }

        updateTimer()

        const intervalId = window.setInterval(updateTimer, 1000)

        return () => window.clearInterval(intervalId)
    }, [isRunning])

    const updateTimer = () => {
      if (startTimeRef.current === null) return

      const seconds = Math.max(
        0,
        Math.floor((Date.now() - startTimeRef.current) / 1000)
      )

      setElapsedSeconds(seconds)
    }

    const startTimer = () => {
        if (isRunning) return

        startTimeRef.current = Date.now()
        setElapsedSeconds(0)
        setIsRunning(true)
    }

    const stopTimer = () => {
        if (startTimeRef.current !== null) {
        const seconds = Math.max(
            0,
            Math.floor((Date.now() - startTimeRef.current) / 1000)
        )

        setElapsedSeconds(seconds)
        }

        setIsRunning(false)
    }

    const resetTimer = () => {
        startTimeRef.current = null
        setElapsedSeconds(0)
        setIsRunning(false)
    }

    return {
        elapsedSeconds,
        isRunning,
        startTimer,
        stopTimer,
        resetTimer
    }
}
import { useEffect, useState } from "react";

export function useTimer() {
    const [elapsedSeconds, setElapsedSeconds] = useState(0) 
    const [isRunning, setIsRunning] = useState(false)

    useEffect(() => {
        if(!isRunning){
        return
        }

        const intervalId = window.setInterval(() => {
        setElapsedSeconds((currentSeconds) => currentSeconds + 1)
        }, 1000)

        return () => {
        window.clearInterval(intervalId)
        }
    }, [isRunning])

    const startTimer = () => {
        setIsRunning(true)
    }

    const stopTimer = () => {
        setIsRunning(false)
    }

    const resetTimer = () => {
        setElapsedSeconds(0)
    }

    return {
        elapsedSeconds,
        isRunning,
        startTimer,
        stopTimer,
        resetTimer
    }
}
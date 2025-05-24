import { useState, useEffect, useRef, useCallback } from 'react'

export interface BreathingPattern {
    name: string
    description: string
    inspiration: number
    retention: number
    expiration: number
}

export type BreathingPhase = 'inspiration' | 'retention' | 'expiration'

export interface UseBreathingTimerProps {
    pattern: BreathingPattern
    isRunning: boolean
    totalDurationMinutes: number
    onComplete?: () => void
}

export interface UseBreathingTimerReturn {
    phase: BreathingPhase
    timeRemaining: number
    cycleCount: number
    elapsedTime: number
    progress: number
    reset: () => void
}

export const useBreathingTimer = ({
    pattern,
    isRunning,
    totalDurationMinutes,
    onComplete,
}: UseBreathingTimerProps): UseBreathingTimerReturn => {
    // Single state: seconds elapsed since the beginning
    const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    // Memoize onComplete function
    const memoizedOnComplete = useCallback(() => {
        onComplete?.()
    }, [onComplete])

    // Reset when pattern changes
    useEffect(() => {
        console.log('Pattern changé:', pattern.name)
        setTotalSecondsElapsed(0)
    }, [pattern.name])

    // Main timer management
    useEffect(() => {
        if (isRunning) {
            console.log('Démarrage timer pour pattern:', pattern.name)

            intervalRef.current = setInterval(() => {
                setTotalSecondsElapsed(prev => prev + 1)
            }, 1000)
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }
    }, [isRunning, pattern.name])

    // Calculate all derived values from total time
    const getCycleInfo = () => {
        const cycleDuration = pattern.inspiration + pattern.retention + pattern.expiration
        const cycleCount = Math.floor(totalSecondsElapsed / cycleDuration)
        const secondsInCurrentCycle = totalSecondsElapsed % cycleDuration

        let phase: BreathingPhase
        let timeRemaining: number

        if (secondsInCurrentCycle < pattern.inspiration) {
            // Inspiration phase
            phase = 'inspiration'
            timeRemaining = pattern.inspiration - secondsInCurrentCycle
        } else if (secondsInCurrentCycle < pattern.inspiration + pattern.retention) {
            // Retention phase if greater than 0
            phase = 'retention'
            timeRemaining = pattern.inspiration + pattern.retention - secondsInCurrentCycle
        } else {
            // Expiration phase
            phase = 'expiration'
            timeRemaining = cycleDuration - secondsInCurrentCycle
        }

        // Check if exercise is complete
        const targetCycles = Math.floor((totalDurationMinutes * 60) / cycleDuration)
        if (cycleCount >= targetCycles && isRunning) {
            console.log('Exercice terminé!')
            memoizedOnComplete()
        }

        return {
            phase,
            timeRemaining: Math.max(1, timeRemaining), // Minimum 1 to avoid displaying 0
            cycleCount,
        }
    }

    const { phase, timeRemaining, cycleCount } = getCycleInfo()

    const reset = useCallback(() => {
        setTotalSecondsElapsed(0)
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }, [])

    const progress = Math.min((totalSecondsElapsed / (totalDurationMinutes * 60)) * 100, 100)

    // Debug logging
    useEffect(() => {
        if (isRunning) {
            console.log(`Phase: ${phase}, Temps restant: ${timeRemaining}, Cycle: ${cycleCount}, Pattern: ${pattern.name}`)
        }
    }, [phase, timeRemaining, cycleCount, pattern.name, isRunning])

    return {
        phase,
        timeRemaining,
        cycleCount,
        elapsedTime: totalSecondsElapsed * 1000, // Convert to milliseconds for compatibility
        progress,
        reset,
    }
} 
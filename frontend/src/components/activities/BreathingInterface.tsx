import React from 'react'
import type { BreathingPattern, BreathingPhase } from '@/hooks/useBreathingTimer'

interface BreathingInterfaceProps {
	pattern: BreathingPattern
	phase: BreathingPhase
	timeRemaining: number
	cycleCount: number
	elapsedTime: number
	progress: number
	totalDuration: number
	isRunning: boolean
	onStart: () => void
	onStop: () => void
	onReset: () => void
}

const BreathingInterface: React.FC<BreathingInterfaceProps> = ({
	pattern,
	phase,
	timeRemaining,
	cycleCount,
	elapsedTime,
	progress,
	totalDuration,
	isRunning,
	onStart,
	onStop,
	onReset,
}) => {
	const formatTime = (ms: number): string => {
		const seconds = Math.floor(ms / 1000)
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
	}

	const getPhaseText = (): string => {
		switch (phase) {
			case 'inspiration':
				return 'Inspirez'
			case 'retention':
				return 'Retenez'
			case 'expiration':
				return 'Expirez'
			default:
				return 'Inspirez'
		}
	}

	const getPhaseColor = (): string => {
		switch (phase) {
			case 'inspiration':
				return 'text-blue-600'
			case 'retention':
				return 'text-yellow-600'
			case 'expiration':
				return 'text-green-600'
			default:
				return 'text-blue-600'
		}
	}

	const getCircleScale = (): string => {
		switch (phase) {
			case 'inspiration':
				return 'scale-110'
			case 'retention':
				return 'scale-110'
			case 'expiration':
				return 'scale-90'
			default:
				return 'scale-100'
		}
	}

	const getCircleBorder = (): string => {
		switch (phase) {
			case 'inspiration':
				return 'border-blue-400 shadow-blue-400/30'
			case 'retention':
				return 'border-yellow-400 shadow-yellow-400/30'
			case 'expiration':
				return 'border-green-400 shadow-green-400/30'
			default:
				return 'border-blue-400 shadow-blue-400/30'
		}
	}

	const getGradientBackground = (): string => {
		switch (phase) {
			case 'inspiration':
				return 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(59, 130, 246, 0.02) 100%)'
			case 'retention':
				return 'radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.05) 50%, rgba(251, 191, 36, 0.02) 100%)'
			case 'expiration':
				return 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 50%, rgba(34, 197, 94, 0.02) 100%)'
			default:
				return 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(59, 130, 246, 0.02) 100%)'
		}
	}

	return (
		<div className='space-y-8'>
			{/* Main exercise interface */}
			<div className='text-center'>
				{/* Animated breathing circle */}
				<div className='relative mb-8'>
					<div
						className={`w-80 h-80 mx-auto rounded-full border-8 transition-all duration-1000 ease-in-out ${
							isRunning ? getCircleScale() : 'scale-100'
						} ${getCircleBorder()} shadow-2xl relative overflow-hidden`}
						style={{
							background: getGradientBackground(),
						}}
					>
						{/* Pulse effect */}
						{isRunning && (
							<div
								className={`absolute inset-0 rounded-full border-4 animate-ping ${getCircleBorder()}`}
							></div>
						)}

						{/* Central content */}
						<div className='absolute inset-0 flex flex-col items-center justify-center z-10'>
							<div
								className={`text-6xl font-bold mb-3 transition-colors duration-500 ${getPhaseColor()}`}
							>
								{timeRemaining}
							</div>
							<div
								className={`text-2xl font-semibold mb-2 transition-colors duration-500 ${getPhaseColor()}`}
							>
								{getPhaseText()}
							</div>
							<div className='text-lg text-fr-grey'>Cycle {cycleCount}</div>
							<div className='text-sm text-fr-grey mt-2'>
								{pattern.name} • {formatTime(elapsedTime)}
							</div>
						</div>
					</div>
				</div>

				{/* Main controls */}
				<div className='flex justify-center gap-6 mb-8'>
					<button
						onClick={isRunning ? onStop : onStart}
						className={`px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
							isRunning
								? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
								: 'bg-gradient-to-r from-fr-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
						}`}
					>
						{isRunning ? '⏹️ Arrêter' : '▶️ Commencer'}
					</button>
					<button
						onClick={onReset}
						className='px-8 py-4 rounded-2xl border-2 border-fr-grey hover:border-fr-blue text-fr-grey hover:text-fr-blue transition-all duration-300 font-semibold bg-white/80 backdrop-blur-sm shadow-lg transform hover:scale-105'
					>
						🔄 Reset
					</button>
				</div>

				{/* Real-time statistics */}
				<div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-8'>
					<div className='bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20'>
						<div className='text-4xl font-bold text-fr-blue mb-2'>{cycleCount}</div>
						<div className='text-sm text-fr-grey font-medium'>Cycles complétés</div>
					</div>
					<div className='bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20'>
						<div className='text-4xl font-bold text-green-600 mb-2'>
							{formatTime(elapsedTime)}
						</div>
						<div className='text-sm text-fr-grey font-medium'>Temps écoulé</div>
					</div>
					<div className='bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20'>
						<div className='text-4xl font-bold text-purple-600 mb-2'>
							{totalDuration}min
						</div>
						<div className='text-sm text-fr-grey font-medium'>Durée totale</div>
					</div>
					<div className='bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20'>
						<div className='text-4xl font-bold text-yellow-600 mb-2'>
							{Math.round(progress)}%
						</div>
						<div className='text-sm text-fr-grey font-medium'>Progression</div>
					</div>
				</div>

				{/* Global progress bar */}
				<div className='bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20'>
					<div className='flex justify-between items-center mb-3'>
						<span className='text-sm font-medium text-fr-grey-dark'>
							Progression de la séance
						</span>
						<span className='text-sm font-bold text-fr-blue'>
							{Math.round(progress)}%
						</span>
					</div>
					<div className='bg-fr-grey-light rounded-full h-4 overflow-hidden shadow-inner'>
						<div
							className='h-full bg-gradient-to-r from-fr-blue via-purple-500 to-green-500 transition-all duration-1000 ease-out rounded-full shadow-md'
							style={{ width: `${progress}%` }}
						></div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default BreathingInterface

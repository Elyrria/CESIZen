import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import type { IActivity } from '@/factories/Factory'

interface BreathingPattern {
	name: string
	description: string
	inspiration: number
	retention: number
	expiration: number
}

interface HeartCoherenceParameters {
	breathingPatterns?: BreathingPattern[]
	defaultPattern?: string
	recommendedDuration?: number
	benefits?: string[]
	instructions?: {
		before?: string
		during?: string
		after?: string
	}
}

interface HeartCoherenceActivity extends IActivity {
	parameters?: HeartCoherenceParameters
}

interface HeartCoherenceExerciseProps {
	activity: HeartCoherenceActivity
}

const HeartCoherenceExercise: React.FC<HeartCoherenceExerciseProps> = ({ activity }) => {
	// Safe fallback patterns
	const fallbackPatterns: BreathingPattern[] = [
		{
			name: '55',
			description: 'Inspiration : 5 secondes / Expiration : 5 secondes',
			inspiration: 5,
			retention: 0,
			expiration: 5,
		},
		{
			name: '748',
			description: 'Inspiration : 7 secondes / Apnée : 4 secondes / Expiration : 8 secondes',
			inspiration: 7,
			retention: 4,
			expiration: 8,
		},
		{
			name: '46',
			description: 'Inspiration : 4 secondes / Expiration : 6 secondes',
			inspiration: 4,
			retention: 0,
			expiration: 6,
		},
	]

	// Extract patterns from API data safely
	const getApiPatterns = (): BreathingPattern[] => {
		try {
			if (
				activity?.parameters?.breathingPatterns &&
				Array.isArray(activity.parameters.breathingPatterns)
			) {
				return activity.parameters.breathingPatterns.map((pattern: BreathingPattern) => ({
					name: pattern.name || '55',
					description: pattern.description || 'Pattern de respiration',
					inspiration: Number(pattern.inspiration) || 5,
					retention: Number(pattern.retention) || 0,
					expiration: Number(pattern.expiration) || 5,
				}))
			}
		} catch (error) {
			console.error('Erreur parsing patterns API:', error)
		}
		return []
	}

	const apiPatterns = getApiPatterns()
	const availablePatterns = apiPatterns.length > 0 ? apiPatterns : fallbackPatterns

	// Main states
	const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(() => {
		const defaultName = activity?.parameters?.defaultPattern
		return availablePatterns.find((p) => p.name === defaultName) || availablePatterns[0]
	})

	const [isRunning, setIsRunning] = useState(false)
	const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
	const [timeRemaining, setTimeRemaining] = useState(0)
	const [cycleCount, setCycleCount] = useState(0)
	const [totalDuration, setTotalDuration] = useState(() => {
		const recommended = activity?.parameters?.recommendedDuration
		return recommended ? Math.floor(recommended / 60) : 5 // En minutes
	})
	const [elapsedTime, setElapsedTime] = useState(0)

	const intervalRef = useRef<NodeJS.Timeout | null>(null)
	const startTimeRef = useRef<number>(0)

	const startExercise = () => {
		setIsRunning(true)
		setCycleCount(0)
		setElapsedTime(0)
		setCurrentPhase('inhale')
		setTimeRemaining(selectedPattern.inspiration)
		startTimeRef.current = Date.now()

		intervalRef.current = setInterval(() => {
			setElapsedTime(Date.now() - startTimeRef.current)

			setTimeRemaining((prev) => {
				if (prev <= 1) {
					setCurrentPhase((currentPhase) => {
						if (currentPhase === 'inhale' && selectedPattern.retention > 0) {
							setTimeRemaining(selectedPattern.retention)
							return 'hold'
						} else if (
							(currentPhase === 'inhale' &&
								selectedPattern.retention === 0) ||
							currentPhase === 'hold'
						) {
							setTimeRemaining(selectedPattern.expiration)
							return 'exhale'
						} else {
							setCycleCount((count) => {
								const newCount = count + 1
								const totalCycleTime =
									selectedPattern.inspiration +
									selectedPattern.retention +
									selectedPattern.expiration
								const targetCycles = Math.floor(
									(totalDuration * 60) / totalCycleTime
								)

								if (newCount >= targetCycles) {
									stopExercise()
									toast.success(
										'🎉 Exercice terminé ! Félicitations pour cette séance de cohérence cardiaque !',
										{
											position: 'top-center',
											autoClose: 5000,
										}
									)
								}
								return newCount
							})
							setTimeRemaining(selectedPattern.inspiration)
							return 'inhale'
						}
					})
					return selectedPattern.inspiration
				}
				return prev - 1
			})
		}, 1000)
	}

	const stopExercise = () => {
		setIsRunning(false)
		if (intervalRef.current) {
			clearInterval(intervalRef.current)
		}
	}

	const resetExercise = () => {
		stopExercise()
		setCurrentPhase('inhale')
		setTimeRemaining(0)
		setCycleCount(0)
		setElapsedTime(0)
	}

	// Cleanup only
	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
		}
	}, [])

	const getPhaseText = () => {
		switch (currentPhase) {
			case 'inhale':
				return 'Inspirez'
			case 'hold':
				return 'Retenez'
			case 'exhale':
				return 'Expirez'
		}
	}

	const getPhaseColor = () => {
		switch (currentPhase) {
			case 'inhale':
				return 'text-blue-600'
			case 'hold':
				return 'text-yellow-600'
			case 'exhale':
				return 'text-green-600'
		}
	}

	const getCircleScale = () => {
		switch (currentPhase) {
			case 'inhale':
				return 'scale-110'
			case 'hold':
				return 'scale-110'
			case 'exhale':
				return 'scale-90'
		}
	}

	const getCircleBorder = () => {
		switch (currentPhase) {
			case 'inhale':
				return 'border-blue-400 shadow-blue-400/30'
			case 'hold':
				return 'border-yellow-400 shadow-yellow-400/30'
			case 'exhale':
				return 'border-green-400 shadow-green-400/30'
		}
	}

	const getGradientBackground = () => {
		switch (currentPhase) {
			case 'inhale':
				return 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(59, 130, 246, 0.02) 100%)'
			case 'hold':
				return 'radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.05) 50%, rgba(251, 191, 36, 0.02) 100%)'
			case 'exhale':
				return 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 50%, rgba(34, 197, 94, 0.02) 100%)'
		}
	}

	const formatTime = (ms: number): string => {
		const seconds = Math.floor(ms / 1000)
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
	}

	const getProgress = (): number => {
		const totalTime = totalDuration * 60 * 1000
		return Math.min((elapsedTime / totalTime) * 100, 100)
	}

	return (
		<div className='bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 rounded-xl p-8 min-h-[800px]'>
			{/* En-tête avec informations de l'activité */}
			<div className='text-center mb-8'>
				<h2 className='text-3xl font-bold text-fr-blue mb-4 flex items-center justify-center gap-3'>
					<span className='text-4xl'>❤️</span>
					{activity.name}
				</h2>
				<p className='text-fr-grey-dark max-w-2xl mx-auto leading-relaxed'>
					{activity.content ||
						'Exercice de cohérence cardiaque pour réduire le stress et améliorer votre bien-être.'}
				</p>
			</div>

			{/* Bénéfices de l'exercice */}
			{activity.parameters?.benefits && Array.isArray(activity.parameters.benefits) && (
				<div className='bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg border border-white/20'>
					<h3 className='text-lg font-semibold text-fr-blue mb-4 flex items-center gap-2'>
						✨ Bénéfices de cet exercice
					</h3>
					<ul className='grid grid-cols-1 md:grid-cols-2 gap-3'>
						{activity.parameters.benefits.map((benefit: string, index: number) => (
							<li
								key={index}
								className='flex items-center gap-3 text-fr-grey-dark'
							>
								<span className='text-green-500 text-lg'>✓</span>
								{benefit}
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Instructions */}
			{activity.parameters?.instructions && (
				<div className='bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg border border-white/20'>
					<h3 className='text-lg font-semibold text-fr-blue mb-4 flex items-center gap-2'>
						📋 Instructions
					</h3>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-sm'>
						{activity.parameters.instructions.before && (
							<div className='bg-blue-50/80 rounded-lg p-4'>
								<h4 className='font-medium text-blue-700 mb-2 flex items-center gap-2'>
									🧘‍♀️ Avant l'exercice
								</h4>
								<p className='text-fr-grey-dark'>
									{activity.parameters.instructions.before}
								</p>
							</div>
						)}
						{activity.parameters.instructions.during && (
							<div className='bg-yellow-50/80 rounded-lg p-4'>
								<h4 className='font-medium text-yellow-700 mb-2 flex items-center gap-2'>
									🫁 Pendant l'exercice
								</h4>
								<p className='text-fr-grey-dark'>
									{activity.parameters.instructions.during}
								</p>
							</div>
						)}
						{activity.parameters.instructions.after && (
							<div className='bg-green-50/80 rounded-lg p-4'>
								<h4 className='font-medium text-green-700 mb-2 flex items-center gap-2'>
									🌟 Après l'exercice
								</h4>
								<p className='text-fr-grey-dark'>
									{activity.parameters.instructions.after}
								</p>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Sélection du pattern */}
			<div className='bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg border border-white/20'>
				<h3 className='text-lg font-semibold text-fr-blue mb-4'>
					🎵 Choisissez votre rythme de respiration
				</h3>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{availablePatterns.map((pattern) => (
						<button
							key={pattern.name}
							onClick={() => !isRunning && setSelectedPattern(pattern)}
							disabled={isRunning}
							className={`p-5 rounded-xl border-2 transition-all duration-300 text-left transform hover:scale-105 ${
								selectedPattern.name === pattern.name
									? 'border-fr-blue bg-gradient-to-br from-fr-blue/10 to-fr-blue/5 shadow-lg'
									: 'border-fr-grey-light bg-white hover:border-fr-blue/50 hover:bg-fr-blue/5 shadow-md'
							} ${
								isRunning
									? 'opacity-50 cursor-not-allowed'
									: 'cursor-pointer'
							}`}
						>
							<div className='font-bold text-fr-blue mb-2 text-lg'>
								{pattern.name}
							</div>
							<div className='text-sm text-fr-grey-dark mb-3 line-height-relaxed'>
								{pattern.description}
							</div>
							<div className='text-xs text-fr-grey flex items-center gap-4'>
								<span className='bg-blue-100 text-blue-700 px-2 py-1 rounded-full'>
									Inspire: {pattern.inspiration}s
								</span>
								{pattern.retention > 0 && (
									<span className='bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full'>
										Pause: {pattern.retention}s
									</span>
								)}
								<span className='bg-green-100 text-green-700 px-2 py-1 rounded-full'>
									Expire: {pattern.expiration}s
								</span>
							</div>
						</button>
					))}
				</div>
			</div>

			{/* Configuration durée */}
			<div className='bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg border border-white/20'>
				<h3 className='text-lg font-semibold text-fr-blue mb-4'>⏱️ Durée de l'exercice</h3>
				<div className='flex items-center gap-4'>
					<span className='text-fr-grey-dark'>Durée :</span>
					<div className='flex gap-2'>
						{[3, 5, 10, 15].map((minutes) => (
							<button
								key={minutes}
								onClick={() => !isRunning && setTotalDuration(minutes)}
								disabled={isRunning}
								className={`px-4 py-2 rounded-lg transition-all ${
									totalDuration === minutes
										? 'bg-fr-blue text-white'
										: 'bg-fr-grey-light text-fr-grey-dark hover:bg-fr-blue/10'
								} ${
									isRunning
										? 'opacity-50 cursor-not-allowed'
										: 'cursor-pointer'
								}`}
							>
								{minutes} min
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Interface d'exercice principale */}
			<div className='text-center'>
				{/* Cercle de respiration animé */}
				<div className='relative mb-8'>
					<div
						className={`w-80 h-80 mx-auto rounded-full border-8 transition-all duration-1000 ease-in-out ${
							isRunning ? getCircleScale() : 'scale-100'
						} ${getCircleBorder()} shadow-2xl relative overflow-hidden`}
						style={{
							background: getGradientBackground(),
						}}
					>
						{/* Effet de pulsation */}
						{isRunning && (
							<div
								className={`absolute inset-0 rounded-full border-4 animate-ping ${getCircleBorder()}`}
							></div>
						)}

						{/* Contenu central */}
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
								{selectedPattern.name} • {formatTime(elapsedTime)}
							</div>
						</div>
					</div>
				</div>

				{/* Contrôles principaux */}
				<div className='flex justify-center gap-6 mb-8'>
					<button
						onClick={isRunning ? stopExercise : startExercise}
						className={`px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
							isRunning
								? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
								: 'bg-gradient-to-r from-fr-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
						}`}
					>
						{isRunning ? '⏹️ Arrêter' : '▶️ Commencer'}
					</button>
					<button
						onClick={resetExercise}
						className='px-8 py-4 rounded-2xl border-2 border-fr-grey hover:border-fr-blue text-fr-grey hover:text-fr-blue transition-all duration-300 font-semibold bg-white/80 backdrop-blur-sm shadow-lg transform hover:scale-105'
					>
						🔄 Reset
					</button>
				</div>

				{/* Statistiques en temps réel */}
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
							{Math.round(getProgress())}%
						</div>
						<div className='text-sm text-fr-grey font-medium'>Progression</div>
					</div>
				</div>

				{/* Barre de progression globale */}
				<div className='bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20'>
					<div className='flex justify-between items-center mb-3'>
						<span className='text-sm font-medium text-fr-grey-dark'>
							Progression de la séance
						</span>
						<span className='text-sm font-bold text-fr-blue'>
							{Math.round(getProgress())}%
						</span>
					</div>
					<div className='bg-fr-grey-light rounded-full h-4 overflow-hidden shadow-inner'>
						<div
							className='h-full bg-gradient-to-r from-fr-blue via-purple-500 to-green-500 transition-all duration-1000 ease-out rounded-full shadow-md'
							style={{ width: `${getProgress()}%` }}
						></div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default HeartCoherenceExercise

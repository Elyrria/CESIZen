import React, { useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import type { IActivity } from '@/factories/Factory'
import { useBreathingTimer, type BreathingPattern } from '@/hooks/useBreathingTimer'
import BreathingInterface from './BreathingInterface'

interface ApiBreathingPattern {
	name?: string
	description?: string
	inspiration?: number | string
	retention?: number | string
	expiration?: number | string
}

interface HeartCoherenceParameters {
	breathingPatterns?: ApiBreathingPattern[]
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
	// Default breathing patterns configuration
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

	// Safe extraction of patterns from API data
	const getApiPatterns = (): BreathingPattern[] => {
		try {
			if (
				activity?.parameters?.breathingPatterns &&
				Array.isArray(activity.parameters.breathingPatterns)
			) {
				return activity.parameters.breathingPatterns.map((pattern: ApiBreathingPattern) => ({
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

	const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(() => {
		const defaultName = activity?.parameters?.defaultPattern
		return availablePatterns.find((p) => p.name === defaultName) || availablePatterns[0]
	})

	const [totalDuration, setTotalDuration] = useState(() => {
		const recommended = activity?.parameters?.recommendedDuration
		return recommended ? Math.floor(recommended / 60) : 5 // In minutes
	})

	const [isRunning, setIsRunning] = useState(false)

	// Stabilize onComplete function with useCallback
	const handleComplete = useCallback(() => {
		setIsRunning(false)
		toast.success('🎉 Exercice terminé ! Félicitations pour cette séance de cohérence cardiaque !', {
			position: 'top-center',
			autoClose: 5000,
		})
	}, []) // No dependencies because setIsRunning and toast are stable

	// Use custom hook for timer management
	const timerData = useBreathingTimer({
		pattern: selectedPattern,
		isRunning,
		totalDurationMinutes: totalDuration,
		onComplete: handleComplete,
	})

	// Event handlers
	const handleStart = () => {
		console.log('Démarrage avec pattern:', selectedPattern.name)
		setIsRunning(true)
	}

	const handleStop = () => {
		console.log('Arrêt exercice')
		setIsRunning(false)
	}

	const handleReset = () => {
		console.log('Reset exercice')
		setIsRunning(false)
		timerData.reset()
	}

	const handlePatternChange = (pattern: BreathingPattern) => {
		console.log('Changement de pattern vers:', pattern.name)
		if (isRunning) {
			setIsRunning(false)
		}
		setSelectedPattern(pattern)
	}

	return (
		<div className='bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 rounded-xl p-8 min-h-[800px]'>
			{/* Header with activity information */}
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

			{/* Exercise benefits */}
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

			{/* Breathing pattern selection */}
			<div className='bg-white/90 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg border border-white/20'>
				<h3 className='text-lg font-semibold text-fr-blue mb-4'>
					🎵 Choisissez votre rythme de respiration
				</h3>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{availablePatterns.map((pattern) => (
						<button
							key={pattern.name}
							onClick={() => !isRunning && handlePatternChange(pattern)}
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

			{/* Duration configuration */}
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

			{/* Breathing interface */}
			<BreathingInterface
				pattern={selectedPattern}
				phase={timerData.phase}
				timeRemaining={timerData.timeRemaining}
				cycleCount={timerData.cycleCount}
				elapsedTime={timerData.elapsedTime}
				progress={timerData.progress}
				totalDuration={totalDuration}
				isRunning={isRunning}
				onStart={handleStart}
				onStop={handleStop}
				onReset={handleReset}
			/>
		</div>
	)
}

export default HeartCoherenceExercise

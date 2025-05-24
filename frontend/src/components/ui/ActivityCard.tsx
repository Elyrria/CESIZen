import React from 'react'
import type { IActivity, ActivityType } from '@/factories/Factory'

interface ActivityCardProps {
	activity: IActivity
	categoryLabel: string
	onClick?: () => void
}

const getActivityIcon = (type: ActivityType): string => {
	switch (type) {
		case 'TEXT':
			return '📝'
		case 'VIDEO':
			return '🎥'
		default:
			return '💚'
	}
}

const getMiniatureUrl = (activity: IActivity): string | undefined => {
	if (activity.type === 'VIDEO' && activity.thumbnailUrl) return activity.thumbnailUrl
	if (activity.thumbnailUrl) return activity.thumbnailUrl
	if (activity.mediaUrl) return activity.mediaUrl
	return undefined
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, categoryLabel, onClick }) => {
	const miniature = getMiniatureUrl(activity)
	const typeLabels: Record<ActivityType, string> = {
		TEXT: 'Exercice',
		VIDEO: 'Vidéo',
	}

	// Heart coherence activity detection
	const isHeartCoherenceActivity =
		activity.name.toLowerCase().includes('cohérence') ||
		activity.name.toLowerCase().includes('respiration') ||
		activity.name.toLowerCase().includes('cardiaque')

	// Function to truncate text
	const truncateText = (text: string, maxLength: number): string => {
		if (text.length <= maxLength) return text
		return text.substring(0, maxLength) + '...'
	}

	return (
		<div className='bg-white rounded-lg shadow-md p-4 flex flex-col h-full hover:shadow-lg transition-shadow cursor-pointer'>
			{/* Thumbnail or icon */}
			<div className='w-full h-40 bg-fr-grey-light/20 rounded mb-3 flex items-center justify-center relative overflow-hidden'>
				{miniature ? (
					<img
						src={miniature}
						alt={activity.name}
						className='w-full h-full object-cover'
						onError={(e) => {
							const target = e.target as HTMLImageElement
							target.style.display = 'none'
							const parent = target.parentElement
							if (parent) {
								const iconDiv = document.createElement('div')
								iconDiv.className = 'text-4xl'
								iconDiv.textContent = getActivityIcon(activity.type)
								parent.appendChild(iconDiv)
							}
						}}
					/>
				) : (
					<div className='text-4xl'>{getActivityIcon(activity.type)}</div>
				)}

				{/* Type badge */}
				<div className='absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-medium text-fr-blue'>
					{typeLabels[activity.type]}
				</div>

				{/* Special badge for heart coherence */}
				{isHeartCoherenceActivity && (
					<div className='absolute top-2 left-2 bg-green-500/90 text-white px-2 py-1 rounded text-xs font-medium'>
						❤️ Recommandé
					</div>
				)}
			</div>

			{/* Content */}
			<h3
				className='text-lg font-bold text-fr-blue mb-2'
				style={{
					display: '-webkit-box',
					WebkitLineClamp: 2,
					WebkitBoxOrient: 'vertical',
					overflow: 'hidden',
				}}
			>
				{activity.name}
			</h3>

			<p
				className='text-sm text-fr-grey-dark mb-3 flex-1'
				style={{
					display: '-webkit-box',
					WebkitLineClamp: 3,
					WebkitBoxOrient: 'vertical',
					overflow: 'hidden',
				}}
			>
				{activity.descriptionActivity}
			</p>

			{/* Metadata */}
			<div className='flex items-center justify-between mb-3'>
				<span className='text-xs bg-fr-blue/10 text-fr-blue px-2 py-1 rounded-full'>
					{truncateText(categoryLabel, 20)}
				</span>

				{activity.isActive && (
					<span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full'>
						Actif
					</span>
				)}
			</div>

			{/* Action button */}
			<button
				onClick={onClick}
				className='w-full bg-fr-blue text-white py-2 px-4 rounded text-sm font-medium hover:bg-fr-blue/90 transition-colors'
			>
				{isHeartCoherenceActivity ? "❤️ Commencer l'exercice" : "Voir l'activité"}
			</button>
		</div>
	)
}

export default ActivityCard

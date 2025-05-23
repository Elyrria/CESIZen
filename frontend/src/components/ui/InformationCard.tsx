import React from 'react'
import type { IInformation, InformationType } from '@/factories/Factory'

interface InformationCardProps {
	info: IInformation
	categoryLabel: string
	onClick?: () => void
}

const getMiniatureUrl = (info: IInformation): string | undefined => {
	if (info.type === 'IMAGE' && info.mediaUrl) return info.mediaUrl
	if (info.type === 'VIDEO' && info.thumbnailUrl) return info.thumbnailUrl
	if (info.type === 'TEXT' && info.thumbnailUrl) return info.thumbnailUrl
	return undefined
}

const InformationCard: React.FC<InformationCardProps> = ({ info, categoryLabel, onClick }) => {
	const miniature = getMiniatureUrl(info)
	const typeLabels: Record<InformationType, string> = {
		TEXT: 'Texte',
		IMAGE: 'Image',
		VIDEO: 'Vidéo',
	}

	return (
		<div className='bg-white rounded-lg shadow p-4 flex flex-col h-full'>
			{miniature ? (
				<img
					src={miniature}
					alt={info.title}
					className='w-full h-40 object-cover rounded mb-3'
				/>
			) : (
				<div className='w-full h-40 bg-fr-grey-light rounded mb-3 flex items-center justify-center text-fr-grey'>
					Aucune image
				</div>
			)}
			<h2 className='text-lg font-bold text-gray-900 mb-1 truncate'>{info.title}</h2>
			<div className='text-sm text-fr-blue mb-1'>{categoryLabel}</div>
			<div className='text-xs text-fr-grey-dark mb-2'>{typeLabels[info.type]}</div>
			<button
				onClick={onClick}
				className='mt-auto text-fr-blue hover:text-fr-blue-dark font-medium text-sm self-start'
			>
				Voir
			</button>
		</div>
	)
}

export default InformationCard

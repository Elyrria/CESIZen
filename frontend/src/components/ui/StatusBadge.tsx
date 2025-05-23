import React from 'react'

type Status = 'DRAFT' | 'PENDING' | 'PUBLISHED'
type Size = 'sm' | 'md' | 'lg'

interface StatusBadgeProps {
	status: Status
	size?: Size
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
	const statusConfig = {
		DRAFT: {
			label: 'Brouillon',
			bgColor: 'bg-fr-grey-light',
			textColor: 'text-fr-grey-dark',
		},
		PENDING: {
			label: 'En attente',
			bgColor: 'bg-fr-yellow-light',
			textColor: 'text-fr-yellow-dark',
		},
		PUBLISHED: {
			label: 'Publié',
			bgColor: 'bg-fr-green-light',
			textColor: 'text-fr-green-dark',
		},
	}

	const sizeClasses = {
		sm: 'text-xs px-2 py-0.5',
		md: 'text-sm px-3 py-1',
		lg: 'text-base px-4 py-1.5',
	}

	const { label, bgColor, textColor } = statusConfig[status]

	return (
		<span
			className={`
        inline-flex items-center font-medium rounded-full
        ${bgColor} ${textColor} ${sizeClasses[size]}
      `}
		>
			{label}
		</span>
	)
}

export default StatusBadge

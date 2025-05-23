import React from 'react'

interface SearchBarProps {
	label?: string
	value: string
	onChange: (value: string) => void
	placeholder?: string
	className?: string
	onReset?: () => void
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

const SearchBar: React.FC<SearchBarProps> = ({
	label,
	value,
	onChange,
	placeholder = 'Rechercher...',
	className = '',
	onReset,
	onKeyDown,
}) => {
	return (
		<div className={`flex flex-col ${className}`}>
			{label && <label className='fr-label mb-2'>{label}</label>}
			<div className='relative flex items-center'>
				<input
					type='text'
					className='fr-input px-3 py-2 rounded border border-fr-grey-light focus:border-fr-blue focus:outline-none bg-white text-gray-900 w-full pr-10'
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					onKeyDown={onKeyDown}
				/>
				{value && (
					<button
						type='button'
						className='absolute right-2 text-fr-blue hover:text-fr-blue-dark'
						onClick={onReset}
						aria-label='Effacer la recherche'
					>
						×
					</button>
				)}
			</div>
		</div>
	)
}

export default SearchBar

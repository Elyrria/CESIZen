import React from 'react'

export interface SelectOption {
	value: string
	label: string
}

interface SelectProps {
	label?: string
	value: string
	onChange: (value: string) => void
	options: SelectOption[]
	placeholder?: string
	className?: string
	name?: string
	disabled?: boolean
}

const Select: React.FC<SelectProps> = ({
	label,
	value,
	onChange,
	options,
	placeholder = 'Sélectionner...',
	className = '',
	name,
	disabled = false,
}) => {
	return (
		<div className={`flex flex-col ${className}`}>
			{label && <label className='fr-label mb-2'>{label}</label>}
			<select
				className='fr-select px-3 py-2 rounded border border-fr-grey-light focus:border-fr-blue focus:outline-none bg-white text-gray-900'
				value={value}
				onChange={(e) => onChange(e.target.value)}
				name={name}
				disabled={disabled}
			>
				<option value=''>{placeholder}</option>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	)
}

export default Select

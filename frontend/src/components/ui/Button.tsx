import React from 'react'
import { Link } from 'react-router-dom'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode
	className?: string
	to?: string
}

const Button: React.FC<ButtonProps> = ({ children, className = '', type = 'button', to, ...props }) => {
	if (to) {
		return (
			<Link
				to={to}
				className={`fr-btn rounded px-4 py-2 font-medium text-white bg-fr-blue hover:bg-fr-blue-dark transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
				{...(props as any)}
			>
				{children}
			</Link>
		)
	}
	return (
		<button
			type={type}
			className={`fr-btn rounded px-4 py-2 font-medium text-white bg-fr-blue hover:bg-fr-blue-dark transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
			{...props}
		>
			{children}
		</button>
	)
}

export default Button

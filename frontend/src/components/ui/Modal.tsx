import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	title: string
	size?: 'sm' | 'md' | 'lg' | 'xl'
	children: React.ReactNode
	footer?: React.ReactNode
	preventCloseOnBackdrop?: boolean
}

const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	size = 'md',
	children,
	footer,
	preventCloseOnBackdrop = false,
}) => {
	const modalRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose()
		}

		if (isOpen) {
			document.addEventListener('keydown', handleEscape)
			document.body.style.overflow = 'hidden'
		}

		return () => {
			document.removeEventListener('keydown', handleEscape)
			document.body.style.overflow = 'unset'
		}
	}, [isOpen, onClose])

	useEffect(() => {
		if (isOpen && modalRef.current) {
			modalRef.current.focus()
		}
	}, [isOpen])

	if (!isOpen) return null

	const sizeClasses = {
		sm: 'max-w-md',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl',
	}

	return createPortal(
		<div className='fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto'>
			{/* Backdrop */}
			<div
				className='fixed inset-0 bg-black bg-opacity-50 transition-opacity'
				onClick={() => !preventCloseOnBackdrop && onClose()}
				aria-hidden='true'
			/>

			{/* Modal - ✅ FIX: Ajout de margin auto et meilleure gestion responsive */}
			<div
				ref={modalRef}
				className={`
          relative bg-white rounded-lg shadow-fr-md w-full mx-auto my-8
          ${sizeClasses[size]} 
          transform transition-all duration-200 scale-100
          focus:outline-none
          max-h-[calc(100vh-4rem)]
          flex flex-col
        `}
				role='dialog'
				aria-modal='true'
				aria-labelledby='modal-title'
				tabIndex={-1}
			>
				{/* Header - ✅ FIX: Sticky header */}
				<div className='flex items-center justify-between p-6 border-b border-fr-grey-light bg-white rounded-t-lg flex-shrink-0'>
					<h3 id='modal-title' className='text-xl font-bold text-fr-blue'>
						{title}
					</h3>
					<button
						onClick={onClose}
						className='text-fr-grey-dark hover:text-fr-blue focus:outline-none p-1 rounded-md hover:bg-gray-100 transition-colors'
						aria-label='Fermer'
					>
						<svg
							className='w-6 h-6'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</button>
				</div>

				{/* Content - ✅ FIX: Scrollable content area */}
				<div className='flex-1 overflow-y-auto p-6'>
					{children}
				</div>

				{/* Footer - ✅ FIX: Sticky footer */}
				{footer && (
					<div className='flex items-center justify-end gap-4 p-6 border-t border-fr-grey-light bg-white rounded-b-lg flex-shrink-0'>
						{footer}
					</div>
				)}
			</div>
		</div>,
		document.body
	)
}

export default Modal
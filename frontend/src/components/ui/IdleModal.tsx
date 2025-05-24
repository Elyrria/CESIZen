import React from 'react'

interface IdleModalProps {
	isOpen: boolean
	onStayConnected: () => void
	onLogout: () => void
	remainingTime: number
}

const IdleModal: React.FC<IdleModalProps> = ({ isOpen, onStayConnected, onLogout, remainingTime }) => {
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins}:${secs < 10 ? '0' : ''}${secs}`
	}

	// ESC key handling
	React.useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && isOpen) {
				onStayConnected()
			}
		}

		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown)
			// Block background scroll
			document.body.style.overflow = 'hidden'
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.body.style.overflow = 'unset'
		}
	}, [isOpen, onStayConnected])

	if (!isOpen) return null

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm'>
			<div className='bg-white rounded-lg shadow-fr-md w-full max-w-md p-8 mx-4 transform transition-all duration-200 scale-100'>
				{/* Alert icon */}
				<div className='flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-fr-yellow-light rounded-full'>
					<svg
						className='w-8 h-8 text-fr-yellow-dark'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
						/>
					</svg>
				</div>

				<h2 className='text-xl font-bold text-fr-blue mb-4 text-center'>Session Inactive</h2>
				<p className='text-fr-grey-dark mb-6 text-center leading-relaxed'>
					Pour votre sécurité, votre session CESIZen va expirer automatiquement dans{' '}
					<span className='font-bold text-fr-blue text-lg'>
						{formatTime(remainingTime)}
					</span>{' '}
					en raison d'inactivité.
				</p>

				{/* Visual progress bar */}
				<div className='w-full bg-fr-grey-light rounded-full h-2 mb-6'>
					<div
						className='bg-fr-blue h-2 rounded-full transition-all duration-1000'
						style={{ width: `${(remainingTime / 120) * 100}%` }} // 120s = 2min
					></div>
				</div>

				<div className='flex flex-col sm:flex-row gap-4 sm:justify-between'>
					<button
						onClick={onLogout}
						className='w-full sm:w-auto px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-fr-grey-dark rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-fr-blue'
					>
						Se déconnecter
					</button>
					<button
						onClick={onStayConnected}
						className='w-full sm:w-auto px-6 py-3 bg-fr-blue hover:bg-fr-blue-dark text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fr-blue'
						autoFocus
					>
						Rester connecté
					</button>
				</div>

				{/* ESC key */}
				<p className='text-xs text-fr-grey text-center mt-4'>
					Appuyez sur{' '}
					<kbd className='px-1 py-0.5 bg-fr-grey-light rounded text-xs'>ESC</kbd> ou
					cliquez sur "Rester connecté"
				</p>
			</div>
		</div>
	)
}

export default IdleModal

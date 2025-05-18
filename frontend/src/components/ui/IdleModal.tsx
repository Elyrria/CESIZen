import React from "react"

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
		return `${mins}:${secs < 10 ? "0" : ""}${secs}`
	}

	if (!isOpen) return null

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
			<div className='bg-white rounded-lg shadow-fr-md w-full max-w-md p-8 mx-4'>
				<h2 className='text-xl font-bold text-fr-blue mb-4'>Votre session va expirer</h2>
				<p className='text-fr-grey-dark mb-6'>
					Pour des raisons de sécurité, vous serez déconnecté automatiquement dans{" "}
					<span className='font-bold text-fr-blue'>{formatTime(remainingTime)}</span> en
					raison d'inactivité.
				</p>
				<div className='flex flex-col sm:flex-row gap-4 sm:justify-between'>
					<button
						onClick={onLogout}
						className='w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-fr-grey-dark rounded-md transition-colors'
					>
						Se déconnecter
					</button>
					<button
						onClick={onStayConnected}
						className='w-full sm:w-auto px-4 py-2 bg-fr-blue hover:bg-blue-800 text-white rounded-md transition-colors'
					>
						Rester connecté
					</button>
				</div>
			</div>
		</div>
	)
}

export default IdleModal

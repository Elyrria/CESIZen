import React from 'react'
import useIdleDetection from '@/hooks/useIdleDetection'
import IdleModal from '@/components/ui/IdleModal'

interface IdleWrapperProps {
	children: React.ReactNode
	// Allow configuration from outside
	idleTime?: number
	warningTime?: number
	onCustomLogout?: () => Promise<void>
}

const IdleWrapper: React.FC<IdleWrapperProps> = ({
	children,
	idleTime = 15 * 60 * 1000, // 15 minutes by default
	warningTime = 2 * 60 * 1000, // 2 minutes by default
	onCustomLogout,
}) => {
	// Debug log
	console.log('IdleWrapper initialized with:', {
		idleTime: idleTime / 1000 + 's',
		warningTime: warningTime / 1000 + 's',
	})

	const { showModal, remainingTime, stayConnected, handleLogout } = useIdleDetection({
		idleTime,
		warningTime,
		onLogout: onCustomLogout,
	})

	// Debug for modal
	React.useEffect(() => {
		if (showModal) {
			console.log("Idle modal displayed, remaining time:", remainingTime + 's')
		}
	}, [showModal, remainingTime])

	return (
		<>
			{children}
			<IdleModal
				isOpen={showModal}
				onStayConnected={stayConnected}
				onLogout={handleLogout}
				remainingTime={remainingTime}
			/>
		</>
	)
}

export default IdleWrapper

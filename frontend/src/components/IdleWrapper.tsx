// src/components/wrappers/IdleWrapper.tsx
import React from "react"
import useIdleDetection from "@/hooks/useIdleDetection"
import IdleModal from "@/components/ui/IdleModal"

interface IdleWrapperProps {
	children: React.ReactNode
}

const IdleWrapper: React.FC<IdleWrapperProps> = ({ children }) => {
	const { showModal, remainingTime, stayConnected, handleLogout } = useIdleDetection()

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

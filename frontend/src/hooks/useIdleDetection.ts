import { clearAuthCookies } from "@/utils/authCookies"
import { useIdleTimer } from "react-idle-timer"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"

interface IdleDetectionOptions {
	idleTime?: number // Time before notification (ms), default 10min
	warningTime?: number // Warning time before logout (ms), default 5min
	onLogout?: () => Promise<void> // Custom logout function
}

const useIdleDetection = ({
	idleTime = 10 * 60 * 1000, // 10 minutes
	warningTime = 5 * 60 * 1000, // 5 minutes
	onLogout,
}: IdleDetectionOptions = {}) => {
	const [showModal, setShowModal] = useState(false)
	const [remainingTime, setRemainingTime] = useState(warningTime / 1000)
	const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
	const navigate = useNavigate()

	// Logout action
	const handleLogout = async () => {
		// Clean interval if exists
		if (intervalId) {
			clearInterval(intervalId)
			setIntervalId(null)
		}

		// Close modal
		setShowModal(false)

		// Call custom logout function or perform default logout
		if (onLogout) {
			await onLogout()
		} else {
			// Default logout - clear all auth cookies
			clearAuthCookies()
			toast.info("Vous avez été déconnecté en raison de votre inactivité", {
				autoClose: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: false,
				progress: undefined,
				hideProgressBar: false,
				position: "top-center",
				className: "logout-toast",
				style: { fontWeight: "bold" },
			})
			navigate("/login")
		}
	}

	// Stay connected
	const stayConnected = () => {
		// Reset timer
		reset()

		// Clean interval
		if (intervalId) {
			clearInterval(intervalId)
			setIntervalId(null)
		}

		// Close modal
		setShowModal(false)

		toast.success("Votre session a été prolongée")
	}

	// Idle timer configuration
	const { reset } = useIdleTimer({
		timeout: idleTime,
		onIdle: () => {
			// Show warning modal
			setShowModal(true)
			setRemainingTime(warningTime / 1000)

			// Start countdown
			const id = setInterval(() => {
				setRemainingTime((prev) => {
					if (prev <= 1) {
						// Time's up, logout
						clearInterval(id)
						handleLogout()
						return 0
					}
					return prev - 1
				})
			}, 1000)

			setIntervalId(id)
		},
		debounce: 500,
	})

	// Clean up interval when component unmounts
	useEffect(() => {
		return () => {
			if (intervalId) {
				clearInterval(intervalId)
			}
		}
	}, [intervalId])

	return {
		showModal,
		remainingTime,
		stayConnected,
		handleLogout,
	}
}

export default useIdleDetection

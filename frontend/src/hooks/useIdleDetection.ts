import { useIdleTimer } from "react-idle-timer"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import useStore from "@/stores/useStore"

interface IdleDetectionOptions {
	idleTime?: number // Time before notification (ms), default 15min
	warningTime?: number // Warning time before logout (ms), default 2min
	onLogout?: () => Promise<void> // Custom logout function
}

const useIdleDetection = ({
	idleTime = 15 * 60 * 1000, // 15 minutes (adapted for mental health app)
	warningTime = 2 * 60 * 1000, // 2 minutes (less intrusive)
	onLogout,
}: IdleDetectionOptions = {}) => {
	const [showModal, setShowModal] = useState(false)
	const [remainingTime, setRemainingTime] = useState(warningTime / 1000)
	const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
	const navigate = useNavigate()

	// Use the store for clean logout
	const { auth } = useStore()

	// Debug logs
	console.log('IdleDetection configured:', {
		idleTime: idleTime / 1000 + 's',
		warningTime: warningTime / 1000 + 's',
		userConnected: !!auth.user
	})

	// Logout action
	const handleLogout = async () => {
		console.log('Automatic logout triggered')

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
			// Use the store logout for a clean logout
			const success = await auth.logout()

			if (success) {
				toast.info("Vous avez été déconnecté automatiquement en raison de votre inactivité", {
					autoClose: 5000,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					hideProgressBar: false,
					position: "top-center",
					className: "logout-toast",
					style: { fontWeight: "bold" },
				})
				navigate("/login", { replace: true })
			}
		}
	}

	// Stay connected
	const stayConnected = () => {
		console.log('Session extended by user')

		// Reset timer
		reset()

		// Clean interval
		if (intervalId) {
			clearInterval(intervalId)
			setIntervalId(null)
		}

		// Close modal
		setShowModal(false)

		toast.success("Votre session a été prolongée", {
			autoClose: 3000,
			position: "top-right"
		})
	}

	// Idle timer configuration
	const { reset, getRemainingTime, getLastActiveTime } = useIdleTimer({
		timeout: idleTime,
		onIdle: () => {
			console.log('Inactive user detected - showing modal')

			// Show warning modal
			setShowModal(true)
			setRemainingTime(warningTime / 1000)

			// Start countdown
			const id = setInterval(() => {
				setRemainingTime((prev) => {
					if (prev <= 1) {
						// Time's up, logout
						console.log('Time elapsed - automatic logout')
						clearInterval(id)
						handleLogout()
						return 0
					}
					return prev - 1
				})
			}, 1000)

			setIntervalId(id)
		},
		onActive: () => {
			console.log('Active user detected')
		},
		onAction: () => {
			console.log('User action detected')
		},
		debounce: 500,
		// Events to monitor to reset the timer
		events: [
			'mousedown',
			'mousemove',
			'keypress',
			'scroll',
			'touchstart',
			'click'
		],
		// Do not trigger on form elements to avoid interruptions
		immediateEvents: [],
		// Reset when the user returns to the tab
		startOnMount: true,
		startManually: false,
		stopOnIdle: false,
		crossTab: true // Synchronize between tabs
	})

	// Debug - display remaining time every 10 seconds
	useEffect(() => {
		const debugInterval = setInterval(() => {
			const remaining = getRemainingTime()
			console.log(`Remaining time before idle: ${Math.floor(remaining / 1000)}s`)
		}, 10000) // Every 10 seconds

		return () => clearInterval(debugInterval)
	}, [getRemainingTime])

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
		reset, // Expose reset for external use if necessary
		// Debug helpers
		getRemainingTime,
		getLastActiveTime
	}
}

export default useIdleDetection

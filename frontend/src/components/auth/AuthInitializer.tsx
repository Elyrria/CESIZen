// src/components/auth/AuthInitializer.tsx
import useStore from "@/stores/useStore" // Import centralized store instead of useAuthStore
import { useEffect, useState } from "react"

interface AuthInitializerProps {
	children: React.ReactNode
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
	const { auth } = useStore() // Use centralized store
	const { initializeAuth, isAuthInitialized } = auth
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const loadAuth = async () => {
			try {
				await initializeAuth()
			} catch (error) {
				console.error("Erreur lors de l'initialisation de l'authentification:", error)
			} finally {
				setIsLoading(false)
			}
		}

		if (!isAuthInitialized) {
			loadAuth()
		} else {
			setIsLoading(false)
		}
	}, [initializeAuth, isAuthInitialized])

	// Show loading indicator during authentication initialization
	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fr-blue'></div>
			</div>
		)
	}

	return <>{children}</>
}

export default AuthInitializer

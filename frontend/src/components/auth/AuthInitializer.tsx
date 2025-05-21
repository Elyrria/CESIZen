// src/components/auth/AuthInitializer.tsx
import useAuthStore from "@/stores/useAuthStore"
import { useEffect } from "react"

interface AuthInitializerProps {
	children: React.ReactNode
}

const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
	const { initializeAuth } = useAuthStore()

	useEffect(() => {
		const loadAuth = async () => {
			await initializeAuth()
		}

		loadAuth()
	}, [initializeAuth])

	return <>{children}</>
}

export default AuthInitializer

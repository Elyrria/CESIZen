// src/components/auth/AuthInitializer.tsx
import { useEffect } from "react"
import useAuthStore from "@/store/authStore"

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

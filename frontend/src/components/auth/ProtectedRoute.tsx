import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import useAuthStore from "@/stores/useAuthStore"

interface ProtectedRouteProps {
	children: React.ReactNode
	requireAdmin?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
	const { isAuthenticated, isAdmin, isLoading } = useAuthStore()
	const location = useLocation()

	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fr-blue'></div>
			</div>
		)
	}

	if (!isAuthenticated) {
		return <Navigate to='/login' state={{ from: location }} replace />
	}

	if (requireAdmin && !isAdmin) {
		return <Navigate to='/' replace />
	}

	return <>{children}</>
}

export default ProtectedRoute

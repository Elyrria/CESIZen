import type { User } from "@/types/factory"

export interface AuthState {
	user: User | null
	isAuthenticated: boolean
	isAdmin: boolean
	isLoading: boolean
	login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>
	logout: () => Promise<void>
	fetchUserProfile: () => Promise<boolean>
	setUser: (user: User | null) => void
	initializeAuth: () => Promise<boolean>
}

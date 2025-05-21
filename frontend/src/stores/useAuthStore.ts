import { clearAuthCookies, setAuthCookies, getTokenFromCookie, getUserIdFromCookie } from "@/utils/authCookies"
import entityFactory, { type IUser } from "@/factories/Factory"
import { persist } from "zustand/middleware"
import api from "@/services/apiHandler"
import { create } from "zustand"

export interface AuthState {
	user: IUser | null
	isAuthenticated: boolean
	isAdmin: boolean
	isLoading: boolean
	login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>
	logout: () => Promise<void>
	fetchUserProfile: () => Promise<boolean>
	setUser: (user: IUser | null) => void
	initializeAuth: () => Promise<boolean>
}

const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			isAuthenticated: false,
			isAdmin: false,
			isLoading: false,

			setUser: (user) => {
				set({
					user,
					isAuthenticated: !!user,
					isAdmin: user?.role === "administrator",
				})
			},

			login: async (email, password, rememberMe = false) => {
				set({ isLoading: true })

				try {
					const response = await api.login(email, password)

					if (response.success && response.data && response.data.user) {
						const responseData = response.data

						if (responseData && responseData.user && responseData.tokens) {
							const userData = responseData.user
							const userId = userData.id
							const { accessToken, refreshToken } = responseData.tokens

							// Store tokens in cookies
							setAuthCookies(userId, accessToken, refreshToken, rememberMe)

							// Create a user instance with our factory
							const user = entityFactory.createUser(userData)

							// Update state
							set({
								user,
								isAuthenticated: true,
								isAdmin: user.role === "administrator",
							})

							return true
						}
					}

					return false
				} catch (error) {
					console.error("Erreur de connexion:", error)
					return false
				} finally {
					set({ isLoading: false })
				}
			},

			logout: async () => {
				try {
					// API call for logout if needed
					clearAuthCookies()
					set({
						user: null,
						isAuthenticated: false,
						isAdmin: false,
					})
				} catch (error) {
					console.error("Erreur de déconnexion:", error)
				}
			},

			fetchUserProfile: async () => {
				set({ isLoading: true })

				try {
					// Check if we have a token and userId
					const token = getTokenFromCookie()
					const userId = getUserIdFromCookie()

					if (!token || !userId) {
						return false
					}

					// Use the new get-user/:id route
					const response = await api.getUser(userId)

					if (response.success && response.data && response.data.user) {
						// Ensure the user object has all necessary properties
						const rawUser = response.data.user

						// Create an object that matches createUser expectations
						const userData = {
							id: rawUser._id || rawUser.id,
							email: rawUser.email,
							name: rawUser.name,
							firstName: rawUser.firstName,
							role: rawUser.role,
						}

						if (userData.id && userData.email && userData.name) {
							const user = entityFactory.createUser(userData)

							set({
								user,
								isAuthenticated: true,
								isAdmin: user.role === "administrator",
							})

							return true
						}
					}

					return false
				} catch (error) {
					console.error("Erreur lors de la récupération du profil utilisateur:", error)
					return false
				} finally {
					set({ isLoading: false })
				}
			},

			// Function to initialize auth state from cookies
			initializeAuth: async () => {
				const token = getTokenFromCookie()
				const userId = getUserIdFromCookie()

				if (token && userId) {
					return await get().fetchUserProfile()
				}

				return false
			},
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({ user: state.user }),
		}
	)
)

export default useAuthStore

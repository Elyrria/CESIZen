import { clearAuthCookies, setAuthCookies, getTokenFromCookie, getUserIdFromCookie } from "@/utils/authCookies"
import entityFactory, { type IUser } from "@/factories/Factory"
import { persist } from "zustand/middleware"
import api from "@/services/apiHandler"
import { create } from "zustand"

export interface AuthState {
	user: IUser | null
	isLoading: boolean
	error: string | null
	isAuthInitialized: boolean // New state to track initialization

	// Authentication methods
	initializeAuth: () => Promise<void>
	login: (email: string, password: string) => Promise<boolean>
	logout: () => Promise<boolean>
	fetchUserProfile: () => Promise<boolean>

	// Utility methods
	clearError: () => void
	isAuthenticated: () => boolean
	isAdmin: () => boolean
	setUser: (user: IUser | null) => void
}

const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			isLoading: false,
			error: null,
			isAuthInitialized: false,

			// Method to initialize authentication
			initializeAuth: async () => {
				const state = get()

				// If already initialized and user present, do nothing
				if (state.isAuthInitialized && state.user) {
					return
				}

				try {
					// Get tokens and ID from cookies
					const token = getTokenFromCookie()
					const userId = getUserIdFromCookie()

					if (token && userId) {
						try {
							// Get user information from API
							const response = await api.getUser(userId)

							if (response.success && response.data?.user) {
								const user = entityFactory.createUser(
									response.data.user
								)
								set({ user, isAuthInitialized: true })
								return
							} else {
								// If request fails, clear cookies
								clearAuthCookies()
								set({ user: null, isAuthInitialized: true })
							}
						} catch (error) {
							console.error(
								"Erreur lors de la récupération de l'utilisateur:",
								error
							)
							// On error, clear cookies and continue
							clearAuthCookies()
							set({
								user: null,
								isAuthInitialized: true,
								error: "Erreur d'authentification",
							})
						}
					} else {
						// No token or user ID
						set({ user: null, isAuthInitialized: true })
					}
				} catch (error) {
					console.error("Erreur dans initializeAuth:", error)
					set({ user: null, isAuthInitialized: true, error: "Erreur d'initialisation" })
				}
			},

			setUser: (user) => {
				set({
					user,
					isAuthInitialized: true, // Update initialization state
				})
			},

			login: async (email, password) => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.login(email, password)

					if (response.success && response.data) {
						const { user, tokens } = response.data

						// Store tokens in cookies
						setAuthCookies(user.id, tokens.accessToken, tokens.refreshToken)

						// Update state
						set({
							user: entityFactory.createUser(user),
							isLoading: false,
							isAuthInitialized: true,
						})

						return true
					} else {
						if (!response.success) {
							set({
								error: response.error.message,
								isLoading: false,
								isAuthInitialized: true,
							})
						} else {
							set({
								error: "Échec de la connexion : réponse invalide",
								isLoading: false,
								isAuthInitialized: true,
							})
						}
						return false
					}
				} catch (error) {
					console.error("Erreur lors de la connexion:", error)
					set({
						error: "Une erreur inattendue s'est produite",
						isLoading: false,
						isAuthInitialized: true,
					})
					return false
				}
			},

			logout: async () => {
				set({ isLoading: true, error: null })

				try {
					// Clear cookies
					clearAuthCookies()

					set({
						user: null,
						isLoading: false,
						isAuthInitialized: true,
					})

					return true
				} catch (error) {
					console.error("Erreur lors de la déconnexion:", error)
					set({
						error: "Une erreur s'est produite lors de la déconnexion",
						isLoading: false,
						isAuthInitialized: true,
					})
					return false
				}
			},

			fetchUserProfile: async () => {
				set({ isLoading: true, error: null })

				try {
					// Check if we have a token and userId
					const token = getTokenFromCookie()
					const userId = getUserIdFromCookie()

					if (!token || !userId) {
						set({
							isLoading: false,
							error: "Aucun token d'authentification trouvé",
							isAuthInitialized: true,
						})
						return false
					}

					// Use the get-user/:id route
					const response = await api.getUser(userId)

					if (response.success && response.data && response.data.user) {
						const user = entityFactory.createUser(response.data.user)

						set({
							user,
							isLoading: false,
							isAuthInitialized: true,
							error: null,
						})

						return true
					} else {
						if (!response.success) {
							set({
								error: response.error.message,
								isLoading: false,
								isAuthInitialized: true,
								user: null,
							})
						} else {
							set({
								error: "Données utilisateur invalides",
								isLoading: false,
								isAuthInitialized: true,
								user: null,
							})
						}
						return false
					}
				} catch (error) {
					console.error("Erreur lors de la récupération du profil utilisateur:", error)
					set({
						error: "Erreur lors de la récupération du profil",
						isLoading: false,
						isAuthInitialized: true,
						user: null,
					})
					return false
				}
			},

			clearError: () => {
				set({ error: null })
			},

			isAuthenticated: () => {
				const { user } = get()
				return !!user
			},

			isAdmin: () => {
				const { user } = get()
				return user?.role === "administrator"
			},
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({
				user: state.user,
			}),
		}
	)
)

export default useAuthStore

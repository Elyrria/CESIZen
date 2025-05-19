// src/stores/authStore.ts
import { clearAuthCookies, setAuthCookies, getTokenFromCookie, getUserIdFromCookie } from "@/utils/authCookies"
import entityFactory from "@/factories/Factory"
import type { AuthState } from "@/types/store"
import { persist } from "zustand/middleware"
import api from "@/services/apiHandler"
import { create } from "zustand"
import type { IAuthResponse, GetUserResponse } from "@/types/apiHandler"

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

					if (response.success && "data" in response) {
						const responseData = response.data as IAuthResponse

						if (responseData && responseData.user && responseData.tokens) {
							const userData = responseData.user
							const userId = userData.id || userData._id
							const { accessToken, refreshToken } = responseData.tokens

							// Stocker les tokens dans les cookies
							setAuthCookies(userId, accessToken, refreshToken, rememberMe)

							// Créer une instance utilisateur avec notre factory
							const user = entityFactory.createUser(userData)

							// Mettre à jour l'état
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
					console.error("Login error:", error)
					return false
				} finally {
					set({ isLoading: false })
				}
			},

			logout: async () => {
				try {
					// Logout API call if needed
					clearAuthCookies()
					set({
						user: null,
						isAuthenticated: false,
						isAdmin: false,
					})
				} catch (error) {
					console.error("Logout error:", error)
				}
			},

			fetchUserProfile: async () => {
				set({ isLoading: true })

				try {
					// Vérifier si on a un token et un userId
					const token = getTokenFromCookie()
					const userId = getUserIdFromCookie()

					if (!token || !userId) {
						return false
					}

					// Utiliser la nouvelle route get-user/:id
					const response =
						await api.get<GetUserResponse>(`/v1/users/get-user/${userId}`)

					if (
						response.success &&
						"data" in response &&
						response.data &&
						response.data.user
					) {
						// Garantir que l'objet user a toutes les propriétés nécessaires
						const rawUser = response.data.user

						// Création d'un objet qui correspond aux attentes de createUser
						const userData = {
							id: rawUser._id || rawUser.id,
							email: rawUser.email,
							name: rawUser.name,
							firstName: rawUser.firstName,
							role: rawUser.role,
							// Ajouter d'autres propriétés selon les besoins
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
					console.error("Error fetching user profile:", error)
					return false
				} finally {
					set({ isLoading: false })
				}
                  },

			// Fonction pour initialiser l'état d'auth à partir des cookies
			initializeAuth: async () => {
				const token = getTokenFromCookie()
				const userId = getUserIdFromCookie()

				if (token && userId) {
					// On a des tokens, essayons de restaurer la session
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

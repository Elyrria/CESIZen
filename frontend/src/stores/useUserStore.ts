import { create } from "zustand"
import { persist } from "zustand/middleware"
import api from "@/services/apiHandler"
import entityFactory, { type IUser, type IPagination } from "@/factories/Factory"

export interface UserState {
	users: IUser[]
	selectedUser: IUser | null
	pagination: IPagination | null
	isLoading: boolean
	error: string | null

	// Fetch methods
	fetchUsers: (params?: {
		email?: string
		role?: "user" | "administrator"
		createdFrom?: string
		createdTo?: string
		page?: number
		limit?: number
		sort?: string
		order?: "asc" | "desc"
	}) => Promise<boolean>

	fetchUser: (id: string) => Promise<IUser | null>

	// CRUD methods
	createUser: (userData: {
		email: string
		password: string
		name: string
		firstName: string
		birthDate: string
		role: "user" | "administrator"
	}) => Promise<IUser | null>

	updateUser: (
		id: string,
		userData: {
			email?: string
			name?: string
			firstName?: string
			birthDate?: string
			password?: string
			newPassword?: string
			role?: "user" | "administrator"
		}
	) => Promise<boolean>

	registerUser: (userData: {
		email: string
		password: string
		name: string
		firstName: string
		birthDate: string
	}) => Promise<{ user: IUser; tokens: { accessToken: string; refreshToken: string } } | null>

	// State setters
	setSelectedUser: (user: IUser | null) => void
	clearUsers: () => void
}

const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			users: [],
			selectedUser: null,
			pagination: null,
			isLoading: false,
			error: null,

			fetchUsers: async (params) => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.getUsers(params)

					if (response.success && response.data) {
						const usersData = response.data

						// Convert raw data to entities using Factory
						const users = usersData.users.map((item) =>
							entityFactory.createUser(item)
						)

						set({
							users,
							pagination: usersData.pagination,
						})

						return true
					} else {
						if (!response.success) {
							set({ error: response.error.message })
						} else {
							set({ error: "Impossible de récupérer les utilisateurs" })
						}
						return false
					}
				} catch (error) {
					console.error("Error fetching users:", error)
					set({ error: "Une erreur inattendue s'est produite" })
					return false
				} finally {
					set({ isLoading: false })
				}
			},

			fetchUser: async (id) => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.getUser(id)

					if (response.success && response.data && response.data.user) {
						const user = entityFactory.createUser(response.data.user)

						// Update the selected user
						set({ selectedUser: user })

						return user
					} else {
						if (!response.success) {
							set({ error: response.error.message })
						} else {
							set({ error: "Impossible de récupérer l'utilisateur" })
						}
						return null
					}
				} catch (error) {
					console.error("Error fetching user:", error)
					set({ error: "Une erreur inattendue s'est produite" })
					return null
				} finally {
					set({ isLoading: false })
				}
			},

			createUser: async (userData) => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.adminCreateUser(userData)

					if (response.success && response.data) {
						const newUser = entityFactory.createUser(response.data)

						// Add the new user to the list
						set((state) => ({
							users: [...state.users, newUser],
						}))

						return newUser
					} else {
						if (!response.success) {
							set({ error: response.error.message })
						} else {
							set({
								error: "Impossible de créer l'utilisateur : données invalides",
							})
						}
						return null
					}
				} catch (error) {
					console.error("Error creating user:", error)
					set({ error: "Une erreur inattendue s'est produite" })
					return null
				} finally {
					set({ isLoading: false })
				}
			},

			updateUser: async (id, userData) => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.updateUser(id, userData)

					if (response.success && response.data) {
						const updatedUser = entityFactory.createUser(response.data)

						// Update user in the list
						set((state) => ({
							users: state.users.map((user) =>
								user.id === id ? updatedUser : user
							),
							selectedUser:
								state.selectedUser?.id === id
									? updatedUser
									: state.selectedUser,
						}))

						return true
					} else {
						if (!response.success) {
							set({ error: response.error.message })
						} else {
							set({
								error: "Impossible de mettre à jour l'utilisateur : données invalides",
							})
						}
						return false
					}
				} catch (error) {
					console.error("Error updating user:", error)
					set({ error: "Une erreur inattendue s'est produite" })
					return false
				} finally {
					set({ isLoading: false })
				}
			},

			registerUser: async (userData) => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.register(userData)

					if (response.success && response.data) {
						// Return the response data for login handling
						return response.data
					} else {
						if (!response.success) {
							set({ error: response.error.message })
						} else {
							set({
								error: "Impossible d'inscrire l'utilisateur : données invalides",
							})
						}
						return null
					}
				} catch (error) {
					console.error("Error registering user:", error)
					set({ error: "Une erreur inattendue s'est produite" })
					return null
				} finally {
					set({ isLoading: false })
				}
			},

			setSelectedUser: (user) => {
				set({ selectedUser: user })
			},

			clearUsers: () => {
				set({
					users: [],
					pagination: null,
					selectedUser: null,
				})
			},
		}),
		{
			name: "user-storage",
			partialize: (state) => ({
				selectedUser: state.selectedUser,
			}),
		}
	)
)

export default useUserStore

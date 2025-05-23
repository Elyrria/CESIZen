import entityFactory, { type IInformation, type IPagination } from "@/factories/Factory"
import api, { type IFilters } from "@/services/apiHandler"
import { persist } from "zustand/middleware"
import { create } from "zustand"

export interface InformationState {
	informations: IInformation[]
	selectedInformation: IInformation | null
	pagination: IPagination | null
	filters: IFilters
	isLoading: boolean
	error: string | null

	// Fetch methods
	fetchInformations: (params?: {
		type?: "TEXT" | "IMAGE" | "VIDEO"
		status?: "DRAFT" | "PENDING" | "PUBLISHED"
		authorId?: string
		categoryId?: string
		search?: string
		createdFrom?: string
		createdTo?: string
		sortBy?: string
		order?: "asc" | "desc"
		page?: number
		limit?: number
	}) => Promise<boolean>

	fetchPublicInformations: (params?: {
		type?: "TEXT" | "IMAGE" | "VIDEO"
		categoryId?: string
		search?: string
		createdFrom?: string
		createdTo?: string
		sortBy?: string
		order?: "asc" | "desc"
		page?: number
		limit?: number
	}) => Promise<boolean>

	fetchPublicInformationById: (id: string) => Promise<boolean>

	// CRUD methods
	createInformation: (formData: FormData) => Promise<IInformation | null>
	updateInformation: (id: string, formData: FormData) => Promise<boolean>
	deleteInformation: (id: string) => Promise<boolean>

	// State setters
	setSelectedInformation: (information: IInformation | null) => void
	setFilters: (filters: IFilters) => void
	clearInformations: () => void
}

const useInformationStore = create<InformationState>()(
	persist(
		(set) => ({
			informations: [],
			selectedInformation: null,
			pagination: null,
			filters: {},
			isLoading: false,
			error: null,

			fetchInformations: async (params) => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.getInformations(params)

					if (response.success && response.data) {
						const informationsData = response.data

						// Convert raw data to entities using Factory
						const informations = informationsData.items.map((item) =>
							entityFactory.createInformation(item)
						)

						set({
							informations,
							pagination: informationsData.pagination,
							filters: informationsData.filters,
						})

						return true
					} else {
						if (!response.success) {
							set({
								error: response.error.message,
							})
						} else {
							set({
								error: "Impossible de récupérer les informations",
							})
						}
						return false
					}
				} catch (error) {
					console.error("Error fetching informations:", error)
					set({ error: "Une erreur inattendue s'est produite" })
					return false
				} finally {
					set({ isLoading: false })
				}
			},

			fetchPublicInformations: async (params) => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.getPublicInformations(params)

					if (response.success && response.data) {
						const informationsData = response.data

						// Convert raw data to entities using Factory
						const informations = informationsData.items.map((item) =>
							entityFactory.createInformation(item)
						)

						set({
							informations,
							pagination: informationsData.pagination,
							filters: informationsData.filters,
						})

						return true
					} else {
						if (!response.success) {
							set({
								error: response.error.message,
							})
						} else {
							set({
								error: "Impossible de récupérer les informations publiques",
							})
						}
						return false
					}
				} catch (error) {
					console.error("Error fetching public informations:", error)
					set({ error: "Une erreur inattendue s'est produite" })
					return false
				} finally {
					set({ isLoading: false })
				}
			},

			fetchPublicInformationById: async (id) => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.getPublicInformationById(id)

					if (response.success && response.data) {
						const informationData = response.data
						console.log(informationData)
						if (informationData) {
							// Convert raw data to entity using Factory
							const information = entityFactory.createInformation(informationData.information)
							console.log(information)
							set({
								selectedInformation: information,
							})

							return true
						} else {
							set({
								error: "Information non trouvée ou non publiée",
								selectedInformation: null,
							})
							return false
						}
					} else {
						if (!response.success) {
							set({
								error: response.error.message,
								selectedInformation: null,
							})
						} else {
							set({
								error: "Impossible de récupérer l'information",
								selectedInformation: null,
							})
						}
						return false
					}
				} catch (error) {
					console.error("Error fetching public information by ID:", error)
					set({
						error: "Une erreur inattendue s'est produite",
						selectedInformation: null,
					})
					return false
				} finally {
					set({ isLoading: false })
				}
			},

			createInformation: async (formData) => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.createInformation(formData)

					if (response.success && response.data && response.data.information) {
						const newInformation = entityFactory.createInformation(
							response.data.information
						)

						// Add the new information to the list
						set((state) => ({
							informations: [newInformation, ...state.informations],
						}))

						return newInformation
					} else {
						if (!response.success) {
							set({
								error: response.error.message,
							})
						} else {
							set({
								error: "Impossible de créer l'information : données invalides",
							})
						}
						return null
					}
				} catch (error) {
					console.error("Error creating information:", error)
					set({ error: "Une erreur inattendue s'est produite" })
					return null
				} finally {
					set({ isLoading: false })
				}
			},

			updateInformation: async (id, formData) => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.updateInformation(id, formData)

					if (response.success && response.data) {
						const updatedInformation = entityFactory.createInformation(
							response.data.information
						)

						// Update information in the list
						set((state) => ({
							informations: state.informations.map((info) =>
								info.id === id ? updatedInformation : info
							),
							selectedInformation:
								state.selectedInformation?.id === id
									? updatedInformation
									: state.selectedInformation,
						}))

						return true
					} else {
						if (!response.success) {
							set({
								error: response.error.message,
							})
						} else {
							set({
								error: "Impossible de mettre à jour l'information : données invalides",
							})
						}
						return false
					}
				} catch (error) {
					console.error("Error updating information:", error)
					set({ error: "Une erreur inattendue s'est produite" })
					return false
				} finally {
					set({ isLoading: false })
				}
			},

			deleteInformation: async (id) => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.deleteInformation(id)

					if (response.success) {
						// Remove deleted information from the list
						set((state) => ({
							informations: state.informations.filter(
								(info) => info.id !== id
							),
							selectedInformation:
								state.selectedInformation?.id === id
									? null
									: state.selectedInformation,
						}))

						return true
					} else {
						if (!response.success) {
							set({
								error: response.error.message,
							})
						} else {
							set({
								error: "Impossible de supprimer l'information",
							})
						}
						return false
					}
				} catch (error) {
					console.error("Error deleting information:", error)
					set({ error: "Une erreur inattendue s'est produite" })
					return false
				} finally {
					set({ isLoading: false })
				}
			},

			setSelectedInformation: (information) => {
				set({ selectedInformation: information })
			},

			setFilters: (filters) => {
				set({ filters })
			},

			clearInformations: () => {
				set({
					informations: [],
					pagination: null,
					filters: {},
					selectedInformation: null,
				})
			},
		}),
		{
			name: "information-storage",
			partialize: (state) => ({
				selectedInformation: state.selectedInformation,
				filters: state.filters,
			}),
		}
	)
)

export default useInformationStore
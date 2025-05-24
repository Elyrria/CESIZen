import entityFactory, { type IActivity, type IPagination } from "@/factories/Factory"
import api, { type IFilters } from "@/services/apiHandler"
import { persist } from "zustand/middleware"
import { create } from "zustand"

export interface ActivityState {
	activities: IActivity[]
	selectedActivity: IActivity | null
	pagination: IPagination | null
	filters: IFilters
	isLoading: boolean
	error: string | null

	// Fetch methods
	fetchActivities: (params?: {
		type?: "TEXT" | "VIDEO"
		isActive?: boolean
		categoryId?: string
		authorId?: string
		search?: string
		createdFrom?: string
		createdTo?: string
		sortBy?: string
		order?: "asc" | "desc"
		page?: number
		limit?: number
	}) => Promise<boolean>

	fetchPublicActivities: (params?: {
		type?: "TEXT" | "VIDEO"
		categoryId?: string
		search?: string
		createdFrom?: string
		createdTo?: string
		sortBy?: string
		order?: "asc" | "desc"
		page?: number
		limit?: number
	}) => Promise<boolean>
	fetchPublicActivity: (id: string) => Promise<IActivity | null>
	// CRUD methods
	createActivity: (formData: FormData) => Promise<IActivity | null>
	updateActivity: (id: string, formData: FormData) => Promise<boolean>
	deleteActivity: (id: string) => Promise<boolean>

	// State setters
	setSelectedActivity: (activity: IActivity | null) => void
	setFilters: (filters: IFilters) => void
	clearActivities: () => void
}

const useActivityStore = create<ActivityState>()(
	persist(
		(set) => ({
			activities: [],
			selectedActivity: null,
			pagination: null,
			filters: {},
			isLoading: false,
			error: null,

			fetchActivities: async (params) => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.getActivities(params)

					if (response.success && response.data) {
						const activitiesData = response.data

						// Convert raw data to entities using Factory
						const activities = activitiesData.items.map((item) =>
							entityFactory.createActivity(item)
						)

						set({
							activities,
							pagination: activitiesData.pagination,
							filters: activitiesData.filters,
						})

						return true
					} else {
						if (!response.success) {
							set({
								error: response.error.message,
							})
						} else {
							set({
								error: "Impossible to retrieve activities",
							})
						}
						return false
					}
				} catch (error) {
					console.error("Error fetching activities:", error)
					set({ error: "An unexpected error occurred" })
					return false
				} finally {
					set({ isLoading: false })
				}
			},

			fetchPublicActivities: async (params) => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.getPublicActivities(params)

					if (response.success && response.data) {
						const activitiesData = response.data

						// Convert raw data to entities using Factory
						const activities = activitiesData.items.map((item) =>
							entityFactory.createActivity(item)
						)

						set({
							activities,
							pagination: activitiesData.pagination,
							filters: activitiesData.filters,
						})

						return true
					} else {
						if (!response.success) {
							set({
								error: response.error.message,
							})
						} else {
							set({
								error: "Impossible to retrieve public activities",
							})
						}
						return false
					}
				} catch (error) {
					console.error("Error fetching public activities:", error)
					set({ error: "An unexpected error occurred" })
					return false
				} finally {
					set({ isLoading: false })
				}
			},
			fetchPublicActivity: async (id) => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.getPublicActivity(id)

					if (response.success && response.data && response.data.activity) {
						const activity = entityFactory.createActivity(response.data.activity)

						// Set the fetched activity as selected
						set({
							selectedActivity: activity,
						})

						return activity
					} else {
						if (!response.success) {
							set({
								error: response.error.message,
							})
						} else {
							set({
								error: "Impossible to retrieve the activity",
							})
						}
						return null
					}
				} catch (error) {
					console.error("Error fetching public activity:", error)
					set({ error: "An unexpected error occurred" })
					return null
				} finally {
					set({ isLoading: false })
				}
			},
			createActivity: async (formData) => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.createActivity(formData)

					if (response.success && response.data && response.data.activity) {
						const newActivity = entityFactory.createActivity(response.data.activity)

						// Add the new activity to the list
						set((state) => ({
							activities: [newActivity, ...state.activities],
						}))

						return newActivity
					} else {
						if (!response.success) {
							set({
								error: response.error.message,
							})
						} else {
							set({
								error: "Impossible to create activity: invalid data",
							})
						}
						return null
					}
				} catch (error) {
					console.error("Error creating activity:", error)
					set({ error: "An unexpected error occurred" })
					return null
				} finally {
					set({ isLoading: false })
				}
			},

			updateActivity: async (id, formData) => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.updateActivity(id, formData)

					if (response.success && response.data) {
						const updatedActivity = entityFactory.createActivity(response.data)

						// Update activity in the list
						set((state) => ({
							activities: state.activities.map((activity) =>
								activity.id === id ? updatedActivity : activity
							),
							selectedActivity:
								state.selectedActivity?.id === id
									? updatedActivity
									: state.selectedActivity,
						}))

						return true
					} else {
						if (!response.success) {
							set({
								error: response.error.message,
							})
						} else {
							set({
								error: "Impossible to update activity: invalid data",
							})
						}
						return false
					}
				} catch (error) {
					console.error("Error updating activity:", error)
					set({ error: "An unexpected error occurred" })
					return false
				} finally {
					set({ isLoading: false })
				}
			},

			deleteActivity: async (id) => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.deleteActivity(id)

					if (response.success) {
						// Remove deleted activity from the list
						set((state) => ({
							activities: state.activities.filter(
								(activity) => activity.id !== id
							),
							selectedActivity:
								state.selectedActivity?.id === id
									? null
									: state.selectedActivity,
						}))

						return true
					} else {
						if (!response.success) {
							set({
								error: response.error.message,
							})
						} else {
							set({
								error: "Impossible to delete the activity",
							})
						}
						return false
					}
				} catch (error) {
					console.error("Error deleting activity:", error)
					set({ error: "An unexpected error occurred" })
					return false
				} finally {
					set({ isLoading: false })
				}
			},

			setSelectedActivity: (activity) => {
				set({ selectedActivity: activity })
			},

			setFilters: (filters) => {
				set({ filters })
			},

			clearActivities: () => {
				set({
					activities: [],
					pagination: null,
					filters: {},
					selectedActivity: null,
				})
			},
		}),
		{
			name: "activity-storage",
			partialize: (state) => ({
				selectedActivity: state.selectedActivity,
				filters: state.filters,
			}),
		}
	)
)

export default useActivityStore

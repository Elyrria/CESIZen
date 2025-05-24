import entityFactory, { type ICategory } from "@/factories/Factory"
import { persist } from "zustand/middleware"
import api from "@/services/apiHandler"
import { create } from "zustand"

export interface CategoryState {
	categories: ICategory[]
	publicCategories: ICategory[]
	selectedCategory: ICategory | null
	isLoading: boolean
	error: string | null

	// Fetch methods
	fetchAdminCategories: () => Promise<boolean>
	fetchPublicCategories: () => Promise<boolean>

	// CRUD methods
	createCategory: (categoryData: { name: string; isActive?: boolean }) => Promise<ICategory | null>

	updateCategory: (
		id: string,
		categoryData: {
			name?: string
			isActive?: boolean
		}
	) => Promise<boolean>

	deleteCategory: (id: string) => Promise<boolean>

	// State setters
	setSelectedCategory: (category: ICategory | null) => void
	clearCategories: () => void
}

const useCategoryStore = create<CategoryState>()(
	persist(
		(set) => ({
			categories: [],
			publicCategories: [],
			selectedCategory: null,
			isLoading: false,
			error: null,

			fetchAdminCategories: async () => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.getAdminCategories()

					if (response.success && response.data) {
						const categoriesData = response.data

						// Convert raw data to entities using Factory
						const categories = categoriesData.categories.map((item) =>
							entityFactory.createCategory(item)
						)

						set({ categories })

						return true
					} else {
						if (!response.success) {
							set({ error: response.error.message })
						} else {
							set({ error: "Impossible de récupérer les catégories" })
						}
						return false
					}
				} catch (error) {
					console.error("Error fetching admin categories:", error)
					set({ error: "Une erreur inattendue s'est produite" })
					return false
				} finally {
					set({ isLoading: false })
				}
			},

			fetchPublicCategories: async () => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.getPublicCategories()

					if (response.success && response.data) {
						const categoriesData = response.data

						// Convert raw data to entities using Factory
						const categories = categoriesData.categories.map((item) =>
							entityFactory.createCategory(item)
						)

						set({ publicCategories: categories })

						return true
					} else {
						if (!response.success) {
							set({ error: response.error.message })
						} else {
							set({
								error: "Impossible de récupérer les catégories publiques",
							})
						}
						return false
					}
				} catch (error) {
					console.error("Error fetching public categories:", error)
					set({ error: "Une erreur inattendue s'est produite" })
					return false
				} finally {
					set({ isLoading: false })
				}
			},

			createCategory: async (categoryData) => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.createCategory(categoryData)

					if (response.success && response.data) {
						const newCategory = entityFactory.createCategory(response.data)

						// Add the new category to the list
						set((state) => ({
							categories: [...state.categories, newCategory],
						}))

						return newCategory
					} else {
						if (!response.success) {
							set({ error: response.error.message })
						} else {
							set({
								error: "Impossible de créer la catégorie : données invalides",
							})
						}
						return null
					}
				} catch (error) {
					console.error("Error creating category:", error)
					set({ error: "Une erreur inattendue s'est produite" })
					return null
				} finally {
					set({ isLoading: false })
				}
			},

			updateCategory: async (id, categoryData) => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.updateCategory(id, categoryData)

					if (response.success && response.data) {
						const updatedCategory = entityFactory.createCategory(response.data)

						// Update category in both lists
						set((state) => ({
							categories: state.categories.map((category) =>
								category.id === id ? updatedCategory : category
							),
							publicCategories: state.publicCategories.map((category) =>
								category.id === id ? updatedCategory : category
							),
							selectedCategory:
								state.selectedCategory?.id === id
									? updatedCategory
									: state.selectedCategory,
						}))

						return true
					} else {
						if (!response.success) {
							set({ error: response.error.message })
						} else {
							set({
								error: "Impossible de mettre à jour la catégorie : données invalides",
							})
						}
						return false
					}
				} catch (error) {
					console.error("Error updating category:", error)
					set({ error: "Une erreur inattendue s'est produite" })
					return false
				} finally {
					set({ isLoading: false })
				}
			},

			deleteCategory: async (id) => {
				set({ isLoading: true, error: null })

				try {
					const response = await api.deleteCategory(id)

					if (response.success) {
						// Remove deleted category from both lists
						set((state) => ({
							categories: state.categories.filter(
								(category) => category.id !== id
							),
							publicCategories: state.publicCategories.filter(
								(category) => category.id !== id
							),
							selectedCategory:
								state.selectedCategory?.id === id
									? null
									: state.selectedCategory,
						}))

						return true
					} else {
						if (!response.success) {
							set({ error: response.error.message })
						} else {
							set({ error: "Impossible de supprimer la catégorie" })
						}
						return false
					}
				} catch (error) {
					console.error("Error deleting category:", error)
					set({ error: "Une erreur inattendue s'est produite" })
					return false
				} finally {
					set({ isLoading: false })
				}
			},

			setSelectedCategory: (category) => {
				set({ selectedCategory: category })
			},

			clearCategories: () => {
				set({
					categories: [],
					publicCategories: [],
					selectedCategory: null,
				})
			},
		}),
		{
			name: "category-storage",
			partialize: (state) => ({
				selectedCategory: state.selectedCategory,
			}),
		}
	)
)

export default useCategoryStore

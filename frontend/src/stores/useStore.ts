// Root store that combines all stores for easier imports throughout the app
import useInformationStore, { type InformationState } from "@/stores/useInformationStore"
import useCategoryStore, { type CategoryState } from "@/stores/useCategoryStore"
import useActivityStore, { type ActivityState } from "@/stores/useActivityStore"
import useAuthStore, { type AuthState } from "@/stores/useAuthStore"
import useUserStore, { type UserState } from "@/stores/useUserStore"

// Type for the combined store
interface Store {
	auth: AuthState
	user: UserState
	information: InformationState
	activity: ActivityState
	category: CategoryState
}

// Function to access all stores from a single point
const useStore = (): Store => ({
	auth: useAuthStore(),
	user: useUserStore(),
	information: useInformationStore(),
	activity: useActivityStore(),
	category: useCategoryStore(),
})

export default useStore

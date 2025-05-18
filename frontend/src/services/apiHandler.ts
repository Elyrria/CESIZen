import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios"
import type { IUser, IActivity, IInformation } from "@/types/data"
import type {
	IApiSuccessResponse,
	IApiErrorResponse,
	IAuthResponse,
	IInformationsListResponse,
	IActivitiesListResponse,
	IUsersListResponse,
} from "@/types/apiHandler"

export type ApiResponse<T = unknown> = IApiSuccessResponse<T> | IApiErrorResponse

// Classe principale pour gérer les appels API
class ApiService {
	private baseURL: string
	private instance: ReturnType<typeof axios.create>

	constructor() {
		this.baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1"
		this.instance = axios.create({
			baseURL: this.baseURL,
			timeout: 10000,
			headers: {
				"Content-Type": "application/json",
			},
		})

		this.setupInterceptors()
	}

	private setupInterceptors(): void {
		// Intercepteur de requêtes pour ajouter le token d'authentification
		this.instance.interceptors.request.use(
			(config) => {
				const token = this.getTokenFromCookie()

				if (token && config.headers) {
					config.headers.Authorization = `Bearer ${token}`
				}
				return config
			},
			(error) => Promise.reject(error)
		)

		// Intercepteur de réponses pour gérer les tokens expirés
		this.instance.interceptors.response.use(
			(response) => response,
			async (error: AxiosError) => {
				const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

				// Si l'erreur est 401 (non autorisé) et que nous n'avons pas déjà tenté de refresh
				if (error.response?.status === 401 && !originalRequest._retry && originalRequest) {
					originalRequest._retry = true

					try {
						const refreshToken = this.getRefreshTokenFromCookie()

						if (!refreshToken) {
							this.redirectToLogin()
							return Promise.reject(error)
						}

						// Appeler l'API pour obtenir un nouveau token
						const response = await axios.post<
							IApiSuccessResponse<{
								tokens: { accessToken: string; refreshToken: string }
							}>
						>(`${this.baseURL}/refresh-token`, {
							refreshToken,
						})

						const { accessToken, refreshToken: newRefreshToken } =
							response.data.data?.tokens || {}

						if (accessToken && newRefreshToken) {
							// Stocker les nouveaux tokens dans les cookies
							this.setTokenCookie(accessToken)
							this.setRefreshTokenCookie(newRefreshToken)

							// Réessayer la requête originale avec le nouveau token
							if (originalRequest.headers) {
								originalRequest.headers.Authorization = `Bearer ${accessToken}`
							}
							return this.instance(originalRequest)
						}

						throw new Error("Invalid refresh token response")
					} catch (refreshError) {
						// En cas d'échec du refresh, rediriger vers la page de connexion
						this.clearAuthCookies()
						this.redirectToLogin()
						return Promise.reject(refreshError)
					}
				}

				return Promise.reject(error)
			}
		)
	}

	// Méthodes auxiliaires pour la gestion des cookies
	private getTokenFromCookie(): string | undefined {
		return document.cookie
			.split("; ")
			.find((row) => row.startsWith("token="))
			?.split("=")[1]
	}

	private getRefreshTokenFromCookie(): string | undefined {
		return document.cookie
			.split("; ")
			.find((row) => row.startsWith("refreshToken="))
			?.split("=")[1]
	}

	private setTokenCookie(token: string): void {
		// Token valide pour 15 minutes (900 secondes)
		document.cookie = `token=${token}; path=/; max-age=900`
	}

	private setRefreshTokenCookie(refreshToken: string): void {
		// RefreshToken valide pour 7 jours (604800 secondes)
		document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800`
	}

	private clearAuthCookies(): void {
		document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
		document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
	}

	private redirectToLogin(): void {
		window.location.href = "/auth/login"
	}

	// Méthodes génériques pour les appels API
	public async get<T = unknown>(
		url: string,
		params?: Record<string, unknown>,
		config?: AxiosRequestConfig
	): Promise<ApiResponse<T>> {
		try {
			const response: AxiosResponse<ApiResponse<T>> = await this.instance.get(url, {
				params,
				...config,
			})
			return response.data
		} catch (error) {
			return this.handleError(error)
		}
	}

	public async post<T = unknown>(
		url: string,
		data?: Record<string, unknown> | FormData,
		config?: AxiosRequestConfig
	): Promise<ApiResponse<T>> {
		try {
			const response: AxiosResponse<ApiResponse<T>> = await this.instance.post(url, data, config)
			return response.data
		} catch (error) {
			return this.handleError(error)
		}
	}

	public async put<T = unknown>(
		url: string,
		data?: Record<string, unknown> | FormData,
		config?: AxiosRequestConfig
	): Promise<ApiResponse<T>> {
		try {
			const response: AxiosResponse<ApiResponse<T>> = await this.instance.put(url, data, config)
			return response.data
		} catch (error) {
			return this.handleError(error)
		}
	}

	public async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
		try {
			const response: AxiosResponse<ApiResponse<T>> = await this.instance.delete(url, config)
			return response.data
		} catch (error) {
			return this.handleError(error)
		}
	}

	// Gestion des erreurs
	private handleError(error: unknown): IApiErrorResponse {
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError<IApiErrorResponse>
			if (axiosError.response?.data) {
				return axiosError.response.data as IApiErrorResponse
			}
		}

		return {
			success: false,
			error: {
				code: "unexpectedError",
				message: "Une erreur inattendue est survenue",
			},
		}
	}

	// Méthode spécifique pour upload de fichiers (multipart/form-data)
	public async uploadFile<T = unknown>(
		url: string,
		formData: FormData,
		config?: AxiosRequestConfig
	): Promise<ApiResponse<T>> {
		const uploadConfig: AxiosRequestConfig = {
			headers: {
				"Content-Type": "multipart/form-data",
			},
			...config,
		}

		return this.post<T>(url, formData, uploadConfig)
	}

	// Méthode pour obtenir l'URL d'un média
	public getMediaUrl(id: string): string {
		return `${this.baseURL}/informations/media/${id}`
	}

	// Méthode pour télécharger un média
	public getMediaDownloadUrl(id: string): string {
		return `${this.baseURL}/informations/media/${id}?download=true`
	}

	// Implémentation des méthodes spécifiques de l'API avec types
	// AUTH
	public async login(email: string, password: string): Promise<ApiResponse<IAuthResponse>> {
		return this.post<IAuthResponse>("/users/login", { email, password })
	}

	public async register(userData: {
		email: string
		password: string
		name: string
		firstName: string
		birthDate: string
	}): Promise<ApiResponse<IAuthResponse>> {
		return this.post<IAuthResponse>("/users/create", userData)
	}

	public async logout(refreshToken: string): Promise<ApiResponse<void>> {
		const response = await this.post<void>("/users/logout", { refreshToken })
		if (response.success) {
			this.clearAuthCookies()
		}
		return response
	}

	// USERS
	public async getUsers(params?: {
		email?: string
		role?: "user" | "administrator"
		createdFrom?: string
		createdTo?: string
		page?: number
		limit?: number
		sort?: string
		order?: "asc" | "desc"
	}): Promise<ApiResponse<IUsersListResponse>> {
		return this.get<IUsersListResponse>("/users/get-users", params)
	}

	public async updateUser(
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
	): Promise<ApiResponse<IUser>> {
		return this.put<IUser>(`/users/update/${id}`, userData)
	}

	public async adminCreateUser(userData: {
		email: string
		password: string
		name: string
		firstName: string
		birthDate: string
		role: "user" | "administrator"
	}): Promise<ApiResponse<IUser>> {
		return this.post<IUser>("/users/admin-create", userData)
	}

	// INFORMATIONS
	public async getInformations(params?: {
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
	}): Promise<ApiResponse<IInformationsListResponse>> {
		return this.get<IInformationsListResponse>("/informations/get-informations", params)
	}

	public async getPublicInformations(params?: {
		type?: "TEXT" | "IMAGE" | "VIDEO"
		categoryId?: string
		search?: string
		createdFrom?: string
		createdTo?: string
		sortBy?: string
		order?: "asc" | "desc"
		page?: number
		limit?: number
	}): Promise<ApiResponse<IInformationsListResponse>> {
		return this.get<IInformationsListResponse>("/informations/get-public-informations", params)
	}

	public async createInformation(formData: FormData): Promise<ApiResponse<{ information: IInformation }>> {
		return this.uploadFile<{ information: IInformation }>("/informations/create", formData)
	}

	public async updateInformation(id: string, formData: FormData): Promise<ApiResponse<IInformation>> {
		return this.uploadFile<IInformation>(`/informations/update/${id}`, formData)
	}

	public async deleteInformation(id: string): Promise<ApiResponse<void>> {
		return this.delete<void>(`/informations/delete/${id}`)
	}

	// ACTIVITIES
	public async getActivities(params?: {
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
	}): Promise<ApiResponse<IActivitiesListResponse>> {
		return this.get<IActivitiesListResponse>("/activities/get-activities", params)
	}

	public async getPublicActivities(params?: {
		type?: "TEXT" | "VIDEO"
		categoryId?: string
		search?: string
		createdFrom?: string
		createdTo?: string
		sortBy?: string
		order?: "asc" | "desc"
		page?: number
		limit?: number
	}): Promise<ApiResponse<IActivitiesListResponse>> {
		return this.get<IActivitiesListResponse>("/activities/get-public-activities", params)
	}

	public async createActivity(formData: FormData): Promise<ApiResponse<{ activity: IActivity }>> {
		return this.uploadFile<{ activity: IActivity }>("/activities/create", formData)
	}

	public async updateActivity(id: string, formData: FormData): Promise<ApiResponse<IActivity>> {
		return this.uploadFile<IActivity>(`/activities/update/${id}`, formData)
	}

	public async deleteActivity(id: string): Promise<ApiResponse<void>> {
		return this.delete<void>(`/activities/delete/${id}`)
	}
}

// Exporter une instance singleton
const api = new ApiService()
export default api

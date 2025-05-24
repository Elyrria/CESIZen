import type { IUser, IPagination, IActivity, IInformation, ICategory } from "@/factories/Factory"
import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios"

import {
	getTokenFromCookie,
	getRefreshTokenFromCookie,
	getUserIdFromCookie,
	setAuthCookies,
	clearAuthCookies,
} from "@utils/authCookies"

export interface IApiSuccessResponse<T> {
	success: true
	code: string
	message: string
	data?: T
}

export interface IApiErrorResponse {
	success: false
	error: {
		code: string
		message: string
		location?: string
		errors?: Array<{
			field?: string
			message: string
			location?: string
		}>
	}
}

export interface IAuthResponse {
	user: IUser
	tokens: {
		accessToken: string
		refreshToken: string
	}
}

export interface IFilters {
	[key: string]: string | number | boolean | undefined
}

export interface IInformationsListResponse {
	items: IInformation[]
	pagination: IPagination
	filters: IFilters
}

export interface IInformationResponse {
	items: IInformation
	information: IInformation
	pagination: IPagination
	filters: IFilters
}

export interface ICreateInformationResponse {
	information: IInformation
}

export interface IActivitiesListResponse {
	items: IActivity[]
	pagination: IPagination
	filters: IFilters
}

export interface ICategoryListResponse {
	categories: ICategory[]
}

export interface ICategoryResponse {
	category: ICategory
}

export interface IUsersListResponse {
	users: IUser[]
	pagination: IPagination
}

export type ApiResponse<T> = IApiSuccessResponse<T> | IApiErrorResponse

/**
 * Main class to handle API calls.
 *
 * This service wraps axios to provide:
 * - Base URL and default headers configuration
 * - Request interceptor to add authorization token from cookies
 * - Response interceptor to handle token refresh on 401 errors
 * - Generic methods for GET, POST, PUT, DELETE requests
 * - Specific API methods for authentication, user management,
 *   information and activities handling with typed responses.
 * - File upload support (multipart/form-data)
 * - Media URL getters
 */
class ApiService {
	private baseURL: string
	private instance: ReturnType<typeof axios.create>

	constructor() {
		this.baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/"
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
		// Request interceptor to add authentication token
		this.instance.interceptors.request.use(
			(config) => {
				const token = getTokenFromCookie()

				if (token && config.headers) {
					config.headers.Authorization = `Bearer ${token}`
				}
				return config
			},
			(error) => Promise.reject(error)
		)

		// Response interceptor to handle expired tokens
		this.instance.interceptors.response.use(
			(response) => response,
			async (error: AxiosError) => {
				const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

				// If error is 401 (Unauthorized) and we haven't retried yet
				if (error.response?.status === 401 && !originalRequest._retry && originalRequest) {
					originalRequest._retry = true

					try {
						const refreshToken = getRefreshTokenFromCookie()
						const userId = getUserIdFromCookie()

						if (!refreshToken || !userId) {
							this.redirectToLogin()
							return Promise.reject(error)
						}

						// Call API to get new tokens
						const response = await axios.post(`${this.baseURL}v1/refresh-token`, {
							refreshToken,
							userId,
						})

						// Puis accédez aux données
						const responseData = response.data as IApiSuccessResponse<{
							tokens: { accessToken: string; refreshToken: string }
						}>

						const { accessToken, refreshToken: newRefreshToken } =
							responseData.data?.tokens || {}

						if (accessToken && newRefreshToken) {
							// Update tokens while maintaining the same user ID
							setAuthCookies(userId, accessToken, newRefreshToken)

							// Retry original request with new token
							if (originalRequest.headers) {
								originalRequest.headers.Authorization = `Bearer ${accessToken}`
							}
							return this.instance(originalRequest)
						}

						throw new Error("Réponse de token de rafraîchissement invalide")
					} catch (refreshError) {
						// On refresh failure, clear cookies and redirect to login
						clearAuthCookies()
						this.redirectToLogin()
						return Promise.reject(refreshError)
					}
				}

				return Promise.reject(error)
			}
		)
	}

	private redirectToLogin(): void {
		window.location.href = "/login"
	}

	// Generic methods for API calls
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

	// Error handling
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
				message: "Une erreur inattendue s'est produite",
			},
		}
	}

	// Specific method for file upload (multipart/form-data)
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

	// Method to get media URL
	public getMediaUrl(id: string): string {
		return `${this.baseURL}v1/informations/media/${id}`
	}

	// Method to get media download URL
	public getMediaDownloadUrl(id: string): string {
		return `${this.baseURL}v1/informations/media/${id}?download=true`
	}

	// API specific methods with types

	// AUTH
	public async login(email: string, password: string): Promise<ApiResponse<IAuthResponse>> {
		return this.post<IAuthResponse>("v1/users/login", { email: email, password: password })
	}

	public async register(userData: {
		email: string
		password: string
		name: string
		firstName: string
		birthDate: string
	}): Promise<ApiResponse<IAuthResponse>> {
		return this.post<IAuthResponse>("v1/users/create", userData)
	}

	public async logout(refreshToken: string): Promise<ApiResponse<void>> {
		const response = await this.post<void>("v1/users/logout", { refreshToken })
		if (response.success) {
			clearAuthCookies()
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
		return this.get<IUsersListResponse>("v1/users/get-users", params)
	}

	public async getUser(id: string): Promise<ApiResponse<{ user: IUser }>> {
		return this.get<{ user: IUser }>(`v1/users/get-user/${id}`)
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
		return this.put<IUser>(`v1/users/update/${id}`, userData)
	}

	public async adminCreateUser(userData: {
		email: string
		password: string
		name: string
		firstName: string
		birthDate: string
		role: "user" | "administrator"
	}): Promise<ApiResponse<IUser>> {
		return this.post<IUser>("v1/users/admin-create", userData)
	}

	public async deleteUser(id: string): Promise<ApiResponse<void>> {
		return this.delete(`v1/users/delete/${id}`)
	}

	// CATEGORIES
	public async getAdminCategories(): Promise<ApiResponse<ICategoryListResponse>> {
		return this.get<ICategoryListResponse>("v1/category/get-categories")
	}

	public async getPublicCategories(): Promise<ApiResponse<ICategoryListResponse>> {
		return this.get<ICategoryListResponse>("v1/category/get-public-categories")
	}

	public async createCategory(categoryData: {
		name: string
		isActive?: boolean
	}): Promise<ApiResponse<ICategoryResponse>> {
		return this.post<ICategoryResponse>("v1/category/create", categoryData)
	}

	public async updateCategory(
		id: string,
		categoryData: {
			name?: string
			isActive?: boolean
		}
	): Promise<ApiResponse<ICategoryResponse>> {
		return this.put<ICategoryResponse>(`v1/category/update/${id}`, categoryData)
	}

	public async deleteCategory(id: string): Promise<ApiResponse<ICategoryResponse | void>> {
		return this.delete<ICategoryResponse | void>(`v1/category/delete/${id}`)
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
		return this.get<IInformationsListResponse>("v1/informations/get-informations", params)
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
		return this.get<IInformationsListResponse>("v1/informations/get-public-informations", params)
	}
	public async getPublicInformationById(id: string): Promise<ApiResponse<IInformationResponse>> {
		return this.get<IInformationResponse>(`v1/informations/get-public-information/${id}`)
	}
	public async createInformation(formData: FormData): Promise<ApiResponse<ICreateInformationResponse>> {
		return this.uploadFile<ICreateInformationResponse>("v1/informations/create", formData)
	}

	public async updateInformation(
		id: string,
		formData: FormData
	): Promise<ApiResponse<ICreateInformationResponse>> {
		const uploadConfig: AxiosRequestConfig = {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}

		return this.put<ICreateInformationResponse>(
			`v1/informations/update/${id}`,
			formData,
			uploadConfig
		)
	}
	public async deleteInformation(id: string): Promise<ApiResponse<void>> {
		return this.delete<void>(`v1/informations/delete/${id}`)
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
		return this.get<IActivitiesListResponse>("v1/activities/get-activities", params)
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
		return this.get<IActivitiesListResponse>("v1/activities/get-public-activities", params)
	}

	public async createActivity(formData: FormData): Promise<ApiResponse<{ activity: IActivity }>> {
		return this.uploadFile<{ activity: IActivity }>("v1/activities/create", formData)
	}

	public async updateActivity(id: string, formData: FormData): Promise<ApiResponse<IActivity>> {
		return this.uploadFile<IActivity>(`v1/activities/update/${id}`, formData)
	}

	public async deleteActivity(id: string): Promise<ApiResponse<void>> {
		return this.delete<void>(`v1/activities/delete/${id}`)
	}
}

// Export a singleton instance
const api = new ApiService()
export default api

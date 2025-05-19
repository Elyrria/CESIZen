import type {IUSer, IPagination, IActivity, IInformation} from "@/types/data"

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

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export interface IAuthResponse {
	user: IUSer
	tokens: {
		accessToken: string
		refreshToken: string
	}
}

export interface IInformationsListResponse {
	items: IInformation[]
	pagination: IPagination
	filters: Record<string>
}

export interface IActivitiesListResponse {
	items: IActivity[]
	pagination: IPagination
	filters: Record<string>
}

export interface IUsersListResponse {
	users: IUSer[]
	pagination: IPagination
}

export interface GetUserResponse {
	user: {
		_id?: string
		id?: string
		email: string
		name: string
		firstName?: string
		role: "user" | "administrator"
		birthDate?: string
		active?: boolean
		createdAt?: string
		updatedAt?: string
	}
}
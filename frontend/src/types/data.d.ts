
export interface IUser {
	id?: string
	_id?: string
	email: string
	name: string
	firstName?: string
	role: "user" | "administrator"
	birthDate?: string
	active?: boolean
	createdAt?: string
	updatedAt?: string
}

export interface IPagination {
	currentPage: number
	totalPages: number
	totalItems: number
	itemsPerPage: number
	hasNextPage: boolean
	hasPrevPage: boolean
}

export interface IActivity {
	id?: string
	_id?: string
	name: string
	descriptionActivity: string
	type: "TEXT" | "VIDEO"
	content?: string
	isActive: boolean
	authorId: string | { _id: string; name: string; id: string }
	categoryId: string[] | { _id: string; name: string; id: string }[]
	parameters?: {
		breathingPatterns?: {
			name: string
			description: string
			inspiration: number
			retention: number
			expiration: number
		}[]
		defaultPattern?: string
		recommendedDuration?: number
		benefits?: string[]
		instructions?: {
			before?: string
			during?: string
			after?: string
		}
	}
	validatedAndPublishedAt?: string | null
	validatedBy?: string | null
	fileId?: string
	fileMetadata?: {
		filename: string
		contentType: string
		size: number
		uploadDate: string
	}
	createdAt?: string
	updatedAt?: string
	mediaUrl?: string
	thumbnailUrl?: string
}

export interface IInformation {
	id?: string
	_id?: string
	title: string
	descriptionInformation: string
	name: string
	type: "TEXT" | "IMAGE" | "VIDEO"
	content?: string
	status: "DRAFT" | "PENDING" | "PUBLISHED"
	authorId: string | { _id: string; name: string; id: string }
	categoryId: string[] | { _id: string; name: string; id: string }[]
	validatedAndPublishedAt?: string | null
	validatedBy?: string | null
	fileId?: string
	fileMetadata?: {
		filename: string
		contentType: string
		size: number
		uploadDate: string
	}
	createdAt?: string
	updatedAt?: string
	mediaUrl?: string
	thumbnailUrl?: string
}

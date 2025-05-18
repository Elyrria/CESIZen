// User
export interface IUser {
	_id: string
	id: string
	email: string
	name: string
	firstName: string
	role: "user" | "administrator"
	birthDate: string
	active: boolean
	createdAt: string
	updatedAt: string
	__v: number
}

// RefreshToken
export interface IRefreshToken {
	refreshToken: string
	userId: string
	userAgent?: string
	ipAddress?: string
	isRevoked: boolean
	expiresAt: string
	createdAt: string
	updatedAt: string
}

// Information
export interface IFileMetadata {
	filename: string
	contentType: string
	size: number
	uploadDate: string
	duration?: number
	dimensions?: {
		width: number
		height: number
	}
	encoding?: string
	bitrate?: number
}

export interface IInformation {
	_id: string
	id: string
	authorId: string | User
	title: string
	descriptionInformation: string
	name: string
	type: "TEXT" | "IMAGE" | "VIDEO"
	content?: string
	status: "DRAFT" | "PENDING" | "PUBLISHED"
	validatedBy?: string | User
	validatedAndPublishedAt?: string | null
	fileId?: string
	fileMetadata?: FileMetadata
	categoryId: Array<string | Category>
	createdAt: string
	updatedAt: string
	__v: number
	mediaUrl?: string
	thumbnailUrl?: string
}

// Category
export interface ICategory {
	_id: string
	id: string
	name: string
	createdBy: string | User
	updatedBy?: string | User
	isActive: boolean
	createdAt: string
	updatedAt: string
	__v: number
}

// Activity
export interface IActivity {
	_id: string
	id: string
	authorId: string | User
	name: string
	descriptionActivity: string
	type: "TEXT" | "VIDEO"
	content?: string
	isActive: boolean
	parameters: Record<string>
	validatedBy?: string | User
	validatedAndPublishedAt?: string | null
	fileId?: string
	fileMetadata?: FileMetadata
	categoryId: Array<string | Category>
	createdAt: string
	updatedAt: string
	__v: number
	mediaUrl?: string
	thumbnailUrl?: string
}

// Types pour la pagination
export interface IPagination {
	currentPage: number
	totalPages: number
	totalItems: number
	itemsPerPage: number
	hasNextPage: boolean
	hasPrevPage: boolean
}

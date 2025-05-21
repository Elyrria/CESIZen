import {
	AbstractEntityFactory,
	UserImpl,
	TextActivity,
	TextInformation,
	ImageInformation,
	VideoActivity,
	VideoInformation,
	CategoryImpl,
} from "@/factories/index"
// Types pour toutes les entités
export type UserRole = "user" | "administrator"
export type ActivityType = "TEXT" | "VIDEO"
export type InformationType = "TEXT" | "IMAGE" | "VIDEO"
export type InformationStatus = "DRAFT" | "PENDING" | "PUBLISHED"
export type AuthorId = string | { _id: string; name: string; id: string }
export type CategoryId = string[] | { _id: string; name: string; id: string }[]
// Interfaces de base
export interface Entity {
	id: string
	_id?: string
	categoryId: CategoryId
	authorId: AuthorId
	createdAt?: string
	updatedAt?: string
	_v?: number
}
export interface IUser extends Omit<Entity, "categoryId" | "authorId"> {
	email: string
	name: string
	firstName: string
	role: UserRole
	birthDate?: string
	active?: boolean
}
export interface IActivity extends Entity {
	name: string
	descriptionActivity: string
	type: ActivityType
	content?: string
	isActive: boolean
	parameters?: object
	validatedAndPublishedAt?: string | null
	validatedBy?: string | null
	fileId?: string
	fileMetadata?: {
		filename: string
		contentType: string
		size: number
		uploadDate: string
	}
	mediaUrl?: string
	thumbnailUrl?: string
}
export interface IInformation extends Entity {
	title: string
	descriptionInformation: string
	name: string
	type: InformationType
	content?: string
	status: InformationStatus
	validatedAndPublishedAt?: string | null
	validatedBy?: string | null
	fileId?: string
	fileMetadata?: {
		filename: string
		contentType: string
		size: number
		uploadDate: string
	}
	mediaUrl?: string
	thumbnailUrl?: string
}
export interface ICategory extends Omit<Entity, "categoryId" | "authorId"> {
	name: string
	createdBy: string
	isActive: boolean
	updatedBy?: string
}
export interface IPagination {
	currentPage?: number
	totalPages?: number
	totalItems?: number
	itemsPerPage?: number
	hasNextPage?: boolean
	hasPrevPage?: boolean
}
class EntityFactory implements AbstractEntityFactory {
	createUser(data: Partial<IUser>): IUser {
		return new UserImpl(data)
	}

	createInformation(data: Partial<IInformation>): IInformation {
		switch (data.type) {
			case "TEXT":
				return new TextInformation(data)
			case "IMAGE":
				return new ImageInformation(data)
			case "VIDEO":
				return new VideoInformation(data)
			default:
				return new TextInformation(data)
		}
	}

	createActivity(data: Partial<IActivity>): IActivity {
		switch (data.type) {
			case "TEXT":
				return new TextActivity(data)
			case "VIDEO":
				return new VideoActivity(data)
			default:
				return new TextActivity(data)
		}
	}

	createCategory(data: Partial<ICategory>): ICategory {
		return new CategoryImpl(data)
	}
}

const entityFactory = new EntityFactory()
export default entityFactory

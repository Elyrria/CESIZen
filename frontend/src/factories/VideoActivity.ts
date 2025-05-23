import type { IActivity, AuthorId, CategoryId, InformationType } from "@/factories/Factory"
import { cleanText } from "@/utils/textUtils"

export class VideoActivity implements IActivity {
	id: string
	name: string
	descriptionActivity: string
	type: Extract<InformationType, "VIDEO">
	isActive: boolean
	authorId: AuthorId
	categoryId: CategoryId
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
	createdAt?: string
	updatedAt?: string
	mediaUrl?: string
	thumbnailUrl?: string

	constructor(data: Partial<IActivity>) {
		this.id = data.id || ""
		this.name = cleanText(data.name) || ""
		this.descriptionActivity = cleanText(data.descriptionActivity) || ""
		this.type = "VIDEO"
		this.isActive = data.isActive !== undefined ? data.isActive : true
		this.authorId = data.authorId || ""
		this.categoryId = data.categoryId || []
		this.parameters = data.parameters || {}
		this.validatedAndPublishedAt = data.validatedAndPublishedAt || null
		this.validatedBy = data.validatedBy || null
		this.fileId = data.fileId
		this.fileMetadata = data.fileMetadata
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
		this.mediaUrl = data.mediaUrl
		this.thumbnailUrl = data.thumbnailUrl || "/assets/images/video-thumbnail.png"
	}
}

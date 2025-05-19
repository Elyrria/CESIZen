import type { Activity, ActivityType, BreathingPattern } from "@/types/factory"

export class VideoActivity implements Activity {
	id?: string
	name: string
	descriptionActivity: string
	type: ActivityType
	isActive: boolean
	authorId: string
	categoryId: string[] | { _id: string; name: string; id: string }[]
	parameters?: {
		breathingPatterns?: BreathingPattern[]
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

	constructor(data: Partial<Activity>) {
		this.id = data.id
		this.name = data.name || ""
		this.descriptionActivity = data.descriptionActivity || ""
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

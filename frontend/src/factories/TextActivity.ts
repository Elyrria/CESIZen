import type { ActivityType, BreathingPattern, Activity } from "@/types/factory"

export class TextActivity implements Activity {
	id?: string
	name: string
	descriptionActivity: string
	type: ActivityType
	content?: string
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
	createdAt?: string
	updatedAt?: string
	thumbnailUrl?: string

	constructor(data: Partial<Activity>) {
		this.id = data.id
		this.name = data.name || ""
		this.descriptionActivity = data.descriptionActivity || ""
		this.type = "TEXT"
		this.content = data.content || ""
		this.isActive = data.isActive !== undefined ? data.isActive : true
		this.authorId = data.authorId || ""
		this.categoryId = data.categoryId || []
		this.parameters = data.parameters || {}
		this.validatedAndPublishedAt = data.validatedAndPublishedAt || null
		this.validatedBy = data.validatedBy || null
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
		this.thumbnailUrl = data.thumbnailUrl || "/assets/images/text-icon.png"
	}
}

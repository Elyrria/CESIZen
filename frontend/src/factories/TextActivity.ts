import type { IActivity, AuthorId, CategoryId, InformationType } from "@/factories/Factory"

export class TextActivity implements IActivity {
	id: string
	name: string
	descriptionActivity: string
	type: Extract<InformationType, "TEXT">
	content?: string
	isActive: boolean
	authorId: AuthorId
	categoryId: CategoryId
	parameters?: object
	validatedAndPublishedAt?: string | null
	validatedBy?: string | null
	createdAt?: string
	updatedAt?: string
	thumbnailUrl?: string

	constructor(data: Partial<IActivity>) {
		this.id = data.id || ""
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

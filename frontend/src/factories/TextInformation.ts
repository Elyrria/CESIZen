import type { IInformation, InformationType, InformationStatus, AuthorId, CategoryId } from "@/factories/Factory"

export class TextInformation implements IInformation {
	id: string
	title: string
	descriptionInformation: string
	name: string
	type: InformationType
	content: string
	status: InformationStatus
	authorId: AuthorId
	categoryId: CategoryId
	validatedAndPublishedAt?: string | null
	validatedBy?: string | null
	createdAt?: string
	updatedAt?: string
	thumbnailUrl?: string

	constructor(data: Partial<IInformation>) {
		this.id = data.id || ""
		this.title = data.title || ""
		this.descriptionInformation = data.descriptionInformation || ""
		this.name = data.name || ""
		this.type = "TEXT"
		this.content = data.content || ""
		this.status = data.status || "DRAFT"
		this.authorId = data.authorId || ""
		this.categoryId = data.categoryId || []
		this.validatedAndPublishedAt = data.validatedAndPublishedAt || null
		this.validatedBy = data.validatedBy || null
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
		this.thumbnailUrl = data.thumbnailUrl || "/assets/images/text-icon.png"
	}
}

import type { Information, InformationStatus, InformationType } from "@/types/factory"

export class ImageInformation implements Information {
	id?: string
	title: string
	descriptionInformation: string
	name: string
	type: InformationType
	status: InformationStatus
	authorId: string
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

	constructor(data: Partial<Information>) {
		this.id = data.id
		this.title = data.title || ""
		this.descriptionInformation = data.descriptionInformation || ""
		this.name = data.name || ""
		this.type = "IMAGE"
		this.status = data.status || "DRAFT"
		this.authorId = data.authorId || ""
		this.categoryId = data.categoryId || []
		this.validatedAndPublishedAt = data.validatedAndPublishedAt || null
		this.validatedBy = data.validatedBy || null
		this.fileId = data.fileId
		this.fileMetadata = data.fileMetadata
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
		this.mediaUrl = data.mediaUrl
	}
}

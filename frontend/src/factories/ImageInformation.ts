import type { IInformation, InformationType, InformationStatus } from "@/factories/Factory"
import { cleanText } from "@/utils/textUtils"

export class ImageInformation implements IInformation {
	fileMetadata?: {
		filename: string
		contentType: string
		size: number
		uploadDate: string
	}
	_id?: string
	title: string
	descriptionInformation: string
	name: string
	type: InformationType
	status: InformationStatus
	authorId: string | { _id: string; name: string; id: string }
	categoryId: string[] | { _id: string; name: string; id: string }[]
	validatedAndPublishedAt?: string | null
	validatedBy?: string | null
	fileId?: string
	createdAt?: string
	updatedAt?: string
	mediaUrl?: string
	id: string
	thumbnailUrl?: string

	constructor(data: Partial<IInformation>) {
		this.id = data.id || data._id || ""
		this.title = cleanText(data.title) || ""
		this.descriptionInformation = cleanText(data.descriptionInformation) || ""
		this.name = cleanText(data.name) || ""
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
		this.thumbnailUrl = data.thumbnailUrl
	}
}

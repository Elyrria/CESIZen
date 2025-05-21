import type { ICategory} from "@/factories/Factory"

export class CategoryImpl implements ICategory {
	id: string
	name: string
	isActive: boolean
	createdBy: string
	updatedBy?: string
	createdAt?: string
	updatedAt?: string

	constructor(data: Partial<ICategory>) {
		this.id = data.id ||""
		this.name = data.name || ""
		this.isActive = data.isActive !== undefined ? data.isActive : true
		this.createdBy = data.createdBy || ""
		this.updatedBy = data.updatedBy
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
	}
}

import type { Category } from "@/types/factory"

export class CategoryImpl implements Category {
	id?: string
	name: string
	isActive: boolean
	createdBy?: string
	updatedBy?: string
	createdAt?: string
	updatedAt?: string

	constructor(data: Partial<Category>) {
		this.id = data.id
		this.name = data.name || ""
		this.isActive = data.isActive !== undefined ? data.isActive : true
		this.createdBy = data.createdBy
		this.updatedBy = data.updatedBy
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
	}
}

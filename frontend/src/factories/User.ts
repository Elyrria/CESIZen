import type { User, UserRole } from "@/types/factory"

export class UserImpl implements User {
	id?: string
	email: string
	name: string
	firstName?: string
	role: UserRole
	birthDate?: string
	active?: boolean
	createdAt?: string
	updatedAt?: string

	constructor(data: Partial<User>) {
		this.id = data.id || data._id 
		this.email = data.email || ""
		this.name = data.name || ""
		this.firstName = data.firstName
		this.role = data.role || "user"
		this.birthDate = data.birthDate
		this.active = data.active !== undefined ? data.active : true
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
	}
}

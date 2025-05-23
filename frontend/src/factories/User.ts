import type { IUser, UserRole } from "@/factories/Factory"
import { parseToFrenchDate } from "@/utils/dateUtils"
export class UserImpl implements IUser {
	id: string
	email: string
	name: string
	firstName: string
	role: UserRole
	birthDate?: string
	active?: boolean
	createdAt?: string
	updatedAt?: string
	_v?: number

	constructor(data: Partial<IUser>) {
		this.id = data.id || data._id || ""
		this.email = data.email || ""
		this.name = data.name || ""
		this.firstName = data.firstName || ""
		this.role = data.role || "user"
		this.birthDate = parseToFrenchDate(data.birthDate)
		this.active = data.active !== undefined ? data.active : true
		this.createdAt = data.createdAt
		this.updatedAt = data.updatedAt
		this._v = data._v
	}
}

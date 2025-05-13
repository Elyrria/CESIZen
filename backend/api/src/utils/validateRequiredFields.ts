import type { IInformationDocument } from "@api/types/information.d.ts"

import type { IUserCreate } from "@api/types/user.d.ts"
// Helper function for validating required fields
export function validateRequiredUserFields(user: Partial<IUserCreate>): boolean {
	return Boolean(user.role && user.password && user.email && user.name && user.firstName && user.birthDate)
}

export function validateRequierdInformationFields(information: Partial<IInformationDocument>): boolean {
	return Boolean(information.title && information.description && information.name && information.type)
}

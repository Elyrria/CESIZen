import type { IUserCreate } from "@api/types/user.d.ts"
// Helper function for validating required fields
export function validateRequiredUserFields(user: Partial<IUserCreate>): boolean {
	return Boolean(user.role && user.password && user.email && user.name && user.firstName && user.birthDate)
}

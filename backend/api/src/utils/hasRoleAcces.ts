import { ROLE_HIERARCHY, ROLES } from "@configs/role.configs.ts"
import type { Role } from "../../types/roles.d.ts"

export const isValidRole = (role: string): boolean => {
	return Object.values(ROLES).includes(role as Role)
}

export const hasRoleAccess = (userRole: Role, requiredRole: Role): boolean => {
	const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole)
	const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole)

	return userRoleIndex !== -1 && requiredRoleIndex !== -1 && userRoleIndex <= requiredRoleIndex
}

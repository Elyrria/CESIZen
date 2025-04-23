export const ROLES = {
	ADMIN: "administrator",
	REGISTERED_USER: "user",
} as const

export const ROLE_HIERARCHY = [ROLES.ADMIN, ROLES.REGISTERED_USER]

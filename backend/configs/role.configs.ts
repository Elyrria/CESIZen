import { getEnv } from "@utils/getEnv.ts"

export const ROLES = {
	ADMIN: getEnv("ADMIN"),
	REGISTERED_USER: getEnv("USER"),
} as const

export const ROLE_HIERARCHY = [ROLES.ADMIN, ROLES.REGISTERED_USER]

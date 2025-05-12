import { getCreatedFilter, getRegexFilter, getUpdatedFilter } from "@mongoQueryBuilders/utils/index.ts"
import type { IQueryInterface } from "@api/types/request.d.ts"
import { FIELD } from "@configs/fields.configs.ts"
import { type Request } from "express"
/**
 * Builds a MongoDB query based on request parameters and user role
 *
 * @param req - The authenticated request object containing query parameters
 * @param userRoleIndex - The role index of the authenticated user (0 = super-admin, 1 = admin)
 * @returns MongoDB query object
 */

export const buildUserQuery = (req: Request, userRoleIndex: number): IQueryInterface => {
	const query: IQueryInterface = {}

	getRegexFilter(req, query, FIELD.FIRST_NAME as keyof IQueryInterface)
	getRegexFilter(req, query, FIELD.EMAIL as keyof IQueryInterface)
	getRegexFilter(req, query, FIELD.NAME as keyof IQueryInterface)

	if (req.query.role) {
		const requestedRoles: string[] = Array.isArray(req.query.role)
			? (req.query.role as string[])
			: [req.query.role as string]
		// Super-administrateurs peuvent tout filtrer
		if (userRoleIndex === 0) {
			query.role = { $in: requestedRoles }
		}
	}

	getCreatedFilter(req, query)
	getUpdatedFilter(req, query)

	return query
}

import { getCreatedFilter, getRegexFilter, getUpdatedFilter } from "@mongoQueryBuilders/utils/index.ts"
import type { IQueryInterface } from "@api/types/request.d.ts"
import { MEDIATYPE, STATUS } from "@configs/global.configs.ts"
import { FIELD } from "@configs/fields.configs.ts"
import { type Request } from "express"
import mongoose from "mongoose"
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
		// Super-administrators can filter everything
		if (userRoleIndex === 0) {
			query.role = { $in: requestedRoles }
		}
	}

	getCreatedFilter(req, query)
	getUpdatedFilter(req, query)

	return query
}

/**
 * Builds a query object for filtering information based on request parameters
 *
 * @param req - The request object containing query parameters
 * @returns A query object for mongoose
 */
export const buildInformationQuery = (req: Request): IQueryInterface => {
	const query: IQueryInterface = {}

	// Global search parameter - searches across multiple fields
	if (req.query.search) {
		const searchTerm = req.query.search as string
		query.$or = [
			{ title: { $regex: searchTerm, $options: "i" } },
			{ descriptionInformation: { $regex: searchTerm, $options: "i" } },
			{ name: { $regex: searchTerm, $options: "i" } }
		]
	} else {
		// Text-based filters (only if no global search)
		getRegexFilter(req, query, FIELD.TITLE as keyof IQueryInterface)
		getRegexFilter(req, query, FIELD.DESCRIPTION_INFORMATION as keyof IQueryInterface)
		getRegexFilter(req, query, FIELD.NAME as keyof IQueryInterface)
	}

	// Type filter (exact match)
	if (req.query.type) {
		const requestedTypes: string[] = Array.isArray(req.query.type)
			? (req.query.type as string[])
			: [req.query.type as string]

		// Only allow valid types
		const validTypes = requestedTypes.filter((type) => MEDIATYPE.includes(type))
		if (validTypes.length > 0) {
			query.type = { $in: validTypes }
		}
	}

	// Status filter (exact match)
	if (req.query.status) {
		const requestedStatuses: string[] = Array.isArray(req.query.status)
			? (req.query.status as string[])
			: [req.query.status as string]

		// Only allow valid statuses
		const validStatuses = requestedStatuses.filter((status) => STATUS.includes(status))
		if (validStatuses.length > 0) {
			query.status = { $in: validStatuses }
		}
	}

	// Author filter
	if (req.query.authorId && mongoose.Types.ObjectId.isValid(req.query.authorId as string)) {
		query.authorId = new mongoose.Types.ObjectId(req.query.authorId as string)
	}

	// Date filters
	getCreatedFilter(req, query)
	getUpdatedFilter(req, query)

	// Filter for validated content
	if (req.query.validated === "true") {
		query.validatedAndPublishedAt = { $ne: null }
	} else if (req.query.validated === "false") {
		query.validatedAndPublishedAt = null
	}

	return query
}


/**
 * Builds a query object for filtering activities based on request parameters
 *
 * @param req - The request object containing query parameters
 * @returns A query object for mongoose
 */
export const buildActivityQuery = (req: Request): IQueryInterface => {
	const query: IQueryInterface = {}

	// Global search parameter - searches across multiple fields
	if (req.query.search) {
		const searchTerm = req.query.search as string
		query.$or = [
			{ descriptionActivity: { $regex: searchTerm, $options: "i" } },
			{ name: { $regex: searchTerm, $options: "i" } }
		]
	} else {
		// Text-based filters
		getRegexFilter(req, query, FIELD.NAME as keyof IQueryInterface)
		getRegexFilter(req, query, FIELD.DESCRIPTION_ACTIVITY as keyof IQueryInterface)
	}

	// Type filter (exact match)
	if (req.query.type) {
		const requestedTypes: string[] = Array.isArray(req.query.type)
			? (req.query.type as string[])
			: [req.query.type as string]

		// Only allow valid types
		const validTypes = requestedTypes.filter((type) => MEDIATYPE.includes(type))
		if (validTypes.length > 0) {
			query.type = { $in: validTypes }
		}
	}

	// isActive filter (boolean)
	if (req.query.isActive !== undefined) {
		query.isActive = req.query.isActive === "true"
	}

	// Author filter
	if (req.query.authorId && mongoose.Types.ObjectId.isValid(req.query.authorId as string)) {
		query.authorId = new mongoose.Types.ObjectId(req.query.authorId as string)
	}

	// Category filter
	if (req.query.categoryId && mongoose.Types.ObjectId.isValid(req.query.categoryId as string)) {
		query.categoryId = new mongoose.Types.ObjectId(req.query.categoryId as string)
	}

	// Date filters
	getCreatedFilter(req, query)
	getUpdatedFilter(req, query)

	// Filter for validated content
	if (req.query.validated === "true") {
		query.validatedAndPublishedAt = { $ne: null }
	} else if (req.query.validated === "false") {
		query.validatedAndPublishedAt = null
	}

	return query
}
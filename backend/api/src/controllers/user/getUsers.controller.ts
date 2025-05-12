import { checkAuthentification, checkUserRole } from "@controllers/user/utils/checkAuth.ts"
import { errorHandler, handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { buildUserQuery, getPaginationOptions } from "@mongoQueryBuilders/index.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { okHandler } from "@successHandler/successHandler.ts"
import type { IUser } from "@api/types/user.d.ts"
import type { Request, Response } from "express"
import { decryptData } from "@utils/crypto.ts"
import { User } from "@models/index.ts"
/**
 * Controller for retrieving all user registrations with authentication.
 *
 * This controller handles the process of retrieving all user registrations by an authenticated user.
 * It checks the authenticated user's role and ensures they have the necessary permissions to access user data.
 *
 * @param {AuthRequest} req - The authenticated request object.
 * @param {Response} res - The response object to send the list of users or an error message.
 * @returns {Promise<Response>} - A promise that resolves to the response object with the list of users or an error message.
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
	try {
		// Check authentication and retrieve the authenticated user
		const user: IUser | null = await checkAuthentification(req)

		let userRoleIndex: number = -1

		try {
			// Determine the role index for the authenticated user
			userRoleIndex = user?.role ? checkUserRole(user.role) : userRoleIndex
		} catch (error: unknown) {
			const errorType = error instanceof Error ? error.message : ERROR_CODE.SERVER
			errorHandler(res, errorType)
			return
		}

		// Ensure the authenticated user has sufficient permissions to access user data
		if (userRoleIndex > 0) {
			errorHandler(res, ERROR_CODE.INSUFFICIENT_ACCESS)
			return
		}
		// Build query based on role and request parameters
		const query = buildUserQuery(req, userRoleIndex)
		// Get pagination and sorting options
		const { page, limit, skip, sortOptions } = getPaginationOptions(req)
		// Execute the query with all filters and options
		const users = await User.find(query)
			.select("_id email firstName name role createdAt updatedAt")
			.sort(sortOptions)
			.skip(skip)
			.limit(limit)
			.lean()

		if (!users) {
			// Return an error if no conditions are met
			errorHandler(res, ERROR_CODE.NO_CONDITIONS)
			return
		}
		// Get total count for pagination
		const total: number = await User.countDocuments(query)
		if (total === 0) {
			okHandler(res, SUCCESS_CODE.NO_USER, { users: [], pagination: {} })
			return
		}
		const pagination = { total: total, page: page, limit: limit, totalPages: Math.ceil(total / limit) }
		// List of fields to decrypt
		const ENCRYPTED_FIELDS = ["name", "firstName", "birthDate"]

		// Decrypt user data
		const decryptedUserResponse = decryptData(users, ENCRYPTED_FIELDS)

		okHandler(res, users.length > 1 ? SUCCESS_CODE.USERS_FOUND : SUCCESS_CODE.USER_FOUND, {
			users: decryptedUserResponse,
			pagination: pagination,
		})

		return
	} catch (error: unknown) {
		handleUnexpectedError(res, error as Error)
		return
	}
}

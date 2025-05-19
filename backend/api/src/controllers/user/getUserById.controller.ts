import { checkAuthentification, checkUserRole } from "@controllers/user/utils/checkAuth.ts"
import { errorHandler, handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { okHandler } from "@successHandler/successHandler.ts"
import type { IUser } from "@api/types/user.d.ts"
import type { Request, Response } from "express"
import { decryptData } from "@utils/crypto.ts"
import { User } from "@models/index.ts"

/**
 * Controller for retrieving a specific user by ID with authentication.
 *
 * This controller handles the process of retrieving a user by their ID.
 * It checks the authenticated user's role and ensures they have the necessary permissions to access user data.
 *
 * @param {Request} req - The request object containing the user ID in params.
 * @param {Response} res - The response object to send the user data or an error message.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
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

		// Get user ID from request parameters
		const userId = req.params.id

		if (!userId) {
			errorHandler(res, ERROR_CODE.MISSING_INFO)
			return
		}

		// Find user by ID
		const foundUser = await User.findById(userId)
			.select("_id email firstName name role createdAt updatedAt")
			.lean()

		if (!foundUser) {
			errorHandler(res, ERROR_CODE.USER_NOT_FOUND)
			return
		}

		// List of fields to decrypt
		const ENCRYPTED_FIELDS = ["name", "firstName", "birthDate"]

		// Decrypt user data
		const decryptedUserResponse = decryptData([foundUser], ENCRYPTED_FIELDS)

		okHandler(res, SUCCESS_CODE.USER_FOUND, {
			user: decryptedUserResponse[0],
		})

		return
	} catch (error: unknown) {
		handleUnexpectedError(res, error as Error)
		return
	}
}

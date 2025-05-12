import { errorHandler, handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { prepareUserAuthResponse } from "@controllers/user/utils/userAuthUtils.ts"
import { validateRequiredUserFields } from "@utils/validateRequiredFields.ts"
import { checkAuthentification, checkUserRole } from "@controllers/user/utils/checkAuth.ts"
import type { IUser, IUserReqBodyRequest } from "@api/types/user.d.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { createdHandler } from "@successHandler/successHandler.ts"
import { processUserData } from "@utils/crypto.ts"
import { deleteObjectIds } from "@utils/idCleaner.ts"
import type { Request, Response } from "express"
import { User } from "@models/index.ts"
import bcrypt from "bcrypt"
/**
 * Controller for user creation by administrators.
 *
 * This controller handles the process of creating a new user by an authenticated user
 * with administrative privileges. It checks the authenticated user's role and ensures
 * they have the necessary permissions to create a user with the requested role.
 *
 * @param {Request} req - The Express request object containing user details in the body.
 *                        User authentication is verified via the token in the headers.
 * @param {Response} res - The Express response object used to send the response to the client.
 * @returns {Promise<void>} - A promise that resolves with no value when the response has been sent.
 * 
 * @throws {Error} - If an unexpected error occurs during processing.
 * 
 */
export const adminCreateUser = async (req: Request, res: Response): Promise<void> => {
	try {
		// Extract user details from the request body
		const userObject: IUserReqBodyRequest = req.body as IUser
		// Remove any user IDs from the request body for security reasons
		const cleanUserObject = deleteObjectIds(userObject)

		// Validate the presence of required fields
		if (!validateRequiredUserFields(cleanUserObject)) {
			errorHandler(res, ERROR_CODE.MISSING_INFO)
			return
		}

		// Check if the user is exist
		const userExist = await User.findOne({ email: userObject.email })

		if (userExist) {
			errorHandler(res, ERROR_CODE.UNABLE_CREATE_USER)
			return
		}

		// Check authentication and retrieve the authenticated user
		const user: IUser | null = await checkAuthentification(req)

		let userRoleIndex: number = -1
		let reqUserRoleIndex: number = -1

		try {
			// Determine the role indices for the authenticated user and the requested user
			userRoleIndex = user?.role ? checkUserRole(user.role) : userRoleIndex
			reqUserRoleIndex = checkUserRole(cleanUserObject.role)
		} catch (error: unknown) {
			// Handle unexpected errors
			const errorType = error instanceof Error ? error.message : ERROR_CODE.SERVER
			errorHandler(res, errorType)
			return
		}

		// Ensure both roles are valid
		if (userRoleIndex === -1 || reqUserRoleIndex === -1) {
			errorHandler(res, ERROR_CODE.ROLE_UNAVAILABLE)
			return
		}

		// Ensure the authenticated user has sufficient permissions to create the requested user role
		if (userRoleIndex > reqUserRoleIndex) {
			errorHandler(res, ERROR_CODE.INSUFFICIENT_ACCESS)
			return
		}

		// Create and save new user
		const newUser = await processUserData(cleanUserObject)
		const savedUser = await newUser.save()

		if (!savedUser) {
			errorHandler(res, ERROR_CODE.SERVER)
			return
		}

		// Prepare user object without password for token generation
		const { password, _id, ...userWithoutPassword } = savedUser.toObject()

		// Prepare auth response (tokens and user data)
		const authResponse = await prepareUserAuthResponse({ ...userWithoutPassword, id: _id }, req, res, true)
		if (!authResponse) return // Error already handled in the function

		// Return success response
		createdHandler(res, SUCCESS_CODE.USER_CREATED, authResponse)
		return
	} catch (error: unknown) {
		handleUnexpectedError(res, error as Error)
		return
	}
}

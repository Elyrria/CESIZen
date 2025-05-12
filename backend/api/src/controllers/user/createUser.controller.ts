import { errorHandler, handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { prepareUserAuthResponse } from "@controllers/user/utils/userAuthUtils.ts"
import { validateRequiredUserFields } from "@utils/validateRequiredFields.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import type { IUser, IUserReqBodyRequest } from "@api/types/user.d.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { createdHandler } from "@successHandler/successHandler.ts"
import { deleteObjectIds } from "@utils/idCleaner.ts"
import { processUserData } from "@utils/crypto.ts"
import type { Request, Response } from "express"
import { User } from "@models/index.ts"

/**
 * Controller for creating a new user.
 *
 * This controller handles the process of creating a new user with the provided email, password, and pseudonym.
 * It hashes the password, saves the user to the database, and generates access and refresh tokens for the new user.
 *
 * @param {Request} req - The request object containing user details in the body.
 * @param {Response} res - The response object to send the created user details and tokens or an error message.
 * @returns {Promise<Response>} - A promise that resolves to the response object with user details and tokens or an error message.
 */
export const createUser = async (req: Request, res: Response): Promise<void> => {
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

		// Check if user already exists
		const userExist = await User.findOne({ email: userObject.email })
		if (userExist) {
			errorHandler(res, ERROR_CODE.UNABLE_CREATE_USER)
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
		const authResponse = await prepareUserAuthResponse({ ...userWithoutPassword, id: _id }, req, res)
		if (!authResponse) return // Error already handled in the function

		// Return success response
		createdHandler(res, SUCCESS_CODE.USER_CREATED, authResponse)
	} catch (error) {
		handleUnexpectedError(res, error as Error)
	}
}
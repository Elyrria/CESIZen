import { errorHandler, handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { prepareUserAuthResponse } from "@controllers/user/utils/userAuthUtils.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { okHandler } from "@successHandler/successHandler.ts"
import type { Request, Response } from "express"
import { User } from "@models/index.ts"
import bcrypt from "bcrypt"

/**
 * Controller for user login.
 *
 * This controller handles the process of authenticating a user based on the provided email and password.
 * It verifies the credentials, and if valid, generates access and refresh tokens for the user.
 *
 * @param {Request} req - The request object containing user credentials in the body.
 * @param {Response} res - The response object to send the tokens or an error message.
 * @returns {Promise<Response>} - A promise that resolves to the response object with tokens or an error message.
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
	try {
		// Find the user by email
		const user = await User.findOne({ email: req.body.email })

		// Check if the user exists and has a password
		if (!user || !user.password) {
			errorHandler(res, ERROR_CODE.UNABLE_CREATE_USER)
			return
		}

		// Verify the provided password with the stored hashed password
		const isValid: boolean = await bcrypt.compare(req.body.password, user.password)

		if (!isValid) {
			errorHandler(res, ERROR_CODE.UNABLE_CREATE_USER)
			return
		}
		// Prepare user object without password for token generation
		const { password, _id, ...userWithoutPassword } = user.toObject()
		// Prepare auth response (tokens and user data)
		const authResponse = await prepareUserAuthResponse({ ...userWithoutPassword, id: _id }, req, res)
		if (!authResponse) return // Error already handled in the function

		// Return success response
		okHandler(res, SUCCESS_CODE.USERS_FOUND, authResponse)
	} catch (error) {
		handleUnexpectedError(res, error as Error)
	}
}

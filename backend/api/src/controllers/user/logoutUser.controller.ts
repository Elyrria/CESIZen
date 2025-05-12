import { errorHandler, handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { okHandler } from "@successHandler/successHandler.ts"
import type { Request, Response } from "express"
import { RefreshToken } from "@models/index.ts"

/**
 * Controller for user logout.
 *
 * This controller handles the process of logging out a user by invalidating their refresh token.
 * It deletes the refresh token from the database, effectively logging the user out.
 *
 * @param {Request} req - The request object containing the refresh token in the body.
 * @param {Response} res - The response object to send a success message or an error message.
 * @returns {Promise<Response>} - A promise that resolves to the response object with a success message or an error message.
 */
export const logoutUser = async (req: Request, res: Response): Promise<void> => {
	try {
		// Extract the refresh token from the request body
		const refreshToken: string = req.body.refreshToken

		if (!refreshToken) {
			errorHandler(res, ERROR_CODE.REFRESH_TOKEN_REQUIRED)
			return
		}
		// Delete the refresh token from the database
		await RefreshToken.deleteOne({ refreshToken: refreshToken })
		// Return a success message
		okHandler(res, SUCCESS_CODE.LOGOUT_SUCCESS)
		return
	} catch (error: unknown) {
		handleUnexpectedError(res, error as Error)
		return
	}
}

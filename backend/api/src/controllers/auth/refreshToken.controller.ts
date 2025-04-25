import { errorHandler, handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { validateStoredToken } from "@controllers/auth/utils/validateStoredToken.ts"
import {processTokenRenewal} from "@controllers/auth/utils/processTokenRenewal.ts"
import { revokeToken } from "@controllers/auth/utils/revokeToken.ts"
import type { IRefreshTokenRequest } from "@api/types/tokens.d.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { CONFIGS } from "@configs/global.configs.ts"
import type { Request, Response } from "express"
/**
 * Controller for refreshing the access token.
 *
 * This controller handles the process of refreshing an access token using a provided refresh token.
 * It verifies the validity of the refresh token, decodes it to retrieve user information,
 * and generates a new access token if the refresh token is valid.
 *
 * @param {Request} req - The request object containing the refresh token in the body.
 * @param {Response} res - The response object to send the new access token or an error message.
 * @returns {Promise<void>} - A promise that resolves to the response with the new access token or an error message.
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
	try {
		// Validate request body
		if (!req.sanitizedBody) {
			errorHandler(res, ERROR_CODE.SERVER)
			return
		}
	

		const tokenData: IRefreshTokenRequest = req.sanitizedBody as IRefreshTokenRequest
		const { refreshToken, userId } = tokenData

		// Validate refresh token is provided
		if (!refreshToken || !userId) {
			errorHandler(res, ERROR_CODE.INVALID_TOKEN)
			return
		}

		// Validate secret key availability
		const secretKey: string = CONFIGS.TOKEN_SECRET.KEY
		if (!secretKey) {
			errorHandler(res, ERROR_CODE.SERVER)
			return
		}

		// Get User-Agent for security validation
		const userAgent = req.headers["user-agent"] || "unknown"

		// Find and validate stored token
		const storedToken = await validateStoredToken(res, refreshToken, userAgent)
		if (!storedToken) return

		try {
			// Process token renewal
			return await processTokenRenewal(res, refreshToken, userId, secretKey, storedToken)
		} catch (tokenError: any) {
			await revokeToken(storedToken)
			errorHandler(res, ERROR_CODE.EXPIRED_TOKEN, tokenError.message, tokenError)
			return
		}
	} catch (error: unknown) {
		handleUnexpectedError(res, error as Error)
		return
	}
}
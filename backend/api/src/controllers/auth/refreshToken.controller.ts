import { errorHandler, handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { SUCCESS_MESSAGE } from "@successHandler/configs.successHandler.ts"
import type { IRefreshTokenDocument } from "@api/types/tokens.d.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { successHandler } from "@successHandler/successHandler.ts"
import { decryptData } from "@utils/crypto.ts"
import { generateAccesToken } from "@utils/generateTokens.ts"
import type { IDecodedToken } from "@api/types/tokens.d.ts"
import { CONFIGS } from "@configs/global.configs.ts"
import type { Request, Response } from "express"
import { RefreshToken } from "@models/index.ts"
import jwt from "jsonwebtoken"

/**
 * Controller for refreshing the access token.
 *
 * This controller handles the process of refreshing an access token using a provided refresh token.
 * It verifies the validity of the refresh token, decodes it to retrieve user information,
 * and generates a new access token if the refresh token is valid.
 *
 * @param {Request} req - The request object containing the refresh token in the body.
 * @param {Response} res - The response object to send the new access token or an error message.
 * @returns {Promise<Response>} - A promise that resolves to the response object with the new access token or an error message.
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.sanitizedBody) {
			errorHandler(res, ERROR_CODE.SERVER)
			return
		}

		const tokenData: Pick<IRefreshTokenDocument, "refreshToken"> = req.sanitizedBody as Pick<
			IRefreshTokenDocument,
			"refreshToken"
		>
		const refreshToken = tokenData.refreshToken
		// Check if the refresh token is provided
		if (!refreshToken) {
			errorHandler(res, ERROR_CODE.INVALID_TOKEN)

			return
		}

		// Retrieve the secret key from environment variables
		const secretKey: string = CONFIGS.TOKEN_SECRET.KEY
		if (!secretKey) {
			errorHandler(res, ERROR_CODE.SERVER)
			return
		}
		// Get User-Agent
		const userAgent = req.headers["user-agent"] || "unknown"
		// Find the stored refresh token in the database
		const storedToken: IRefreshTokenDocument | null = await RefreshToken.findOne({
			refreshToken: refreshToken,
		})
		if (!storedToken) {
			errorHandler(res, ERROR_CODE.INVALID_TOKEN)
			return
		}

		// Check if token is revoked or expired using our new methods
		if (storedToken.isRevoked) {
			errorHandler(res, ERROR_CODE.INVALID_TOKEN, "Token has been revoked")
			return
		}

		if (storedToken.isExpired()) {
			errorHandler(res, ERROR_CODE.EXPIRED_TOKEN, "Token has expired")
			return
		}

		/**
		 * List of field names that need to be decrypted
		 */
		const ENCRYPTED_FIELDS = ["userAgent", "ipAddress"]

		const decryptUserAgent = decryptData(storedToken, ENCRYPTED_FIELDS)

		if (decryptUserAgent.userAgent && decryptUserAgent.userAgent !== userAgent) {
			//Log potential security concern
			console.warn(`User agent mismatch for token: ${decryptUserAgent._id}`)
			storedToken.revokeToken()
			await storedToken.save()
			errorHandler(res, ERROR_CODE.INVALID_TOKEN, "Security validation failed")
		}

		try {
			// Verify and decode the refresh token
			const decoded: IDecodedToken = jwt.verify(refreshToken, secretKey) as IDecodedToken

			// Extract user information from the decoded token
			const user = { id: decoded.userId, role: decoded.role }

			// Generate a new access token
			const accessToken = generateAccesToken(user)
			if (!accessToken) {
				errorHandler(res, ERROR_CODE.SERVER)
				return
			}
			// Return the new access token in the response
			successHandler(res, SUCCESS_MESSAGE.TOKEN_RENEWED, { tokens: { accessToken, refreshToken } })
			return
		} catch (error: any) {
			storedToken.revokeToken()
			await storedToken.save()
			errorHandler(res, ERROR_CODE.EXPIRED_TOKEN, error.message, error)
			return
		}
	} catch (error: unknown) {
		// Handle unexpected errors
		handleUnexpectedError(res, error as Error)
		return
	}
}

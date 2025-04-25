import { revokeToken } from "@controllers/auth/utils/revokeToken.ts"
import type {IRefreshTokenDocument } from "@api/types/tokens.d.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { errorHandler } from "@errorHandler/errorHandler.ts"
import { RefreshToken } from "@models/index.ts"
import { decryptData } from "@utils/crypto.ts"
import type { Response } from "express"
/**
 * Validates the stored refresh token from the database
 * @param res - Response object
 * @param refreshToken - The refresh token to validate
 * @param userAgent - Current user agent
 * @returns The validated token or null if invalid
 */
export async function validateStoredToken(
	res: Response,
	refreshToken: string,
	userAgent: string
): Promise<IRefreshTokenDocument | null> {
	// Find token in database
	const storedToken = await RefreshToken.findOne({ refreshToken: refreshToken })
	if (!storedToken) {
		errorHandler(res, ERROR_CODE.INVALID_TOKEN)
		return null
	}

	// Check if token is revoked
	if (storedToken.isRevoked) {
		errorHandler(res, ERROR_CODE.REVOKED_TOKEN)
		return null
	}

	// Check if token is expired
	if (storedToken.isExpired()) {
		errorHandler(res, ERROR_CODE.EXPIRED_TOKEN)
		return null
	}

	// Validate user agent for security
	const ENCRYPTED_FIELDS = ["userAgent", "ipAddress"]
	const decryptedData = decryptData(storedToken, ENCRYPTED_FIELDS)

	if (decryptedData.userAgent && decryptedData.userAgent !== userAgent) {
		console.warn(`Security alert: User agent mismatch for token: ${decryptedData._id}`)
		await revokeToken(storedToken)
		errorHandler(res, ERROR_CODE.SECURITY_VALIDATION)
		return null
	}

	return storedToken
}

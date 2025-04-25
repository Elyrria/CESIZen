import { generateAccesToken } from "@api/src/controllers/auth/utils/generateTokens.ts"
import type { IRefreshTokenDocument, IDecodedToken } from "@api/types/tokens.d.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { revokeToken } from "@controllers/auth/utils/revokeToken.ts"
import { createdHandler } from "@successHandler/successHandler.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { errorHandler } from "@errorHandler/errorHandler.ts"
import type { IUserDocument } from "@api/types/user.d.ts"
import { User } from "@models/index.ts"
import type { Response } from "express"
import jwt from "jsonwebtoken"

/**
 * Processes token renewal once validation is complete
 */
export async function processTokenRenewal(
	res: Response,
	refreshToken: string,
	requestUserId: string,
	secretKey: string,
	storedToken: IRefreshTokenDocument
): Promise<void> {
	// Verify and decode token
	const decoded: IDecodedToken = jwt.verify(refreshToken, secretKey) as IDecodedToken

	// Find the user
	const user: IUserDocument | null = await User.findOne({ _id: decoded.userId })

	// Validate user exists
	if (!user) {
		await revokeToken(storedToken)
		errorHandler(res, ERROR_CODE.MIS_MATCH)
		return
	}
	
	// Validate user ID matches
	if (!decoded.userId || user._id.toString() !== requestUserId) {
		await revokeToken(storedToken)
		errorHandler(res, ERROR_CODE.MIS_MATCH)
		return
	}

	// Check if user is active
	if (user.active === false) {
		await revokeToken(storedToken)
		errorHandler(res, ERROR_CODE.NO_CONDITIONS)
		return
	}

	// Generate new access token
	const userData = { id: decoded.userId, role: decoded.role }
	const accessToken = generateAccesToken(userData)

	if (!accessToken) {
		errorHandler(res, ERROR_CODE.SERVER)
		return
	}

	// Return successful response
	createdHandler(res, SUCCESS_CODE.TOKEN_RENEWED, {
		tokens: { accessToken, refreshToken },
	})
}

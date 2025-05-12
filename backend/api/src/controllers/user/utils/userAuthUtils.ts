import { generateAccesToken, generateRefreshToken } from "@controllers/auth/utils/generateTokens.ts"
import type { IUserDisplay } from "@api/types/user.js"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { errorHandler } from "@errorHandler/errorHandler.ts"
import type { Request, Response } from "express"
import { decryptData } from "@utils/crypto.ts"

/**
 * Utility function to generate auth tokens and prepare user response
 *
 * @param user - The user object
 * @param req - Express request object
 * @param res - Express response object
 * @returns Object containing clean user data and tokens, or null if error
 */
export const prepareUserAuthResponse = async (
	user: IUserDisplay,
	req: Request,
	res: Response,
	skipTokenGeneration: boolean = false
): Promise<{ user: IUserDisplay; tokens: { accessToken: string; refreshToken: string } } | null> => {
	// List of fields to decrypt
	const ENCRYPTED_FIELDS = ["name", "firstName", "birthDate"]

	// Decrypt user data
	const decryptedUserResponse = decryptData(user, ENCRYPTED_FIELDS)

	// Prepare clean user object
	const cleanUserObject = decryptedUserResponse.toObject
		? decryptedUserResponse.toObject()
		: decryptedUserResponse

	// Remove password from response
	if (cleanUserObject.password) {
		delete cleanUserObject.password
	}

	if (skipTokenGeneration) {
		return cleanUserObject
	}

	// Generate tokens
	let accessToken: string | undefined
	let refreshToken: string | undefined

	try {
		accessToken = generateAccesToken({
			id: decryptedUserResponse.id,
			role: decryptedUserResponse.role,
		})
	} catch (error: any) {
		errorHandler(res, ERROR_CODE.SERVER, error.message, error)
		return null
	}

	try {
		refreshToken = await generateRefreshToken(
			{
				id: decryptedUserResponse.id,
				role: decryptedUserResponse.role,
			},
			req
		)
	} catch (error: any) {
		errorHandler(res, ERROR_CODE.SERVER, error.message, error)
		return null
	}

	if (!refreshToken || !accessToken) {
		errorHandler(res, ERROR_CODE.SERVER)
		return null
	}

	return {
		user: cleanUserObject,
		tokens: { accessToken, refreshToken },
	}
}

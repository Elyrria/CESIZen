import type { IUserToken, IRefreshTokenCreate } from "@api/types/tokens.d.ts"
import { processRefreshToken } from "@utils/crypto.ts"
import { CONFIGS } from "@configs/global.configs.ts"
import { RefreshToken } from "@models/index.ts"
import type { Request } from "express"
import jwt from "jsonwebtoken"

/**
 * Function to generate an access token for a user.
 *
 * This function creates a JSON Web Token (JWT) that serves as an access token.
 * The token includes the user's ID and role, and it expires in 15 minutes.
 * The token is signed using a secret key retrieved from environment variables.
 *
 * @param {IUserToken} user - The user object containing the user ID and role.
 * @returns {string | undefined} - The generated access token, or undefined if the secret key is not defined.
 */
export const generateAccesToken = (user: IUserToken): string | undefined => {
	const secretKey: string | undefined = CONFIGS.TOKEN_SECRET.KEY
	if (!secretKey) {
		throw new Error("Missing secret key")
	}

	const accesToken = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: "15m" })

	return accesToken
}

/**
 * Function to generate a refresh token for a user.
 *
 * This function creates a JSON Web Token (JWT) that serves as a refresh token.
 * The token includes the user's ID and role, and it expires in 7 days.
 * The token is signed using a secret key retrieved from environment variables.
 * The refresh token is then stored in the database.
 *
 * @param {IUserToken} user - The user object containing the user ID and role.
 * @returns {Promise<string | undefined>} - The generated refresh token, or undefined if the secret key is not defined.
 */
export const generateRefreshToken = async (user: IUserToken, req: Request): Promise<string | undefined> => {
	const secretKey: string | undefined = CONFIGS.TOKEN_SECRET.KEY

	if (!secretKey) {
		throw new Error("Missing secret key")
	}
	// Get client IP address
	const clientIp: string =
		req.ip ||
		(Array.isArray(req.headers["x-forwarded-for"])
			? req.headers["x-forwarded-for"][0]
			: req.headers["x-forwarded-for"]) ||
		req.socket.remoteAddress ||
		"unknown"
	// Get User-Agent
	const userAgent: string = Array.isArray(req.headers["user-agent"])
		? req.headers["user-agent"][0]
		: req.headers["user-agent"] || "unknown"

	const refreshToken = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: "7d" })

	const refreshTokenData: IRefreshTokenCreate = {
		refreshToken,
		userAgent,
		ipAddress: clientIp,
		userId: user.id,
	}

	const newRefreshToken: IRefreshTokenCreate = await processRefreshToken(refreshTokenData)

	await RefreshToken.create(newRefreshToken)

	return refreshToken
}

import type { IUserToken } from "@api/types/tokens.d.ts"
import {CONFIGS} from "@configs/global.configs.ts"
// import RefreshToken from "../models/RefreshToken.ts"
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
export const generateRefreshToken = async (user: IUserToken): Promise<string | undefined> => {
	const secretKey: string | undefined = CONFIGS.TOKEN_SECRET.KEY

	if (!secretKey) {
		throw new Error("Missing secret key")
	}

	const refreshToken = jwt.sign({ userId: user.id, role: user.role }, secretKey, { expiresIn: "7d" })

	// await RefreshToken.create({ refreshToken: refreshToken, userId: user._id })

	return refreshToken
}

import { generateAccesToken, generateRefreshToken } from "@utils/generateTokens.ts"
import { errorHandler, handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { validateRequiredUserFields } from "@utils/validateRequiredFields.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import type { IUser, IUserReqBodyRequest } from "@api/types/user.d.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { createdHandler } from "@successHandler/successHandler.ts"
import { processUserData, decryptData } from "@utils/crypto.ts"
import { deleteObjectIds } from "@utils/idCleaner.ts"
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
const createUser = async (req: Request, res: Response): Promise<void> => {
	try {
		// Extract user details from the request body
		const userObject: IUserReqBodyRequest = req.sanitizedBody as IUser
		// Remove any user IDs from the request body for security reasons
		const cleanUserObject = deleteObjectIds(userObject)
		// Validate the presence of required fields in the request body
		if (!validateRequiredUserFields(cleanUserObject)) {
			errorHandler(res, ERROR_CODE.MISSING_INFO)
			return
		}
		// Check if the user is exist
		const userExist = await User.findOne({ email: userObject.email })
		if (userExist) {
			errorHandler(res, ERROR_CODE.UNABLE_CREATE_USER)
			return
		}

		// Create a new user instance with the hashed password
		const newUser = await processUserData(cleanUserObject)
		// Save the new user to the database
		const savedUser = await newUser.save()
		if (!savedUser) {
			errorHandler(res, ERROR_CODE.SERVER)
			return
		}
		const { password, _id, ...userWithoutPassword } = savedUser.toObject()

		/**
		 * List of field names that need to be decrypted
		 */
		const ENCRYPTED_FIELDS = ["name", "firstName", "birthDate"]

		const decryptedUserResponse = decryptData(userWithoutPassword, ENCRYPTED_FIELDS)

		// Generate an access token for the new user
		let accessToken: string | undefined = undefined

		try {
			accessToken = generateAccesToken({
				id: decryptedUserResponse.id,
				role: decryptedUserResponse.role,
			})
		} catch (error: any) {
			errorHandler(res, ERROR_CODE.SERVER, error.message, error)
			return
		}
		// Generate a refresh token for the new user
		let refreshToken: string | undefined = undefined
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
			return
		}
		if (!refreshToken || !accessToken) {
			errorHandler(res, ERROR_CODE.SERVER)
			return
		}
		createdHandler(res, SUCCESS_CODE.USER_CREATED, {
			user: decryptedUserResponse,
			tokens: { accessToken, refreshToken },
		})
		return
	} catch (error) {
		// Handle unexpected errors
		handleUnexpectedError(res, error as Error)
		return
	}
}

export default createUser

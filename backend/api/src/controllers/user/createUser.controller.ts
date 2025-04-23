import type { IUserReqBodyRequest } from "@api/types/user.d.ts"
import { errorHandler, handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { createdHandler } from "@successHandler/successHandler.ts"
import { deleteObjectIds } from "@utils/idCleaner.ts"
import type { Request, Response } from "express"
import { User } from "@models/index.ts"
import bcrypt from "bcrypt"

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
		const userObject: IUserReqBodyRequest = req.sanitizedBody
		// Check if the user is exist
		const userExist = await User.findOne({ email: userObject.email })

		if (userExist) {
			errorHandler(res, ERROR_CODE.UNABLE_CREATE_USER)
			return
		}

		// Remove any user IDs from the request body for security reasons
		const cleanUserObject = deleteObjectIds(userObject)
		// Validate the presence of required fields in the request body
		if (
			!cleanUserObject.role ||
			!cleanUserObject.password ||
			!cleanUserObject.email ||
			!cleanUserObject.name ||
			!cleanUserObject.firstName ||
			!cleanUserObject.birthDate
		) {
			errorHandler(res, ERROR_CODE.MISSING_INFO)
			return
		}
		// Hash the user's password
		const hashedPassword: string = await bcrypt.hash(cleanUserObject.password, 10)
		delete cleanUserObject.password
		// Create a new user instance with the hashed password
		const newUser = new User({
			email: cleanUserObject.email,
			password: hashedPassword,
			name: cleanUserObject.name,
			firstName: cleanUserObject.firstName,
			birthDate: cleanUserObject.birthDate,
			role: "user"
		})
		// Save the new user to the database
		const savedUser = await newUser.save()

		if (!savedUser) {
			errorHandler(res, ERROR_CODE.SERVER)
			return
		}
		createdHandler(res, SUCCESS_CODE.USER_CREATED, cleanUserObject)
		return
	} catch (error) {
		// Handle unexpected errors
		handleUnexpectedError(res, error as Error)
		return
	}
}

export default createUser

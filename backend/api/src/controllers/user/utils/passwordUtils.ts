import bcrypt from "bcrypt"
import type { Response } from "express"
import type { IUserReqBodyRequest } from "@api/types/user.d.ts"
import { errorHandler } from "@errorHandler/errorHandler.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { User } from "@models/index.ts"
import type { IUser } from "@api/types/user.d.ts"

/**
 * Checks and processes password-related fields
 * @param cleanUserObject - Cleaned user object
 * @param userId - ID of the user to modify
 * @param res - Express Response object
 * @returns User object with processed password or null in case of error
 */
export const processPasswordUpdate = async (
	cleanUserObject: IUserReqBodyRequest,
	userId: string,
	res: Response
): Promise<IUserReqBodyRequest | null> => {
	// Check if a password update is requested
	if (!cleanUserObject.password && !cleanUserObject.newPassword) {
		return cleanUserObject
	}

	// Check that both fields are present
	if (
		(cleanUserObject.password && !cleanUserObject.newPassword) ||
		(!cleanUserObject.password && cleanUserObject.newPassword)
	) {
		errorHandler(
			res,
			cleanUserObject.password ? ERROR_CODE.NEW_PASSWORD_REQUIRED : ERROR_CODE.PASSWORD_REQUIRED
		)
		return null
	}

	// At this point, we know both fields are present
	// But let's make sure they are not undefined for TypeScript
	if (typeof cleanUserObject.password !== "string" || typeof cleanUserObject.newPassword !== "string") {
		errorHandler(res, ERROR_CODE.INVALID_CREDENTIALS)
		return null
	}
	// Find the user to verify the current password
	const userToModify: IUser | null = await User.findById(userId).select("+password")
	if (!userToModify || !userToModify.password) {
		errorHandler(res, ERROR_CODE.USER_NOT_FOUND)
		return null
	}

	// Verify the old password
	const isValid: boolean = await bcrypt.compare(cleanUserObject.password, userToModify.password)

	if (!isValid) {
		errorHandler(res, ERROR_CODE.INVALID_CREDENTIALS)
		return null
	}

	// Hash the new password
	const hashedPassword: string = await bcrypt.hash(cleanUserObject.newPassword, 10)

	// Create a new object to avoid modifying the original parameter
	const updatedObject = { ...cleanUserObject }
	updatedObject.password = hashedPassword
	delete updatedObject.newPassword

	return updatedObject
}

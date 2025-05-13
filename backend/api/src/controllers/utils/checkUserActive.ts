import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { errorHandler } from "@errorHandler/errorHandler.ts"
import {User} from "@models/index.ts"
import { Response } from "express"
import mongoose from "mongoose"

/**
 * Checks if a user exists and is active
 *
 * @param userId - The ID of the user to check
 * @param res - The response object to send error if needed
 * @returns The user object if found and active, null otherwise
 */
export const checkUserActive = async (userId: string | mongoose.Types.ObjectId, res: Response): Promise<any | null> => {
	try {
		// Find user and check if active
		const user = await User.findById(userId).select("isActive")
		if (!user) {
            errorHandler(res, ERROR_CODE.USER_NOT_FOUND)
			return null
		}
		if (!user.active) {
            errorHandler(res, ERROR_CODE.USER_NOT_FOUND)
			return null
		}
		return user
	} catch (error) {
		errorHandler(res, ERROR_CODE.SERVER)
		return null
	}
}

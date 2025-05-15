// utils/authUtils.ts
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { errorHandler } from "@errorHandler/errorHandler.ts"
import type { IAuthRequest } from "@api/types/request.d.ts"
import { ROLES } from "@configs/role.configs.ts"
import { FIELD } from "@configs/fields.configs.ts"
import type { Response } from "express"
import { User } from "@models/index.ts"
import { logger } from "@logs/logger.ts"
import chalk from "chalk"

/**
 * Utility function to verify if the request is from an admin user
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {string} actionDescription - Description of the action being attempted (for logging)
 * @returns {Promise<{isAdmin: boolean, userId: string, user: any} | null>} - Admin check result or null if verification failed
 */
export const verifyAdminAccess = async (
	req: IAuthRequest,
	res: Response,
	actionDescription: string
): Promise<{ isAdmin: boolean; userId: string; user: any } | null> => {
	// Authentication check
	if (!req.auth?.userId) {
		errorHandler(res, ERROR_CODE.NO_CONDITIONS)
		return null
	}

	const userId = req.auth.userId

	logger.info(`Admin ${chalk.blue(userId)} ${actionDescription}`)

	// Verify the user is an admin
	const user = await User.findById(userId).select(FIELD.ROLE)

	if (!user) {
		logger.warn(`User with ID ${chalk.yellow(userId)} not found`)
		errorHandler(res, ERROR_CODE.USER_NOT_FOUND)
		return null
	}

	const isAdmin = user.role === ROLES.ADMIN

	if (!isAdmin) {
		logger.warn(`Non-admin user ${chalk.yellow(userId)} attempted to ${actionDescription}`)
		errorHandler(res, ERROR_CODE.INSUFFICIENT_ACCESS)
		return null
	}

	// If we reach here, the user is authenticated and is an admin
	return { isAdmin: true, userId, user }
}

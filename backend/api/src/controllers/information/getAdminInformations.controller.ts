import { fetchInformationWithQuery } from "@controllers/information/utils/fetchInformationWithQuery .ts"
import { handleUnexpectedError, errorHandler } from "@errorHandler/errorHandler.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { successHandler } from "@successHandler/successHandler.ts"
import type { IAuthRequest } from "@api/types/request.d.ts"
import { ROLES } from "@configs/role.configs.ts"
import { STATUS } from "@configs/global.configs.ts"
import { logger } from "@logs/logger.ts"
import type { Response } from "express"
import { User } from "@models/index.ts"
import chalk from "chalk"

/**
 * Controller for retrieving information entries with role-based access control.
 *
 * This controller requires authentication and implements role-based rules:
 * - Regular users can see their own information (all statuses) and PUBLISHED information from others
 * - Administrators can see all information entries
 *
 * @param {Request} req - The request object containing query parameters
 * @param {Response} res - The response object to send the list of information entries
 * @returns {Promise<void>} - A promise that resolves when the response is sent
 */
export const getAdminInformations = async (req: IAuthRequest, res: Response): Promise<void> => {
	try {
		// Authentication check
		if (!req.auth?.userId) {
			errorHandler(res, ERROR_CODE.NO_CONDITIONS)
			return
		}
		const userId = req.auth.userId

		logger.info(
			`Fetching information with filters: ${JSON.stringify(req.query)} for user: ${chalk.blue(userId)}`
		)

		// Fetch user role to check if admin
		const user = await User.findById(userId).select("role")

		if (!user) {
			logger.warn(`User with ID ${chalk.yellow(userId)} not found`)
			errorHandler(res, ERROR_CODE.USER_NOT_FOUND)
			return
		}

		const isAdmin = user.role === ROLES.ADMIN

		// Define base query according to user role
		let baseQuery = {}

		if (!isAdmin) {
			// Regular users can only see their own information or PUBLISHED information
			baseQuery = {
				$or: [
					{ authorId: userId }, // User's own information (any status)
					{ status: STATUS[2] }, // Published information from any user
				],
			}
		}
		// Admins can see everything - no base query restrictions

		// Fetch data with the appropriate base query
		const responseData = await fetchInformationWithQuery(req, baseQuery)

		// Send response with appropriate success code
		if (responseData.items.length > 0) {
			successHandler(res, SUCCESS_CODE.INFORMATION_LIST, responseData)
		} else {
			successHandler(res, SUCCESS_CODE.NO_INFORMATION, responseData)
		}
	} catch (error: unknown) {
		logger.error(`Error retrieving information: ${(error as Error).message}`)
		handleUnexpectedError(res, error as Error)
	}
}

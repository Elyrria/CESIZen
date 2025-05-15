// @api/controllers/activity/getActivities.controller.ts
import { fetchActivityWithQuery } from "@controllers/activity/utils/fetchActivityWithQuery.ts"
import { handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { successHandler } from "@successHandler/successHandler.ts"
import { verifyAdminAccess } from "@utils/verifyAdminAccess.ts"
import type { IAuthRequest } from "@api/types/request.d.ts"
import { logger } from "@logs/logger.ts"
import type { Response } from "express"
import chalk from "chalk"

/**
 * Controller for retrieving all activity entries.
 * This endpoint is restricted to admin users only.
 *
 * Features:
 * - Pagination and sorting
 * - Filtering by various fields including type, isActive, categoryId
 * - Returns complete activity details including inactive activities
 *
 * @param {IAuthRequest} req - The authenticated request with optional query parameters
 * @param {Response} res - The response object
 * @returns {Promise<void>} - A promise that resolves when the response is sent
 */
export const getActivities = async (req: IAuthRequest, res: Response): Promise<void> => {
	try {
		// Verify admin access
		const adminAccess = await verifyAdminAccess(req, res, "fetching all activities")
		if (!adminAccess) return // If access verification failed, response has already been handled

		logger.info(
			`Admin ${chalk.blue(adminAccess.userId)} fetching activities with filters: ${JSON.stringify(req.query)}`
		)

		// Fetch data with the appropriate base query
		const responseData = await fetchActivityWithQuery(req)

		// Send response with appropriate success code
		if (responseData.items.length > 0) {
			successHandler(res, SUCCESS_CODE.ACTIVITY_LIST, responseData)
		} else {
			successHandler(res, SUCCESS_CODE.NO_ACTIVITY, responseData)
		}
	} catch (error: unknown) {
		logger.error(`Error retrieving activities: ${(error as Error).message}`)
		handleUnexpectedError(res, error as Error)
	}
}

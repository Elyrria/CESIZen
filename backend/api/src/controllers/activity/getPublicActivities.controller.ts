// @api/controllers/activity/getPublicActivities.controller.ts
import { fetchActivityWithQuery } from "@controllers/activity/utils/fetchActivityWithQuery.ts"
import { handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { successHandler } from "@successHandler/successHandler.ts"
import type { Request, Response } from "express"
import { logger } from "@logs/logger.ts"

/**
 * Controller for retrieving public (active) activity entries.
 * This endpoint is publicly accessible without authentication.
 *
 * Features:
 * - Returns only active acti vities
 * - Supports pagination, sorting and filtering
 * - Excludes sensitive information
 *
 * @param {Request} req - The request with optional query parameters
 * @param {Response} res - The response object
 * @returns {Promise<void>} - A promise that resolves when the response is sent
 */
export const getPublicActivities = async (req: Request, res: Response): Promise<void> => {
	try {
		logger.info(`Public request for activities with filters: ${JSON.stringify(req.query)}`)

		// Only show active activities
		const baseQuery = { isActive: true }

		// Fetch data with the appropriate base query
		const responseData = await fetchActivityWithQuery(req, baseQuery)

		// Send response with appropriate success code
		if (responseData.items.length > 0) {
			successHandler(res, SUCCESS_CODE.PUBLIC_ACTIVITIES, responseData)
		} else {
			successHandler(res, SUCCESS_CODE.NO_ACTIVITY, responseData)
		}
	} catch (error: unknown) {
		logger.error(`Error retrieving public activities: ${(error as Error).message}`)
		handleUnexpectedError(res, error as Error)
	}
}

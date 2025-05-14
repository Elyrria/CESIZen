import { fetchInformationWithQuery } from "@controllers/information/utils/fetchInformationWithQuery .ts"
import { handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { successHandler } from "@successHandler/successHandler.ts"
import type { Request, Response } from "express"
import { logger } from "@logs/logger.ts"

/**
 * Controller for retrieving public information entries (PUBLISHED only).
 *
 * This controller is accessible without authentication and only returns
 * information entries with a PUBLISHED status.
 *
 * @param {Request} req - The request object containing query parameters
 * @param {Response} res - The response object to send the list of information entries
 * @returns {Promise<void>} - A promise that resolves when the response is sent
 */
export const getPublicInformations = async (req: Request, res: Response): Promise<void> => {
	try {
		logger.info(`Fetching public information with filters: ${JSON.stringify(req.query)}`)

		// Base query to only return PUBLISHED information
		const baseQuery = { status: "PUBLISHED" }

		// Fetch data with the base query
		const responseData = await fetchInformationWithQuery(req, baseQuery)

		// Send response with appropriate success code
		if (responseData.items.length > 0) {
			successHandler(res, SUCCESS_CODE.INFORMATION_LIST, responseData)
		} else {
			successHandler(res, SUCCESS_CODE.NO_INFORMATION, responseData)
		}
	} catch (error: unknown) {
		logger.error(`Error retrieving public information: ${(error as Error).message}`)
		handleUnexpectedError(res, error as Error)
	}
}

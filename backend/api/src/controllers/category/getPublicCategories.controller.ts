import { fetchCategories } from "@controllers/category/utils/fetchCategories.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { successHandler } from "@successHandler/successHandler.ts"
import type { Request, Response } from "express"
import { logger } from "@logs/logger.ts"

/**
 * Controller for retrieving active categories for public users.
 * Only returns active categories.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} - A promise that resolves when categories are retrieved
 */
export const getPublicCategories = async (req: Request, res: Response): Promise<void> => {
	try {
		logger.info(`Fetching public categories`)

		// Only fetch active categories for public users
		const categories = await fetchCategories({
			includeInactive: false, // Only active categories
		})

		// Return appropriate response based on results
		if (categories.length === 0) {
			successHandler(res, SUCCESS_CODE.NO_CATEGORY)
			return
		}

		successHandler(res, SUCCESS_CODE.CATEGORY_LIST, { categories: categories })
	} catch (error: unknown) {
		logger.error(`Error retrieving public categories: ${(error as Error).message}`)
		handleUnexpectedError(res, error as Error)
	}
}

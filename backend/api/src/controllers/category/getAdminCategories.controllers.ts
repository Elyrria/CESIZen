import { handleUnexpectedError, errorHandler } from "@errorHandler/errorHandler.ts"
import { fetchCategories } from "@controllers/category/utils/fetchCategories.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { successHandler } from "@successHandler/successHandler.ts"
import { verifyAdminAccess } from "@utils/verifyAdminAccess.ts"
import type { IAuthRequest } from "@api/types/request.d.ts"
import type { Response } from "express"
import { logger } from "@logs/logger.ts"

/**
 * Controller for retrieving all categories for admin users.
 * Returns both active and inactive categories.
 * Only accessible to administrators.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @returns {Promise<void>} - A promise that resolves when categories are retrieved
 */
export const getAdminCategories = async (req: IAuthRequest, res: Response): Promise<void> => {
	try {
		// Verify admin access
		const authResult = await verifyAdminAccess(req, res, "requested all categories")

		// If verification failed, the function above will have already sent an error response
		if (!authResult) return

		// Include inactive categories for admins
		const categories = await fetchCategories({
			includeInactive: true, // Include both active and inactive
		})

		// Return appropriate response based on results
		if (categories.length === 0) {
			successHandler(res, SUCCESS_CODE.NO_CATEGORY)
			return
		}

		successHandler(res, SUCCESS_CODE.CATEGORY_LIST, { categories: categories })
	} catch (error: unknown) {
		logger.error(`Error retrieving admin categories: ${(error as Error).message}`)
		handleUnexpectedError(res, error as Error)
	}
}

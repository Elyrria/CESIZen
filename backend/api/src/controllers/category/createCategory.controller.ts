import { handleUnexpectedError, errorHandler } from "@errorHandler/errorHandler.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { successHandler } from "@successHandler/successHandler.ts"
import { verifyAdminAccess } from "@utils/verifyAdminAccess.ts"
import type { IAuthRequest } from "@api/types/request.d.ts"
import { Category } from "@models/index.ts"
import type { Response } from "express"
import { logger } from "@logs/logger.ts"
import chalk from "chalk"

/**
 * Controller for creating a new category.
 * Only administrators can create categories.
 *
 * @param {Request} req - The request object containing category data
 * @param {Response} res - The response object to send the creation result
 * @returns {Promise<void>} - A promise that resolves when the category is created
 */
export const createCategory = async (req: IAuthRequest, res: Response): Promise<void> => {
	try {
		// Verify admin access
		const authResult = await verifyAdminAccess(req, res, "attempted to create a category")

		// If verification failed, the function above will have already sent an error response
		if (!authResult) return

		const { userId } = authResult

		// Create new category
		const categoryData = {
			...req.body,
			createdBy: userId,
		}

		const category = new Category(categoryData)

		try {
			const newCategory = await category.save()
			logger.info(`Category created successfully: ${chalk.green(newCategory._id.toString())}`)

			successHandler(res, SUCCESS_CODE.CATEGORY_CREATED, newCategory)
		} catch (saveError: any) {
			// Check for unique constraint violation
			if (saveError.message.includes("already exists")) {
				logger.warn(`Category name '${chalk.yellow(req.body.name)}' already exists`)
				errorHandler(res, ERROR_CODE.DUPLICATE_CATEGORY)
				return
			}

			// Other save error
			logger.error(`Failed to create category: ${chalk.red(saveError.message)}`)
			errorHandler(res, ERROR_CODE.UNABLE_CREATE_CATEGORY)
		}
	} catch (error: unknown) {
		logger.error(`Error creating category: ${(error as Error).message}`)
		handleUnexpectedError(res, error as Error)
	}
}

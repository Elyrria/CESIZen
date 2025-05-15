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
 * Controller for updating a category.
 * Only administrators can update categories.
 *
 * @param {IAuthRequest} req - The request object containing the category ID and update data
 * @param {Response} res - The response object to send the update result
 * @returns {Promise<void>} - A promise that resolves when the category is updated
 */
export const updateCategory = async (req: IAuthRequest, res: Response): Promise<void> => {
	try {
		const categoryId = req.params.id

		// Verify admin access
		const adminResult = await verifyAdminAccess(req, res, `updating category ${categoryId}`)

		// If verification failed, the function above will have already sent an error response
		if (!adminResult) return

		const { userId } = adminResult

		// Verify the category exists
		const category = await Category.findById(categoryId)

		if (!category) {
			logger.warn(`Category with ID ${chalk.yellow(categoryId)} not found`)
			errorHandler(res, ERROR_CODE.CATEGORY_NOT_FOUND)
			return
		}

		// Prepare update data
		const updateData = {
			...req.body,
			updatedBy: userId,
		}

		try {
			// Update the category
			const updatedCategory = await Category.findByIdAndUpdate(
				categoryId,
				{ $set: updateData },
				{ new: true, runValidators: true }
			)

			if (!updatedCategory) {
				logger.error(`Failed to update category: ${chalk.red(categoryId)}`)
				errorHandler(res, ERROR_CODE.UNABLE_MODIFY_CATEGORY)
				return
			}

			logger.info(`Category updated successfully: ${chalk.green(updatedCategory.name)}`)

			successHandler(res, SUCCESS_CODE.CATEGORY_UPDATED, updatedCategory)
		} catch (updateError: any) {
			// Check for unique constraint violation
			if (updateError.message.includes("already exists")) {
				logger.warn(`Category name '${chalk.yellow(req.body.name)}' already exists`)
				errorHandler(res, ERROR_CODE.DUPLICATE_CATEGORY)
				return
			}

			// Other update error
			logger.error(`Failed to update category: ${chalk.red(updateError.message)}`)
			errorHandler(res, ERROR_CODE.UNABLE_MODIFY_CATEGORY)
		}
	} catch (error: unknown) {
		logger.error(`Error updating category: ${(error as Error).message}`)
		handleUnexpectedError(res, error as Error)
	}
}

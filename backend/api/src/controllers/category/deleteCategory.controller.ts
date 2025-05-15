import { handleUnexpectedError, errorHandler } from "@errorHandler/errorHandler.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { successHandler } from "@successHandler/successHandler.ts"
import { verifyAdminAccess } from "@utils/verifyAdminAccess.ts"
import type { IAuthRequest } from "@api/types/request.d.ts"
import { Category, Information } from "@models/index.ts"
import type { Response } from "express"
import { logger } from "@logs/logger.ts"
import chalk from "chalk"

/**
 * Controller for deleting a category.
 * Only administrators can delete categories.
 *
 * @param {IAuthRequest} req - The request object containing the category ID
 * @param {Response} res - The response object to send the deletion result
 * @returns {Promise<void>} - A promise that resolves when the category is deleted
 */
export const deleteCategory = async (req: IAuthRequest, res: Response): Promise<void> => {
	try {
		const categoryId = req.params.id

		// Verify admin access
		const adminResult = await verifyAdminAccess(req, res, `deleting category ${categoryId}`)

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

		// Check if any information is using this category
		const informationCount = await Information.countDocuments({ categories: categoryId })

		if (informationCount > 0) {
			logger.warn(
				`Cannot delete category: ${chalk.yellow(categoryId)} as it is associated with ${informationCount} information entries`
			)

			// Instead of hard deletion, we'll set isActive to false
			const deactivatedCategory = await Category.findByIdAndUpdate(
				categoryId,
				{ $set: { isActive: false, updatedBy: userId } },
				{ new: true }
			)

			if (!deactivatedCategory) {
				logger.error(`Failed to deactivate category: ${chalk.red(categoryId)}`)
				errorHandler(res, ERROR_CODE.UNABLE_MODIFY_CATEGORY)
				return
			}

			logger.info(`Category deactivated instead of deleted: ${chalk.green(category.name)}`)

			successHandler(res, SUCCESS_CODE.CATEGORY_UPDATED, { category: deactivatedCategory })

			return
		}

		// If not in use, delete the category
		const deletedCategory = await Category.findByIdAndDelete(categoryId)

		if (!deletedCategory) {
			logger.error(`Failed to delete category: ${chalk.red(categoryId)}`)
			errorHandler(res, ERROR_CODE.UNABLE_MODIFY_CATEGORY)
			return
		}

		logger.info(`Category deleted successfully: ${chalk.green(category.name)}`)

		successHandler(res, SUCCESS_CODE.CATEGORY_DELETED)
	} catch (error: unknown) {
		logger.error(`Error deleting category: ${(error as Error).message}`)
		handleUnexpectedError(res, error as Error)
	}
}

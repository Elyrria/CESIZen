import { handleUnexpectedError, errorHandler } from "@errorHandler/errorHandler.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { successHandler } from "@successHandler/successHandler.ts"
import type { IAuthRequest } from "@api/types/request.d.ts"
import { Category, User } from "@models/index.ts"
import { ROLES } from "@configs/role.configs.ts"
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
		// Authentication check
		if (!req.auth?.userId) {
			errorHandler(res, ERROR_CODE.NO_CONDITIONS)
			return
		}
		const userId = req.auth.userId

		logger.info(`Attempting to create a new category by user: ${chalk.blue(userId)}`)

		// Verify the user is an admin
		const user = await User.findById(userId).select("role")

		if (!user) {
			logger.warn(`User with ID ${chalk.yellow(userId)} not found`)
			errorHandler(res, ERROR_CODE.USER_NOT_FOUND)
			return
		}

		const isAdmin = user.role === ROLES.ADMIN

		if (!isAdmin) {
			logger.warn(`Non-admin user ${chalk.yellow(userId)} attempted to create a category`)
			errorHandler(res, ERROR_CODE.INSUFFICIENT_ACCESS)
			return
		}

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

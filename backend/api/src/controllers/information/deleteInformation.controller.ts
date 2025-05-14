import { handleUnexpectedError, errorHandler } from "@errorHandler/errorHandler.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { successHandler } from "@successHandler/successHandler.ts"
import type { IAuthRequest } from "@api/types/request.d.ts"
import { deleteFile } from "@services/gridfs.services.ts"
import { Information, User } from "@models/index.ts"
import { ROLES } from "@configs/role.configs.ts"
import { logger } from "@logs/logger.ts"
import type { Response } from "express"
import chalk from "chalk"

/**
 * Controller for deleting information entries.
 *
 * This controller handles the deletion of information entries with appropriate access control:
 * - Regular users can only delete their own information
 * - Administrators can delete any information
 *
 * If the information has an associated file in GridFS, it will also be deleted.
 *
 * @param {IAuthRequest} req - The request object containing the information ID
 * @param {Response} res - The response object to send the deletion result
 * @returns {Promise<void>} - A promise that resolves when the deletion is complete
 */
export const deleteInformation = async (req: IAuthRequest, res: Response): Promise<void> => {
	try {
		// Authentication check
		if (!req.auth?.userId) {
			errorHandler(res, ERROR_CODE.NO_CONDITIONS)
			return
		}
		const informationId = req.params.id
		const userId = req.auth.userId

		logger.info(
			`Attempting to delete information ID: ${chalk.blue(informationId)} by user: ${chalk.blue(userId)}`
		)

		// Fetch user role to check if admin
		const user = await User.findById(userId).select("role")

		if (!user) {
			logger.warn(`User with ID ${chalk.yellow(userId)} not found`)
			errorHandler(res, ERROR_CODE.USER_NOT_FOUND)
			return
		}

		const isAdmin = user.role === ROLES.ADMIN
		logger.info(`User has admin privileges: ${chalk.blue(isAdmin.toString())}`)

		// Find the information to delete
		const information = await Information.findById(informationId)

		if (!information) {
			logger.warn(`Information with ID ${chalk.yellow(informationId)} not found`)
			errorHandler(res, ERROR_CODE.INFORMATION_NOT_FOUND)
			return
		}

		// Check permissions - only author or admin can delete
		if (!isAdmin && information.authorId.toString() !== userId) {
			logger.warn(`User ${chalk.yellow(userId)} attempted to delete information they don't own`)
			errorHandler(res, ERROR_CODE.INSUFFICIENT_ACCESS)
			return
		}

		// Store fileId for deletion after the information is removed
		const fileId = information.fileId

		// Delete the information from database
		const deletedInformation = await Information.findByIdAndDelete(informationId)

		if (!deletedInformation) {
			logger.error(`Failed to delete information: ${chalk.red(informationId)}`)
			errorHandler(res, ERROR_CODE.UNABLE_MODIFY_INFORMATION)
			return
		}

		logger.info(`Successfully deleted information: ${chalk.green(informationId)}`)

		// If there was an associated file, delete it from GridFS
		if (fileId) {
			try {
				await deleteFile(fileId)
				logger.info(`Successfully deleted associated file: ${chalk.green(fileId.toString())}`)
			} catch (deleteError) {
				// Log error but continue (the information is already deleted)
				logger.error(
					`Failed to delete associated file: ${chalk.red(fileId.toString())}`,
					deleteError
				)
			}
		}

		// Send successful response
		successHandler(res, SUCCESS_CODE.INFORMATION_DELETED)
	} catch (error: unknown) {
		logger.error(`Error deleting information: ${(error as Error).message}`)
		handleUnexpectedError(res, error as Error)
	}
}

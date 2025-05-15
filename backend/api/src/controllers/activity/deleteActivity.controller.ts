// @api/controllers/activity/deleteActivity.controller.ts
import { handleUnexpectedError, errorHandler } from "@errorHandler/errorHandler.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { successHandler } from "@successHandler/successHandler.ts"
import { verifyAdminAccess } from "@utils/verifyAdminAccess.ts"
import { deleteFile } from "@services/gridfs.services.ts"
import type { IAuthRequest } from "@api/types/request.d.ts"
import { Activity } from "@models/index.ts"
import { logger } from "@logs/logger.ts"
import type { Response } from "express"
import chalk from "chalk"

/**
 * Controller for deleting activity entries.
 *
 * This controller handles the deletion of activity entries with admin-only access control.
 * If the activity has an associated file in GridFS (e.g. video), it will also be deleted.
 *
 * @param {IAuthRequest} req - The request object containing the activity ID
 * @param {Response} res - The response object to send the deletion result
 * @returns {Promise<void>} - A promise that resolves when the deletion is complete
 */
export const deleteActivity = async (req: IAuthRequest, res: Response): Promise<void> => {
	try {
		// Verify admin access
		const adminAccess = await verifyAdminAccess(req, res, "deleting an activity")
		if (!adminAccess) return // If access verification failed, response has already been handled

		const activityId = req.params.id
		const userId = adminAccess.userId

		logger.info(`Admin ${chalk.blue(userId)} attempting to delete activity ID: ${chalk.blue(activityId)}`)

		// Find the activity to delete
		const activity = await Activity.findById(activityId)

		if (!activity) {
			logger.warn(`Activity with ID ${chalk.yellow(activityId)} not found`)
			errorHandler(res, ERROR_CODE.ACTIVITY_NOT_FOUND)
			return
		}

		// Store fileId for deletion after the activity is removed
		const fileId = activity.fileId

		// Delete the activity from database
		const deletedActivity = await Activity.findByIdAndDelete(activityId)

		if (!deletedActivity) {
			logger.error(`Failed to delete activity: ${chalk.red(activityId)}`)
			errorHandler(res, ERROR_CODE.UNABLE_MODIFY_ACTIVITY)
			return
		}

		logger.info(`Successfully deleted activity: ${chalk.green(activityId)}`)

		// If there was an associated file, delete it from GridFS
		if (fileId) {
			try {
				await deleteFile(fileId)
				logger.info(`Successfully deleted associated file: ${chalk.green(fileId.toString())}`)
			} catch (deleteError) {
				// Log error but continue (the activity is already deleted)
				logger.error(
					`Failed to delete associated file: ${chalk.red(fileId.toString())}`,
					deleteError
				)
			}
		}

		// Send successful response
		successHandler(res, SUCCESS_CODE.ACTIVITY_DELETED)
	} catch (error: unknown) {
		logger.error(`Error deleting activity: ${(error as Error).message}`)
		handleUnexpectedError(res, error as Error)
	}
}

// @api/controllers/activity/updateActivity.controller.ts
import { handleUnexpectedError, errorHandler } from "@errorHandler/errorHandler.ts"
import { uploadToGridFS, deleteFile } from "@services/gridfs.services.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { successHandler } from "@successHandler/successHandler.ts"
import type { TransformedActivity } from "@api/types/activity.d.ts"
import type { IActivityDocument } from "@api/types/activity.d.ts"
import { verifyAdminAccess } from "@utils/verifyAdminAccess.ts"
import { validateCategory } from "@utils/validateCategory.ts"
import type { IAuthRequest } from "@api/types/request.d.ts"
import { MEDIATYPE } from "@configs/global.configs.ts"
import { Activity } from "@models/index.ts"
import type { Response } from "express"
import { logger } from "@logs/logger.ts"
import { ObjectId } from "mongodb"
import chalk from "chalk"

/**
 * Controller for updating activity entries.
 *
 * This controller handles the process of updating an existing activity entry.
 * Only administrators can update activities.
 *
 * Functionality:
 * - Updates basic fields like name, descriptionActivity
 * - Updates content for TEXT type activities
 * - Handles file uploads for VIDEO type activities
 * - Manages category changes with validation
 * - Updates active status and validation information
 *
 * @param {IAuthRequest} req - The request object containing the activity ID and update data
 * @param {Response} res - The response object to send the update result
 * @returns {Promise<void>} - A promise that resolves when the update is complete
 */
export const updateActivity = async (req: IAuthRequest, res: Response): Promise<void> => {
	try {
		// Verify admin access
		const adminAccess = await verifyAdminAccess(req, res, "updating an activity")
		if (!adminAccess) return // If access verification failed, response has already been handled

		const activityId = req.params.id
		const userId = adminAccess.userId

		logger.info(`Admin ${chalk.blue(userId)} updating activity ID: ${chalk.blue(activityId)}`)

		// Find the activity to update
		const activity = await Activity.findById(activityId).populate("categoryId", "name")

		if (!activity) {
			logger.warn(`Activity with ID ${chalk.yellow(activityId)} not found`)
			errorHandler(res, ERROR_CODE.ACTIVITY_NOT_FOUND)
			return
		}

		// Prepare update data
		const updateData: Partial<IActivityDocument> = {}

		console.log(req)
		// Process basic fields that can be updated
		if (req.body.name) updateData.name = req.body.name
		if (req.body.descriptionActivity) updateData.descriptionActivity = req.body.descriptionActivity

		// Process parameters update if provided
		if (req.body.parameters) {
			try {
				// Ensure parameters is a valid object
				const parameters =
					typeof req.body.parameters === "string"
						? JSON.parse(req.body.parameters)
						: req.body.parameters

				updateData.parameters = parameters
				logger.info(`Updating activity parameters: ${JSON.stringify(parameters)}`)
			} catch (error) {
				logger.warn(`Invalid parameters format: ${error}`)
				errorHandler(res, ERROR_CODE.INVALID_ACTIVITY_TYPE, "Invalid parameters format")
				return
			}
		}

		// Process category update if provided
		if (req.body.categoryId) {
			// Use the validateCategory utility function
			const category = await validateCategory(
				req.body.categoryId,
				res,
				"Category",
				ERROR_CODE.INVALID_ACTIVITY_TYPE
			)

			if (!category) return // If validation fails, response has already been handled

			// Category is valid, assign it to the update data
			updateData.categoryId = new ObjectId(String(req.body.categoryId))

			const oldCategoryName = activity.categoryId ? (activity.categoryId as any).name : "unknown"
			logger.info(
				`Changing category from "${chalk.blue(oldCategoryName)}" to "${chalk.green(category.name)}"`
			)
		}

		// Process content for TEXT type
		if (activity.type === MEDIATYPE[0] && req.body.content) {
			updateData.content = req.body.content
		}

		// Process isActive update
		if (req.body.isActive !== undefined) {
			const isActive = req.body.isActive === true || req.body.isActive === "true"
			updateData.isActive = isActive

			// If activating the activity, record validation information
			if (isActive && !activity.validatedAndPublishedAt) {
				updateData.validatedBy = new ObjectId(String(userId))
				updateData.validatedAndPublishedAt = new Date()
				logger.info(`Activity validated and published by admin ${chalk.blue(userId)}`)
			}
		}

		// Handle file upload for VIDEO type
		if (activity.type === MEDIATYPE[1] && req.file) {
			try {
				// Validate file type matches activity type
				const fileType = req.file.mimetype.split("/")[0].toUpperCase()

				if (activity.type === MEDIATYPE[1] && fileType !== "VIDEO") {
					logger.warn(`File type mismatch: expected VIDEO, got ${fileType}`)
					errorHandler(res, ERROR_CODE.INVALID_FILE_TYPE)
					return
				}

				// Upload new file to GridFS
				const fileId = await uploadToGridFS(
					req.file.buffer,
					req.file.originalname,
					req.file.mimetype,
					{ activityId, userId }
				)

				// Get old fileId for later deletion
				const oldFileId = activity.fileId

				// Update file information
				updateData.fileId = fileId
				updateData.fileMetadata = {
					filename: req.file.originalname,
					contentType: req.file.mimetype,
					size: req.file.size,
					uploadDate: new Date(),
				}

				// Delete old file after successful upload
				if (oldFileId) {
					try {
						await deleteFile(oldFileId)
						logger.info(
							`Successfully deleted old file: ${chalk.green(oldFileId.toString())}`
						)
					} catch (deleteError) {
						// Log error but continue with update
						logger.error(
							`Failed to delete old file: ${chalk.red(oldFileId.toString())}`
						)
					}
				}
			} catch (uploadError) {
				logger.error(`File upload failed: ${(uploadError as Error).message}`)
				errorHandler(res, ERROR_CODE.FILE_UPLOAD_FAILED)
				return
			}
		}

		// Update the activity - only if there are fields to update
		if (Object.keys(updateData).length === 0) {
			logger.warn(`No fields to update for activity: ${chalk.yellow(activityId)}`)
			errorHandler(res, ERROR_CODE.NO_FIELDS)
			return
		}

		const updatedActivity = await Activity.findByIdAndUpdate(
			activityId,
			{ $set: updateData },
			{ new: true, runValidators: true }
		)
			.populate("categoryId", "name") // Populate category name
			.populate("authorId", "name email") // Populate author details
			.populate("validatedBy", "name email") // Populate validator details

		if (!updatedActivity) {
			logger.error(`Failed to update activity: ${chalk.red(activityId)}`)
			errorHandler(res, ERROR_CODE.UNABLE_MODIFY_ACTIVITY)
			return
		}

		logger.info(`Successfully updated activity: ${chalk.green(activityId)}`)

		// Transform the updated activity to include media URLs if needed
		const baseUrl = `${req.protocol}://${req.get("host")}`
		const transformedActivity = updatedActivity.toObject()

		// Add media URL if it's a VIDEO
		if (updatedActivity.type === MEDIATYPE[1] && updatedActivity.fileId) {
			transformedActivity.mediaUrl = `${baseUrl}/api/v1/activities/media/${updatedActivity._id}`
			transformedActivity.thumbnailUrl = `${baseUrl}/assets/images/video-thumbnail.png`
		} else if (updatedActivity.type === MEDIATYPE[0]) {
			// Default thumbnail for text
			transformedActivity.thumbnailUrl = `${baseUrl}/assets/images/text-icon.png`
		}

		// Send successful response
		successHandler(res, SUCCESS_CODE.ACTIVITY_UPDATED, { activity: transformedActivity })
	} catch (error: unknown) {
		logger.error(`Error updating activity: ${(error as Error).message}`)
		handleUnexpectedError(res, error as Error)
	}
}

// @api/controllers/activity/getPublicActivity.controller.ts
import { handleUnexpectedError, errorHandler } from "@errorHandler/errorHandler.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { successHandler } from "@successHandler/successHandler.ts"
import type { TransformedActivity } from "@api/types/activity.d.ts"
import { MEDIATYPE } from "@configs/global.configs.ts"
import { Activity } from "@models/index.ts"
import { logger } from "@logs/logger.ts"
import type { Request, Response } from "express"
import { ObjectId } from "mongodb"
import chalk from "chalk"

/**
 * Controller for retrieving a specific public (active) activity entry by ID.
 * This endpoint is publicly accessible without authentication.
 *
 * Features:
 * - Returns only active activities (isActive: true)
 * - Excludes sensitive information like author email and validation details
 * - Includes media URLs for video activities
 * - Provides clean error handling for invalid IDs
 *
 * @param {Request} req - The request with activity ID parameter
 * @param {Response} res - The response object
 * @returns {Promise<void>} - A promise that resolves when the response is sent
 */
export const getPublicActivityById = async (req: Request, res: Response): Promise<void> => {
	try {
		const activityId = req.params.id

		// Validate activity ID format
		if (!ObjectId.isValid(activityId)) {
			logger.warn(`Invalid activity ID format: ${chalk.yellow(activityId)}`)
			errorHandler(res, ERROR_CODE.INVALID_ID)
			return
		}

		logger.info(`Public request for activity ID: ${chalk.blue(activityId)}`)

		// Find the activity by ID with the constraint that it must be active
		// Only populate minimal information for public access
		const activity = await Activity.findOne({
			_id: activityId,
			isActive: true // Only return active activities
		})
			.populate("categoryId", "name") // Populate category information
			.select("-validatedBy -validatedAndPublishedAt") // Exclude validation details for public access

		if (!activity) {
			logger.warn(`Public activity with ID ${chalk.yellow(activityId)} not found or not active`)
			errorHandler(res, ERROR_CODE.ACTIVITY_NOT_FOUND, "Activity not found or not available")
			return
		}

		logger.info(`Successfully found public activity: ${chalk.green(activity.name)} (Type: ${chalk.blue(activity.type)})`)

		// Transform the activity to include media URLs if needed
		const baseUrl = `${req.protocol}://${req.get("host")}`
		const transformedActivity = activity.toObject() as TransformedActivity

		// Add media URL if it's a VIDEO
		if (activity.type === MEDIATYPE[1] && activity.fileId) {
			transformedActivity.mediaUrl = `${baseUrl}/api/v1/activities/media/${activity._id}`
			transformedActivity.thumbnailUrl = `${baseUrl}/assets/images/video-thumbnail.png`
		} else if (activity.type === MEDIATYPE[0]) {
			// Default thumbnail for text activities
			transformedActivity.thumbnailUrl = `${baseUrl}/assets/images/text-icon.png`
		}

		// Send successful response
		successHandler(res, SUCCESS_CODE.PUBLIC_ACTIVITIES, { activity: transformedActivity })
	} catch (error: unknown) {
		logger.error(`Error retrieving public activity: ${(error as Error).message}`)
		handleUnexpectedError(res, error as Error)
	}
}
import { validateRequiredActivityFields } from "@utils/validateRequiredFields.ts"
import { errorHandler, handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import type { IActivityDocument } from "@api/types/activity.d.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { createdHandler } from "@successHandler/successHandler.ts"
import { verifyAdminAccess } from "@utils/verifyAdminAccess.ts"
import { uploadToGridFS } from "@services/gridfs.services.ts"
import { validateCategory } from "@utils/validateCategory.ts"
import type { IAuthRequest } from "@api/types/request.d.ts"
import { MEDIATYPE } from "@configs/global.configs.ts"
import { deleteObjectIds } from "@utils/idCleaner.ts"
import { Activity } from "@models/index.ts"
import { logger } from "@logs/logger.ts"
import type { Response } from "express"
import mongoose from "mongoose"
import chalk from "chalk"

/**
 * Controller to create a new activity entry.
 * Handles both text and video content types.
 *
 * @param req - Authenticated request containing activity data and optionally a file.
 * @param res - Express response object.
 */
export const createActivity = async (req: IAuthRequest, res: Response): Promise<void> => {
	try {
		// Verify admin access
		const adminAccess = await verifyAdminAccess(req, res, "creating a new activity")
		if (!adminAccess) return // If access verification failed, response has already been handled

		// Clean and extract the data from the request
		const activityObject = req.body
		const cleanActivityObject = deleteObjectIds(activityObject)

		// Validate presence of all required fields
		if (!validateRequiredActivityFields(cleanActivityObject)) {
			errorHandler(res, ERROR_CODE.MISSING_INFO)
			return
		}
		// Destructure validated fields
		const {
			name,
			descriptionActivity,
			type,
			content,
			isActive = true, // Default to active
			parameters = {}, // Default to empty object
			categoryId,
		} = cleanActivityObject

		// Validate media type
		if (!MEDIATYPE.includes(type)) {
			errorHandler(res, ERROR_CODE.INVALID_ACTIVITY_TYPE)
			return
		}

		// Validate category
		const category = await validateCategory(categoryId, res)
		if (!category) return // If validation fails, response has already been handled
		// Build the base activity document
		const activityData: Partial<IActivityDocument> = {
			authorId: new mongoose.Types.ObjectId(adminAccess.userId),
			name,
			descriptionActivity,
			type,
			isActive,
			parameters,
			categoryId: new mongoose.Types.ObjectId(String(categoryId)),
		}

		// Handle TEXT content
		if (type === MEDIATYPE[0]) {
			if (!content) {
				errorHandler(res, ERROR_CODE.CONTENT_REQUIRED)
				return
			}
			activityData.content = content
		}

		// Handle VIDEO content
		if (type === MEDIATYPE[1]) {
			const file = req.file
			if (!file) {
				errorHandler(res, ERROR_CODE.FILE_REQUIRED)
				return
			}

			let fileMetadata: Record<string, any> = {}

			// Upload file to GridFS
			logger.info(`Starting upload to GridFS: ${chalk.blue(file.originalname)}`)
			const fileId = await uploadToGridFS(file.buffer, file.originalname, file.mimetype, {
				type,
				createdBy: adminAccess.userId,
				...fileMetadata,
			})
			logger.info(`Upload successful, ID: ${chalk.green(fileId.toString())}`)

			// Attach file info to the document
			activityData.fileId = fileId
			activityData.fileMetadata = {
				filename: file.originalname,
				contentType: file.mimetype,
				size: file.size,
				uploadDate: new Date(),
				...fileMetadata,
			}
		}

		// Save the final document to the database
		const activity = await new Activity(activityData).save()

		logger.info(`Activity created: ${chalk.green(activity._id.toString())} (Type: ${chalk.blue(type)})`)

		// Return a successful response
		createdHandler(res, SUCCESS_CODE.ACTIVITY_CREATED, { activity: activity })
	} catch (error: unknown) {
		// Catch-all for any unexpected errors
		handleUnexpectedError(res, error as Error)
	}
}

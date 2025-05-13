import { validateRequierdInformationFields } from "@utils/validateRequiredFields.ts"
import { errorHandler, handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import type { IInformationDocument } from "@api/types/information.d.ts"
import { checkUserActive } from "@controllers/utils/checkUserActive.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { createdHandler } from "@successHandler/successHandler.ts"
import { MEDIATYPE, STATUS } from "@configs/global.configs.ts"
import { uploadToGridFS } from "@services/gridfs.services.ts"
import type { IAuthRequest } from "@api/types/request.d.ts"
import { deleteObjectIds } from "@utils/idCleaner.ts"
import { Information } from "@models/index.ts"
import { logger } from "@logs/logger.ts"
import type { Response } from "express"
import mongoose from "mongoose"
import sharp from "sharp"
import chalk from "chalk"

/**
 * Controller to create a new information entry.
 * Handles both text and media (image, video) content types.
 *
 * Steps:
 * - Validates user authentication and status.
 * - Sanitizes the input data.
 * - Validates required fields.
 * - Processes file if media type is IMAGE or VIDEO.
 * - Uploads the file to GridFS with metadata if applicable.
 * - Saves the information document to the database.
 * - Returns a success response.
 *
 * @param req - Authenticated request containing information data and optionally a file.
 * @param res - Express response object.
 */
export const createInformation = async (req: IAuthRequest, res: Response): Promise<void> => {
	try {
		// Authentication check
		if (!req.auth?.userId) {
			errorHandler(res, ERROR_CODE.NO_CONDITIONS)
			return
		}

		// Ensure the user is active
		const user = await checkUserActive(req.auth.userId, res)
		if (!user) return // If user is not active, response has already been handled

		// Clean and extract the data from the request
		const informationObject = req.body
		const cleanInformationObject = deleteObjectIds(informationObject)

		// Validate presence of all required fields
		if (!validateRequierdInformationFields(cleanInformationObject)) {
			errorHandler(res, ERROR_CODE.MISSING_INFO)
			return
		}

		// Destructure validated fields with default status
		const {
			title,
			descriptionInformation,
			name,
			type,
			status = STATUS[0],
			content,
		} = cleanInformationObject

		// Validate media type
		if (!MEDIATYPE.includes(type)) {
			errorHandler(res, ERROR_CODE.INVALID_INFORMATION_TYPE)
			return
		}

		// Build the base information document
		const informationData: Partial<IInformationDocument> = {
			authorId: new mongoose.Types.ObjectId(req.auth.userId),
			title,
			descriptionInformation,
			name,
			type,
			status,
		}

		// Handle TEXT content
		if (type === MEDIATYPE[0]) {
			if (!content) {
				errorHandler(res, ERROR_CODE.CONTENT_REQUIRED)
				return
			}
			informationData.content = content
		}

		// Handle MEDIA (IMAGE or VIDEO)
		if (type !== MEDIATYPE[0]) {
			const file = req.file
			if (!file) {
				errorHandler(res, ERROR_CODE.FILE_REQUIRED)
				return
			}

			let fileMetadata: Record<string, any> = {}

			// Extract image metadata if the type is IMAGE
			if (type === "IMAGE") {
				try {
					const imageInfo = await sharp(file.buffer).metadata()
					fileMetadata = {
						dimension: {
							width: imageInfo.width,
							height: imageInfo.height,
						},
						format: imageInfo.format,
					}
				} catch (error) {
					logger.error("Error while extracting image metadata:", error)
				}
			}

			// Upload file to GridFS
			logger.info(`Starting upload to GridFS: ${chalk.blue(file.originalname)}`)
			const fileId = await uploadToGridFS(file.buffer, file.originalname, file.mimetype, {
				type,
				createdBy: req.auth.userId,
				...fileMetadata,
			})
			logger.info(`Upload successful, ID: ${chalk.green(fileId.toString())}`)

			// Attach file info to the document
			informationData.fileId = fileId
			informationData.fileMetadata = {
				filename: file.originalname,
				contentType: file.mimetype,
				size: file.size,
				uploadDate: new Date(),
				...fileMetadata,
			}
		}

		// Save the final document to the database
		const information = await new Information(informationData).save()
		logger.info(
			`Information created: ${chalk.green(information._id.toString())} (Type: ${chalk.blue(type)})`
		)

		// Return a successful response
		createdHandler(res, SUCCESS_CODE.INFORMATION_CREATED, { information })
	} catch (error: unknown) {
		// Catch-all for any unexpected errors
		handleUnexpectedError(res, error as Error)
	}
}

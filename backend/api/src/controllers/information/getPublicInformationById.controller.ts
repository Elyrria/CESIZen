import type { IInformationDocument, TransformedInfo } from "@api/types/information.d.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { successHandler } from "@successHandler/successHandler.ts"
import { Information } from "@models/index.ts"
import type { Request, Response } from "express"
import { logger } from "@logs/logger.ts"
import mongoose from "mongoose"

/**
 * Controller for retrieving a specific public information entry by ID (PUBLISHED only).
 *
 * This controller is accessible without authentication and only returns
 * information entries with a PUBLISHED status.
 *
 * @param {Request} req - The request object containing the information ID in params
 * @param {Response} res - The response object to send the information entry
 * @returns {Promise<void>} - A promise that resolves when the response is sent
 */
export const getPublicInformationById = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params
		logger.info(`Fetching public information with ID: ${id}`)

		// Validate MongoDB ObjectId format
		if (!mongoose.Types.ObjectId.isValid(id)) {
			logger.warn(`Invalid information ID format: ${id}`)
			successHandler(res, SUCCESS_CODE.NO_INFORMATION)
			return
		}

		// Find the information by ID and ensure it's PUBLISHED
		const information: IInformationDocument | null = await Information.findOne({
			_id: id,
			status: "PUBLISHED"
		}).populate("categoryId", "name") // Populate category information

		if (!information) {
			logger.info(`No published information found with ID: ${id}`)
			successHandler(res, SUCCESS_CODE.NO_INFORMATION)
			return
		}

		logger.info(`Found published information: ${information.title}`)

		// Transform the information object and add media URLs
		const baseUrl = `${req.protocol}://${req.get("host")}`
		const transformedInfo: TransformedInfo = information.toObject() as TransformedInfo

		// Add media URL if it's an IMAGE or VIDEO
		if (["IMAGE", "VIDEO"].includes(information.type) && information.fileId) {
			transformedInfo.mediaUrl = `${baseUrl}/api/v1/informations/media/${information._id}`

			// Use a default thumbnail for videos
			if (information.type === "VIDEO") {
				transformedInfo.thumbnailUrl = `${baseUrl}/assets/images/video-thumbnail.png`
			}
		} else if (information.type === "TEXT") {
			// Default thumbnail for text entries
			transformedInfo.thumbnailUrl = `${baseUrl}/assets/images/text-icon.png`
		}

		// Send successful response
		successHandler(res, SUCCESS_CODE.INFORMATION_FOUND, { information: transformedInfo })

	} catch (error: unknown) {
		logger.error(`Error retrieving public information by ID: ${(error as Error).message}`)
		handleUnexpectedError(res, error as Error)
	}
}
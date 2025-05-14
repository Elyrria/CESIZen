import { getPaginationOptions } from "@mongoQueryBuilders/paginationOptions.ts"
import { buildInformationQuery } from "@mongoQueryBuilders/queryUserBuilder.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { successHandler } from "@successHandler/successHandler.ts"
import type { Request, Response } from "express"
import { Information } from "@models/index.ts"
import { logger } from "@logs/logger.ts"
import chalk from "chalk"

/**
 * Controller for retrieving all information entries.
 *
 * This controller handles the process of fetching a list of information entries from the database,
 * applying optional filters, pagination, and sorting based on the query parameters.
 * It also formats media URLs and includes pagination metadata in the response.
 *
 * @param {Request} req - The request object containing optional filters, pagination, and sorting parameters in the query.
 * @param {Response} res - The response object to send the list of information entries, pagination metadata, and applied filters.
 * @returns {Promise<void>} - A promise that resolves when the response is sent with the information data or an error message.
 */
export const getInformations = async (req: Request, res: Response): Promise<void> => {
	try {
		logger.info(`Fetching information with filters: ${JSON.stringify(req.query)}`)

		//  Get pagination options
		const { page, limit, skip, sortOptions } = getPaginationOptions(req)
		logger.info(`Pagination: page=${page}, limit=${limit}, skip=${skip}`)

		//  Build the filtering query
		const query = buildInformationQuery(req)
		logger.info(`Filtering query: ${JSON.stringify(query)}`)

		//  Execute the query to retrieve data
		const informations = await Information.find(query).sort(sortOptions).skip(skip).limit(limit)

		logger.info(`${chalk.green(informations.length)} information entries found`)

		//  Count total number of documents matching the filter
		const total = await Information.countDocuments(query)
		logger.info(`Total ${chalk.green(total)} entries match the criteria`)

		//  Calculate pagination metadata
		const totalPages = Math.ceil(total / limit)

		//  Add media URLs for display purposes
		const baseUrl = `${req.protocol}://${req.get("host")}`
		const transformedInfos = informations.map((info) => {
			const infoObj = info.toObject()

			// Add media URL if the type is IMAGE or VIDEO
			if (["IMAGE", "VIDEO"].includes(info.type) && info.fileId) {
				infoObj.mediaUrl = `${baseUrl}/api/v1/media/${info._id}`

				// Use a default thumbnail for videos
				if (info.type === "VIDEO") {
					infoObj.thumbnailUrl = `${baseUrl}/assets/images/video-thumbnail.png`
				}
			} else if (info.type === "TEXT") {
				// Default thumbnail for text entries
				infoObj.thumbnailUrl = `${baseUrl}/assets/images/text-icon.png`
			}

			return infoObj
		})

		//  Prepare the response object
		const responseData = {
			data: transformedInfos,
			pagination: {
				currentPage: page,
				totalPages,
				totalItems: total,
				itemsPerPage: limit,
				hasNextPage: page < totalPages,
				hasPrevPage: page > 1,
			},
			filters: req.query,
		}

		//  Send the response
		successHandler(res, SUCCESS_CODE.INFORMATION_LIST, responseData)
	} catch (error: unknown) {
		logger.error(`Error while retrieving information: ${(error as Error).message}`)
		handleUnexpectedError(res, error as Error)
	}
}

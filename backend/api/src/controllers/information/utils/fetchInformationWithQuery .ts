import type { IInformationDocument, TransformedInfo } from "@api/types/information.d.ts"
import { getPaginationOptions } from "@mongoQueryBuilders/paginationOptions.ts"
import { buildInformationQuery } from "@mongoQueryBuilders/queryUserBuilder.ts"
import { Information, Category } from "@models/index.ts"
import { logger } from "@logs/logger.ts"
import type { Request } from "express"
import { ObjectId } from "mongodb"
import mongoose from "mongoose"
import chalk from "chalk"

/**
 * Utility function to fetch and format information entries with filtering and pagination.
 * Now supports filtering by category.
 *
 * @param {Request} req - The request object containing query parameters
 * @param {mongoose.FilterQuery<IInformationDocument>} baseQuery - The base query to apply
 * @returns {Promise<{items: TransformedInfo[], pagination: any, category?: any}>} - The fetched and formatted information
 */
export const fetchInformationWithQuery = async (
	req: Request,
	baseQuery: mongoose.FilterQuery<IInformationDocument> = {}
) => {
	// Get pagination options
	const { page, limit, skip, sortOptions } = getPaginationOptions(req)
	logger.info(`Pagination: page=${page}, limit=${limit}, skip=${skip}`)

	// Build the filtering query from request and combine with baseQuery
	let userQuery = buildInformationQuery(req)
	const query = { ...baseQuery, ...userQuery }

	// Handle category filtering
	let categoryInfo = null
	if (req.query.categoryId) {
		const categoryId = req.query.categoryId as string

		// Validate category ID format
		if (ObjectId.isValid(String(categoryId))) {
			// Add category filter to query
			query.categoryId = new ObjectId(String(categoryId))

			// Get category info for response
			try {
				categoryInfo = await Category.findById(categoryId)
				if (categoryInfo) {
					logger.info(`Filtering by category: ${chalk.blue(categoryInfo.name)}`)
				} else {
					logger.warn(
						`Category with ID ${chalk.yellow(categoryId)} not found, but still applying filter`
					)
				}
			} catch (error) {
				logger.error(`Error fetching category info: ${(error as Error).message}`)
			}
		} else {
			logger.warn(`Invalid category ID format: ${chalk.yellow(categoryId)}`)
		}
	}

	logger.info(`Filtering query: ${JSON.stringify(query)}`)

	// Count total number of documents matching the filter
	const total = await Information.countDocuments(query)
	logger.info(`Total ${chalk.green(total)} entries match the criteria`)

	// Variables to store results
	let transformedInfos: TransformedInfo[] = []
	let informations: IInformationDocument[] = []

	// Calculate pagination metadata
	const totalPages = total > 0 ? Math.ceil(total / limit) : 0

	// Only fetch data if there are results
	if (total > 0) {
		// Execute the query to retrieve data
		informations = await Information.find(query)
			.sort(sortOptions)
			.skip(skip)
			.limit(limit)
			.populate("categoryId", "name") // Populate category information

		logger.info(`${chalk.green(informations.length)} information entries found`)

		// Add media URLs for display purposes
		const baseUrl = `${req.protocol}://${req.get("host")}`
		transformedInfos = informations.map((info) => {
			const infoObj = info.toObject() as TransformedInfo

			// Add media URL if it's an IMAGE or VIDEO
			if (["IMAGE", "VIDEO"].includes(info.type) && info.fileId) {
				infoObj.mediaUrl = `${baseUrl}/api/v1/informations/media/${info._id}`

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
	} else {
		logger.info(`${chalk.yellow("No")} information entries found matching the criteria`)
	}

	// Prepare the response data
	const responseData = {
		items: transformedInfos,
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

	if (categoryInfo) {
		// @ts-ignore - Adding category property to response
		responseData.category = {
			id: categoryInfo._id,
			name: categoryInfo.name,
		}
	}

	return responseData
}

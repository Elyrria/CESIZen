// @api/controllers/activity/utils/fetchActivityWithQuery.ts
import type { IActivityDocument, TransformedActivity } from "@api/types/activity.d.ts"
import { getPaginationOptions } from "@mongoQueryBuilders/paginationOptions.ts"
import { buildActivityQuery } from "@mongoQueryBuilders/queryUserBuilder.ts"
import { Activity, Category } from "@models/index.ts"
import { logger } from "@logs/logger.ts"
import type { Request } from "express"
import { ObjectId } from "mongodb"
import mongoose from "mongoose"
import chalk from "chalk"

/**
 * Utility function to fetch and format activity entries with filtering and pagination.
 *
 * @param {Request} req - The request object containing query parameters
 * @param {mongoose.FilterQuery<IActivityDocument>} baseQuery - The base query to apply
 * @returns {Promise<{items: TransformedActivity[], pagination: any, category?: any}>} - The fetched and formatted activities
 */
export const fetchActivityWithQuery = async (req: Request, baseQuery: mongoose.FilterQuery<IActivityDocument> = {}) => {
	// Get pagination options
	const { page, limit, skip, sortOptions } = getPaginationOptions(req)
	logger.info(`Pagination: page=${page}, limit=${limit}, skip=${skip}`)

	// Build the filtering query from request and combine with baseQuery
	let userQuery = buildActivityQuery(req)
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
	const total = await Activity.countDocuments(query)
	logger.info(`Total ${chalk.green(total)} activities match the criteria`)

	// Variables to store results
	let transformedActivities: TransformedActivity[] = []
	let activities: IActivityDocument[] = []

	// Calculate pagination metadata
	const totalPages = total > 0 ? Math.ceil(total / limit) : 0

	// Only fetch data if there are results
	if (total > 0) {
		// Execute the query to retrieve data
		activities = await Activity.find(query)
			.sort(sortOptions)
			.skip(skip)
			.limit(limit)
			.populate("authorId", "name email") // Populate author information
			.populate("categoryId", "name") // Populate category information
			.populate("validatedBy", "name email") // Populate validator information

		logger.info(`${chalk.green(activities.length)} activity entries found`)

		// Add media URLs for display purposes
		const baseUrl = `${req.protocol}://${req.get("host")}`
		transformedActivities = activities.map((activity) => {
			const activityObj = activity.toObject() as TransformedActivity

			// Add media URL if it's a VIDEO
			if (activity.type === "VIDEO" && activity.fileId) {
				activityObj.mediaUrl = `${baseUrl}/api/v1/media/activity/${activity._id}`
				activityObj.thumbnailUrl = `${baseUrl}/assets/images/video-thumbnail.png`
			} else if (activity.type === "TEXT") {
				// Default thumbnail for text entries
				activityObj.thumbnailUrl = `${baseUrl}/assets/images/text-icon.png`
			}

			return activityObj
		})
	} else {
		logger.info(`${chalk.yellow("No")} activity entries found matching the criteria`)
	}

	// Prepare the response data
	const responseData = {
		items: transformedActivities,
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

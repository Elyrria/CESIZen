import type { ICategoryDocument } from "@api/types/category.d.ts"
import { Category } from "@models/index.ts"
import { logger } from "@logs/logger.ts"
import chalk from "chalk"

/**
 * Utility function to fetch categories based on filters
 *
 * @param {Object} options - Options for fetching categories
 * @param {boolean} options.includeInactive - Whether to include inactive categories
 * @param {Object} options.additionalFilters - Additional filters to apply to the query
 * @param {Object} options.sortOptions - Sorting options for the results
 * @returns {Promise<ICategoryDocument[]>} - Promise resolving to array of categories
 */
export const fetchCategories = async ({
	includeInactive = false,
	additionalFilters = {},
	sortOptions = { name: 1 },
}: {
	includeInactive?: boolean
	additionalFilters?: Record<string, any>
	sortOptions?: Record<string, 1 | -1 | { $meta: string }>
}): Promise<ICategoryDocument[]> => {
	// Build the query
	const query: Record<string, any> = { ...additionalFilters }

	// Add active/inactive filter unless explicitly including inactive categories
	if (!includeInactive) {
		query.isActive = true
	}

	logger.info(`Fetching categories with query: ${JSON.stringify(query)}`)

	try {
		// Execute the query
		const categories = await Category.find(query).sort(sortOptions)

		logger.info(`Found ${chalk.green(categories.length)} categories`)

		return categories
	} catch (error) {
		logger.error(`Error fetching categories: ${(error as Error).message}`)
		throw error
	}
}

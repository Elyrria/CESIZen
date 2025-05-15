import { errorHandler } from "@errorHandler/errorHandler.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import type { ICategoryDocument } from "@api/types/category.d.ts"
import { Category } from "@models/index.ts"
import type { Response } from "express"
import mongoose from "mongoose"

/**
 * Validates a category ID and checks if the category exists and is active
 *
 * @param categoryId - The category ID to validate
 * @param res - Express response object
 * @param fieldName - Optional name of the field (for custom error messages)
 * @param errorCode - Optional error code to use when validation fails
 * @returns The category document if valid, null otherwise
 */
export const validateCategory = async (
	categoryId: string,
	res: Response,
	fieldName: string = "Category",
	errorCode: string = ERROR_CODE.INVALID_ACTIVITY_TYPE
): Promise<null | ICategoryDocument> => {
	// Check if category ID is provided
	if (!categoryId) {
		errorHandler(res, ERROR_CODE.MISSING_FIELDS, `${fieldName} is required`)
		return null
	}

	// Validate category ID format
	if (!mongoose.Types.ObjectId.isValid(categoryId)) {
		errorHandler(res, errorCode, `Invalid ${fieldName.toLowerCase()} ID format`)
		return null
	}

	// Verify category exists
	const category = await Category.findById(categoryId)
	if (!category) {
		errorHandler(res, errorCode, `${fieldName} not found`)
		return null
	}

	// Verify category is active
	if (!category.isActive) {
		errorHandler(res, errorCode, `${fieldName} is inactive`)
		return null
	}

	// If all validations pass, return the category
	return category
}

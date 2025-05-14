// category.validator.ts
import { CATEGORY_VALIDATOR } from "@validator/schemas/category.validator.schema.ts"

/**
 * Validation rules for creating a new category.
 * These rules validate the required fields for creating a category.
 *
 * @returns An array of validation rules for category fields.
 */
export const createCategoryValidationRules = [...CATEGORY_VALIDATOR.REQUIRED.NAME()]

/**
 * Validation rules for updating a category.
 * These rules allow optional updates to category fields.
 *
 * @returns An array of validation rules for the optional fields.
 */
export const updateCategoryValidationRules = [
	...CATEGORY_VALIDATOR.OPTIONAL.NAME(),
	...CATEGORY_VALIDATOR.OPTIONAL.IS_ACTIVE(),
]

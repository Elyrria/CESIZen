import { ACTIVITY_VALIDATOR } from "./schemas/activity.validator.schema.ts"
import { STATUS } from "@configs/global.configs.ts"

/**
 * Validation rules for creating a new activity.
 * These rules validate the required fields for creating any type of activity.
 *
 * @returns An array of validation rules for activity fields.
 */
export const createActivityValidationRules = [
	...ACTIVITY_VALIDATOR.REQUIRED.NAME(),
	...ACTIVITY_VALIDATOR.REQUIRED.DESCRIPTION(),
	...ACTIVITY_VALIDATOR.REQUIRED.TYPE(),
	...ACTIVITY_VALIDATOR.REQUIRED.CONTENT(),
	...ACTIVITY_VALIDATOR.REQUIRED.CATEGORY(),
	...ACTIVITY_VALIDATOR.REQUIRED.PARAMETERS(),
	...ACTIVITY_VALIDATOR.OPTIONAL.IS_ACTIVE(),
	...ACTIVITY_VALIDATOR.TYPE_SPECIFIC.FILE_REQUIRED(),
	...ACTIVITY_VALIDATOR.TYPE_SPECIFIC.CATEGORY_EXISTS(),
]

/**
 * Validation rules for updating an activity.
 * These rules allow optional updates to activity fields.
 *
 * @returns An array of validation rules for the optional fields.
 */
export const updateActivityValidationRules = [
	...ACTIVITY_VALIDATOR.OPTIONAL.NAME(),
	...ACTIVITY_VALIDATOR.OPTIONAL.DESCRIPTION(),
	...ACTIVITY_VALIDATOR.OPTIONAL.TYPE(),
	...ACTIVITY_VALIDATOR.OPTIONAL.CONTENT(),
	...ACTIVITY_VALIDATOR.OPTIONAL.IS_ACTIVE(),
	...ACTIVITY_VALIDATOR.OPTIONAL.PARAMETERS(),
	...ACTIVITY_VALIDATOR.OPTIONAL.CATEGORY(),
	...ACTIVITY_VALIDATOR.TYPE_SPECIFIC.CATEGORY_EXISTS(),
]

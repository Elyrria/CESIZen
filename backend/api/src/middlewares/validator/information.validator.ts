import { INFORMATION_VALIDATOR } from "./schemas/information.validator.schema.ts"
import { STATUS } from "@configs/global.configs.ts"

/**
 * Validation rules for creating a new information.
 * These rules validate the required fields for creating any type of information.
 *
 * @returns An array of validation rules for information fields.
 */
export const createInformationValidationRules = [
	...INFORMATION_VALIDATOR.REQUIRED.TITLE(),
	...INFORMATION_VALIDATOR.REQUIRED.DESCRIPTION(),
	...INFORMATION_VALIDATOR.REQUIRED.NAME(),
	...INFORMATION_VALIDATOR.REQUIRED.TYPE(),
	...INFORMATION_VALIDATOR.REQUIRED.CONTENT(),
	...INFORMATION_VALIDATOR.REQUIRED.CATEGORY(),
	...INFORMATION_VALIDATOR.OPTIONAL.STATUS(STATUS),
	...INFORMATION_VALIDATOR.TYPE_SPECIFIC.FILE_REQUIRED(),
	...INFORMATION_VALIDATOR.TYPE_SPECIFIC.CATEGORY_EXISTS(),
]

/**
 * Validation rules for updating an information.
 * These rules allow optional updates to information fields.
 *
 * @returns An array of validation rules for the optional fields.
 */
export const updateInformationValidationRules = [
	...INFORMATION_VALIDATOR.OPTIONAL.TITLE(),
	...INFORMATION_VALIDATOR.OPTIONAL.DESCRIPTION(),
	...INFORMATION_VALIDATOR.OPTIONAL.NAME(),
	...INFORMATION_VALIDATOR.OPTIONAL.CONTENT(),
	...INFORMATION_VALIDATOR.OPTIONAL.STATUS(STATUS),
	...INFORMATION_VALIDATOR.OPTIONAL.CATEGORY(),
	...INFORMATION_VALIDATOR.TYPE_SPECIFIC.CATEGORY_EXISTS(),
]

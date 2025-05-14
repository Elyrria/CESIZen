// category.validator.schema.ts
import { CATEGORY_MESSAGE } from "@errorHandler/configs.errorHandler.ts"
import { CONFIG_FIELD, FIELD } from "@configs/fields.configs.ts"
import { body } from "express-validator"

/**
 * Validation utilities for category validation patterns
 */
export const CATEGORY_VALIDATOR = {
	/**
	 * Required field validations
	 */
	REQUIRED: {
		/**
		 * Validates the name field
		 * @returns Array of express-validator chain methods for name validation
		 */
		NAME: () => [
			body(FIELD.NAME)
				.exists()
				.withMessage(CATEGORY_MESSAGE.required(FIELD.NAME))
				.isString()
				.withMessage(CATEGORY_MESSAGE.mustBeString(FIELD.NAME))
				.isLength({
					min: CONFIG_FIELD.LENGTH.CATEGORY_NAME.MIN,
					max: CONFIG_FIELD.LENGTH.CATEGORY_NAME.MAX,
				})
				.withMessage(
					CATEGORY_MESSAGE.length(
						FIELD.NAME,
						CONFIG_FIELD.LENGTH.CATEGORY_NAME.MIN,
						CONFIG_FIELD.LENGTH.CATEGORY_NAME.MAX
					)
				)
				.escape()
				.trim(),
		],
	},

	/**
	 * Optional field validations
	 */
	OPTIONAL: {
		/**
		 * Validates the name field (optional)
		 * @returns Array of express-validator chain methods for name validation
		 */
		NAME: () => [
			body(FIELD.NAME)
				.optional()
				.isString()
				.withMessage(CATEGORY_MESSAGE.mustBeString(FIELD.NAME))
				.isLength({
					min: CONFIG_FIELD.LENGTH.CATEGORY_NAME.MIN,
					max: CONFIG_FIELD.LENGTH.CATEGORY_NAME.MAX,
				})
				.withMessage(
					CATEGORY_MESSAGE.length(
						FIELD.NAME,
						CONFIG_FIELD.LENGTH.CATEGORY_NAME.MIN,
						CONFIG_FIELD.LENGTH.CATEGORY_NAME.MAX
					)
				)
				.escape()
				.trim(),
		],

		/**
		 * Validates the isActive field (optional)
		 * @returns Array of express-validator chain methods for isActive validation
		 */
		IS_ACTIVE: () => [
			body(FIELD.IS_ACTIVE)
				.optional()
				.isBoolean()
				.withMessage(`The ${FIELD.IS_ACTIVE} field must be a boolean value`)
				.toBoolean(),
		],
	},
}

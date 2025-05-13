import { INFORMATION_MESSAGE, SHARED_MESSAGES } from "@errorHandler/configs.errorHandler.ts"
import { CONFIG_FIELD, FIELD } from "@configs/fields.configs.ts"
import { MEDIATYPE } from "@configs/global.configs.ts"
import { body } from "express-validator"
/**
 * Validation utilities for information validation patterns
 */
export const INFORMATION_VALIDATOR = {
	/**
	 * Required field validations
	 */
	REQUIRED: {
		/**
		 * Validates the title field
		 * @returns Array of express-validator chain methods for title validation
		 */
		TITLE: () => [
			body(FIELD.TITLE)
				.exists()
				.withMessage(INFORMATION_MESSAGE.required(FIELD.TITLE))
				.isString()
				.withMessage(INFORMATION_MESSAGE.mustBeString(FIELD.TITLE))
				.isLength({
					min: CONFIG_FIELD.LENGTH.DESCRIPTION_INFORMATION.MIN,
					max: CONFIG_FIELD.LENGTH.DESCRIPTION_INFORMATION.MAX,
				}) // Vous pouvez ajuster ces valeurs selon vos besoins
				.withMessage(
					INFORMATION_MESSAGE.length(
						FIELD.TITLE,
						CONFIG_FIELD.LENGTH.DESCRIPTION_INFORMATION.MIN,
						CONFIG_FIELD.LENGTH.DESCRIPTION_INFORMATION.MAX
					)
				)
				.escape()
				.trim(),
		],

		/**
		 * Validates the description field
		 * @returns Array of express-validator chain methods for description validation
		 */
		DESCRIPTION: () => [
			body(FIELD.DESCRIPTION_INFORMATION)
				.exists()
				.withMessage(INFORMATION_MESSAGE.required(FIELD.DESCRIPTION_INFORMATION))
				.isString()
				.withMessage(INFORMATION_MESSAGE.mustBeString(FIELD.DESCRIPTION_INFORMATION))
				.isLength({
					min: CONFIG_FIELD.LENGTH.DESCRIPTION_INFORMATION.MIN,
					max: CONFIG_FIELD.LENGTH.DESCRIPTION_INFORMATION.MAX,
				})
				.withMessage(
					INFORMATION_MESSAGE.length(
						FIELD.DESCRIPTION_INFORMATION,
						CONFIG_FIELD.LENGTH.DESCRIPTION_INFORMATION.MIN,
						CONFIG_FIELD.LENGTH.DESCRIPTION_INFORMATION.MAX
					)
				)
				.escape()
				.trim(),
		],

		/**
		 * Validates the name field
		 * @returns Array of express-validator chain methods for name validation
		 */
		NAME: () => [
			body(FIELD.NAME)
				.exists()
				.withMessage(INFORMATION_MESSAGE.required(FIELD.NAME))
				.isString()
				.withMessage(INFORMATION_MESSAGE.mustBeString(FIELD.NAME))
				.isLength({
					min: CONFIG_FIELD.LENGTH.NAME.MIN,
					max: CONFIG_FIELD.LENGTH.NAME.MAX,
				})
				.withMessage(
					INFORMATION_MESSAGE.length(
						FIELD.NAME,
						CONFIG_FIELD.LENGTH.NAME.MIN,
						CONFIG_FIELD.LENGTH.NAME.MAX
					)
				)
				.matches(/^[a-zA-Z0-9-_]+$/) // Uniquement caractères alphanumériques, tirets et underscores
				.withMessage(
					"Le nom ne doit contenir que des caractères alphanumériques, tirets ou underscores"
				)
				.escape()
				.trim(),
		],

		/**
		 * Validates the type field
		 * @returns Array of express-validator chain methods for type validation
		 */
		TYPE: () => [
			body(FIELD.TYPE)
				.exists()
				.withMessage(INFORMATION_MESSAGE.required(FIELD.TYPE))
				.isString()
				.withMessage(INFORMATION_MESSAGE.mustBeString(FIELD.TYPE))
				.isIn(MEDIATYPE)
				.withMessage(INFORMATION_MESSAGE.typeInvalid(MEDIATYPE))
				.escape()
				.trim(),
		],

		/**
		 * Validates the content field for TEXT type
		 * @returns Array of express-validator chain methods for content validation
		 */
		CONTENT: () => [
			body(FIELD.CONTENT)
				.if(body(FIELD.TYPE).equals(MEDIATYPE[0])) // Suppose que MEDIATYPE[0] est "TEXT"
				.exists()
				.withMessage(INFORMATION_MESSAGE.required(FIELD.CONTENT))
				.isString()
				.withMessage(INFORMATION_MESSAGE.mustBeString(FIELD.CONTENT))
				.notEmpty()
				.withMessage(INFORMATION_MESSAGE.cannotBeEmpty(FIELD.CONTENT))
				.trim(),
		],
	},

	/**
	 * Optional field validations
	 */
	OPTIONAL: {
		/**
		 * Validates the status field (optional)
		 * @returns Array of express-validator chain methods for status validation
		 */
		STATUS: (statuses: string[]) => [
			body(FIELD.STATUS)
				.optional()
				.isString()
				.withMessage(INFORMATION_MESSAGE.mustBeString(FIELD.STATUS))
				.isIn(statuses)
				.withMessage(SHARED_MESSAGES.statusInvalid(statuses))
				.escape()
				.trim(),
		],

		/**
		 * Validates the title field (optional)
		 * @returns Array of express-validator chain methods for title validation
		 */
		TITLE: () => [
			body(FIELD.TITLE)
				.optional()
				.isString()
				.withMessage(INFORMATION_MESSAGE.mustBeString(FIELD.TITLE))
				.isLength({
					min: CONFIG_FIELD.LENGTH.DESCRIPTION_INFORMATION.MIN,
					max: CONFIG_FIELD.LENGTH.DESCRIPTION_INFORMATION.MAX,
				})
				.withMessage(
					INFORMATION_MESSAGE.length(
						FIELD.TITLE,
						CONFIG_FIELD.LENGTH.DESCRIPTION_INFORMATION.MIN,
						CONFIG_FIELD.LENGTH.DESCRIPTION_INFORMATION.MAX
					)
				)
				.escape()
				.trim(),
		],

		/**
		 * Validates the description field (optional)
		 * @returns Array of express-validator chain methods for description validation
		 */
		DESCRIPTION: () => [
			body(FIELD.DESCRIPTION_INFORMATION)
				.optional()
				.isString()
				.withMessage(INFORMATION_MESSAGE.mustBeString(FIELD.DESCRIPTION_INFORMATION))
				.isLength({
					min: CONFIG_FIELD.LENGTH.DESCRIPTION_INFORMATION.MIN,
					max: CONFIG_FIELD.LENGTH.DESCRIPTION_INFORMATION.MAX,
				})
				.withMessage(
					INFORMATION_MESSAGE.length(
						FIELD.DESCRIPTION_INFORMATION,
						CONFIG_FIELD.LENGTH.DESCRIPTION_INFORMATION.MIN,
						CONFIG_FIELD.LENGTH.DESCRIPTION_INFORMATION.MAX
					)
				)
				.escape()
				.trim(),
		],

		/**
		 * Validates the name field (optional)
		 * @returns Array of express-validator chain methods for name validation
		 */
		NAME: () => [
			body(FIELD.NAME)
				.optional()
				.isString()
				.withMessage(INFORMATION_MESSAGE.mustBeString(FIELD.NAME))
				.isLength({
					min: CONFIG_FIELD.LENGTH.NAME.MIN,
					max: CONFIG_FIELD.LENGTH.NAME.MAX,
				})
				.withMessage(
					INFORMATION_MESSAGE.length(
						FIELD.NAME,
						CONFIG_FIELD.LENGTH.NAME.MIN,
						CONFIG_FIELD.LENGTH.NAME.MAX
					)
				)
				.matches(/^[a-zA-Z0-9-_]+$/) // Uniquement caractères alphanumériques, tirets et underscores
				.withMessage(
					"Le nom ne doit contenir que des caractères alphanumériques, tirets ou underscores"
				)
				.escape()
				.trim(),
		],

		/**
		 * Validates the content field (optional)
		 * @returns Array of express-validator chain methods for content validation
		 */
		CONTENT: () => [
			body(FIELD.CONTENT)
				.optional()
				.isString()
				.withMessage(INFORMATION_MESSAGE.mustBeString(FIELD.CONTENT))
				.trim(),
		],
	},

	/**
	 * Validation rules specific to different information types
	 */
	TYPE_SPECIFIC: {
		/**
		 * Validates that a file is present when required
		 * @returns Array of express-validator chain methods for file validation
		 */
		FILE_REQUIRED: () => [
			body().custom((value, { req }) => {
				if ([MEDIATYPE[1], MEDIATYPE[2]].includes(req.body[FIELD.TYPE]) && !req.file) {
					throw new Error(INFORMATION_MESSAGE.fileRequired(req.body[FIELD.TYPE]))
				}
				return true
			}),
		],
	},
}

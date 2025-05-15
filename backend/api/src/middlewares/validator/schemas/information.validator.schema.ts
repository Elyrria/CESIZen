import { INFORMATION_MESSAGE, SHARED_MESSAGES } from "@errorHandler/configs.errorHandler.ts"
import { CONFIG_FIELD, FIELD } from "@configs/fields.configs.ts"
import { MEDIATYPE } from "@configs/global.configs.ts"
import mongoose from "mongoose"
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
				.matches(/^[a-zA-Z0-9-_]+$/)
				.withMessage(
					"The name should only contain alphanumeric characters, dashes, or underscores"
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
		/**
		 * Validates the category field (optional)
		 * @returns Array of express-validator chain methods for category validation
		 */
		CATEGORY: () => [
			body(FIELD.CATEGORY_ID)
				.exists()
				.withMessage(INFORMATION_MESSAGE.required(FIELD.CATEGORY_ID))
				.isString()
				.withMessage(INFORMATION_MESSAGE.mustBeString(FIELD.CATEGORY_ID))
				.custom((value) => {
					// Vérifier que c'est un ID MongoDB valide
					if (!mongoose.Types.ObjectId.isValid(value)) {
						throw new Error(
							`The ${FIELD.CATEGORY_ID} must be a valid MongoDB ObjectID`
						)
					}
					return true
				}),
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

		/**
		 * Validates the category field (optional)
		 * @returns Array of express-validator chain methods for category validation
		 */
		CATEGORY: () => [
			body(FIELD.CATEGORY_ID)
				.optional()
				.isString()
				.withMessage(INFORMATION_MESSAGE.mustBeString(FIELD.CATEGORY_ID))
				.custom((value) => {
					// Vérifier que c'est un ID MongoDB valide
					if (!mongoose.Types.ObjectId.isValid(value)) {
						throw new Error(
							`The ${FIELD.CATEGORY_ID} must be a valid MongoDB ObjectID`
						)
					}
					return true
				}),
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

		/**
		 * Validates that the category exists in the database
		 * @returns Array of express-validator chain methods for category validation
		 */
		CATEGORY_EXISTS: () => [
			body(FIELD.CATEGORY_ID)
				.optional()
				.custom(async (value, { req }) => {
					if (!value) {
						return true // La catégorie est optionnelle
					}

					try {
						// Import Category model dynamically to avoid circular dependencies
						const { Category } = await import("@models/index.ts")

						// Check if the category exists and is active
						const category = await Category.findById(value)
						if (!category) {
							throw new Error(`Category with ID ${value} does not exist`)
						}
						if (!category.isActive) {
							throw new Error(`Category with ID ${value} is inactive`)
						}

						return true
					} catch (error) {
						// Re-throw any error for express-validator to handle
						throw error instanceof Error
							? error
							: new Error("Error validating category")
					}
				}),
		],
	},
}

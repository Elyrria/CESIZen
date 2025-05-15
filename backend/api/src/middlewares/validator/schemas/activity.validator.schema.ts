import { ACTIVITY_MESSAGE, SHARED_MESSAGES } from "@errorHandler/configs.errorHandler.ts"
import { CONFIG_FIELD, FIELD } from "@configs/fields.configs.ts"
import { MEDIATYPE } from "@configs/global.configs.ts"
import mongoose from "mongoose"
import { body } from "express-validator"

/**
 * Validation utilities for activity validation patterns
 */
export const ACTIVITY_VALIDATOR = {
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
				.withMessage(ACTIVITY_MESSAGE.required(FIELD.NAME))
				.isString()
				.withMessage(ACTIVITY_MESSAGE.mustBeString(FIELD.NAME))
				.isLength({
					min: CONFIG_FIELD.LENGTH.ACTIVITY_NAME.MIN,
					max: CONFIG_FIELD.LENGTH.ACTIVITY_NAME.MAX,
				})
				.withMessage(
					ACTIVITY_MESSAGE.length(
						FIELD.NAME,
						CONFIG_FIELD.LENGTH.ACTIVITY_NAME.MIN,
						CONFIG_FIELD.LENGTH.ACTIVITY_NAME.MAX
					)
				)
				.matches(/^[\p{L}\p{N}\s\-_]+$/u) // Caractères alphanumériques, tirets, underscores et espaces
				.withMessage(
					"Le nom ne doit contenir que des caractères alphanumériques, tirets, underscores ou espaces"
				)
				.escape()
				.trim(),
		],

		/**
		 * Validates the description field
		 * @returns Array of express-validator chain methods for description validation
		 */
		DESCRIPTION: () => [
			body(FIELD.DESCRIPTION_ACTIVITY)
				.exists()
				.withMessage(ACTIVITY_MESSAGE.required(FIELD.DESCRIPTION_ACTIVITY))
				.isString()
				.withMessage(ACTIVITY_MESSAGE.mustBeString(FIELD.DESCRIPTION_ACTIVITY))
				.isLength({
					min: CONFIG_FIELD.LENGTH.DESCRIPTION_ACTIVITY.MIN,
					max: CONFIG_FIELD.LENGTH.DESCRIPTION_ACTIVITY.MAX,
				})
				.withMessage(
					ACTIVITY_MESSAGE.length(
						FIELD.DESCRIPTION_ACTIVITY,
						CONFIG_FIELD.LENGTH.DESCRIPTION_ACTIVITY.MIN,
						CONFIG_FIELD.LENGTH.DESCRIPTION_ACTIVITY.MAX
					)
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
				.withMessage(ACTIVITY_MESSAGE.required(FIELD.TYPE))
				.isString()
				.withMessage(ACTIVITY_MESSAGE.mustBeString(FIELD.TYPE))
				.isIn(MEDIATYPE)
				.withMessage(ACTIVITY_MESSAGE.typeInvalid(MEDIATYPE))
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
				.withMessage(ACTIVITY_MESSAGE.required(FIELD.CONTENT))
				.isString()
				.withMessage(ACTIVITY_MESSAGE.mustBeString(FIELD.CONTENT))
				.notEmpty()
				.withMessage(ACTIVITY_MESSAGE.cannotBeEmpty(FIELD.CONTENT))
				.trim(),
		],

		/**
		 * Validates the category field
		 * @returns Array of express-validator chain methods for category validation
		 */
		CATEGORY: () => [
			body(FIELD.CATEGORY_ID)
				.optional()
				.isString()
				.withMessage(ACTIVITY_MESSAGE.mustBeString(FIELD.CATEGORY_ID))
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

		/**
		 * Validates the parameters field
		 * @returns Array of express-validator chain methods for parameters validation
		 */
		PARAMETERS: () => [
			body("parameters").optional().isObject().withMessage("Parameters must be an object"),
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
				.withMessage(ACTIVITY_MESSAGE.mustBeString(FIELD.NAME))
				.isLength({
					min: CONFIG_FIELD.LENGTH.ACTIVITY_NAME.MIN,
					max: CONFIG_FIELD.LENGTH.ACTIVITY_NAME.MAX,
				})
				.withMessage(
					ACTIVITY_MESSAGE.length(
						FIELD.NAME,
						CONFIG_FIELD.LENGTH.ACTIVITY_NAME.MIN,
						CONFIG_FIELD.LENGTH.ACTIVITY_NAME.MAX
					)
				)
				.matches(/^[a-zA-Z0-9-_ ]+$/)
				.withMessage(
					"The name should only contain alphanumeric characters, dashes, or underscores"
				)
				.escape()
				.trim(),
		],

		/**
		 * Validates the description field (optional)
		 * @returns Array of express-validator chain methods for description validation
		 */
		DESCRIPTION: () => [
			body(FIELD.DESCRIPTION_ACTIVITY)
				.optional()
				.isString()
				.withMessage(ACTIVITY_MESSAGE.mustBeString(FIELD.DESCRIPTION_ACTIVITY))
				.isLength({
					min: CONFIG_FIELD.LENGTH.DESCRIPTION_ACTIVITY.MIN,
					max: CONFIG_FIELD.LENGTH.DESCRIPTION_ACTIVITY.MAX,
				})
				.withMessage(
					ACTIVITY_MESSAGE.length(
						FIELD.DESCRIPTION_ACTIVITY,
						CONFIG_FIELD.LENGTH.DESCRIPTION_ACTIVITY.MIN,
						CONFIG_FIELD.LENGTH.DESCRIPTION_ACTIVITY.MAX
					)
				)
				.escape()
				.trim(),
		],

		/**
		 * Validates the type field (optional)
		 * @returns Array of express-validator chain methods for type validation
		 */
		TYPE: () => [
			body(FIELD.TYPE)
				.optional()
				.isString()
				.withMessage(ACTIVITY_MESSAGE.mustBeString(FIELD.TYPE))
				.isIn(MEDIATYPE)
				.withMessage(ACTIVITY_MESSAGE.typeInvalid(MEDIATYPE))
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
				.withMessage(ACTIVITY_MESSAGE.mustBeString(FIELD.CONTENT))
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
				.withMessage(`The ${FIELD.IS_ACTIVE} must be a boolean value`),
		],

		/**
		 * Validates the parameters field (optional)
		 * @returns Array of express-validator chain methods for parameters validation
		 */
		PARAMETERS: () => [
			body("parameters").optional().isObject().withMessage("Parameters must be an object"),
		],

		/**
		 * Validates the category field (optional)
		 * @returns Array of express-validator chain methods for category validation
		 */
		CATEGORY: () => [
			body(FIELD.CATEGORY_ID)
				.optional()
				.isString()
				.withMessage(ACTIVITY_MESSAGE.mustBeString(FIELD.CATEGORY_ID))
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
	 * Validation rules specific to different activity types
	 */
	TYPE_SPECIFIC: {
		/**
		 * Validates that a file is present when required
		 * @returns Array of express-validator chain methods for file validation
		 */
		FILE_REQUIRED: () => [
			body().custom((value, { req }) => {
				if (req.body[FIELD.TYPE] === MEDIATYPE[1] && !req.file) {
					// VIDEO
					throw new Error(ACTIVITY_MESSAGE.fileRequired(req.body[FIELD.TYPE]))
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
					if (!value || !Array.isArray(value) || value.length === 0) {
						return true // No validation needed if no categories
					}

					try {
						// Import Category model dynamically to avoid circular dependencies
						const { Category } = await import("@models/index.ts")

						// Check if all categories exist and are active
						for (const categoryId of value) {
							const category = await Category.findById(categoryId)
							if (!category) {
								throw new Error(
									`Category with ID ${categoryId} does not exist`
								)
							}
							if (!category.isActive) {
								throw new Error(
									`Category with ID ${categoryId} is inactive`
								)
							}
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

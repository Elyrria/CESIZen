import { TOKEN_MESSAGE } from "@errorHandler/configs.errorHandler.ts"
import { FIELD } from "@configs/fields.configs.ts"
import { body } from "express-validator"
import { Types } from "mongoose"
/**
 * Helper function to validate if a string is a valid MongoDB ObjectID
 * @param value String to validate
 * @returns Boolean indicating if the string is a valid MongoDB ObjectID
 */
const isValidObjectId = (value: string) => Types.ObjectId.isValid(value)
/**
 * Validation rule for the 'refreshToken' field in the request body.
 * Ensures that the refresh token is a string and applies necessary sanitization.
 *
 * - The 'isString' method ensures the 'refreshToken' field is a string.
 * - The 'withMessage' method sets a custom error message if the validation fails.
 * - The 'escape' method removes any HTML characters that could be used for injection attacks.
 * - The 'trim' method removes any leading or trailing spaces from the string.
 *
 * @returns An array containing the validation chain for 'refreshToken'
 */
export const VALIDATOR = {
	/**
	 * Required field validations
	 */
	REQUIRED: {
		/**
		 * Validates the refreshToken field
		 * @returns Array of express-validator chain methods for refreshToken validation
		 */
		REFRESH_TOKEN: () => [
			body(FIELD.REFRESH_TOKEN)
				.exists()
				.withMessage(TOKEN_MESSAGE.cannotBeEmpty(FIELD.REFRESH_TOKEN))
				.isString()
				.withMessage(TOKEN_MESSAGE.mustBeString(FIELD.REFRESH_TOKEN))
				.escape()
				.trim(),
		],
		USER_ID: () => [
			body(FIELD.USER_ID)
				.exists()
				.withMessage(TOKEN_MESSAGE.cannotBeEmpty(FIELD.REFRESH_TOKEN))
				.isString()
				.withMessage(TOKEN_MESSAGE.mustBeString(FIELD.REFRESH_TOKEN))
				.custom(isValidObjectId)
				.withMessage(TOKEN_MESSAGE.invalidFormat(FIELD.REFRESH_TOKEN))
				.escape()
				.trim(),
		],
	},
}

// refreshTokenValidationRule

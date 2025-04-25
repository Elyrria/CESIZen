import { VALIDATOR } from "@validator/schemas/refreshToken.validator.schema.ts"

/**
 * Validation rules for refreshToken registration (createRefreshToken).
 * These rules validate the required fields for creating a new refreshToken.
 *
 * @returns An array of validation rules for the 'refreshToken' field.
 */
export const createRefreshTokenValidationRules = [
	...VALIDATOR.REQUIRED.REFRESH_TOKEN(),
	...VALIDATOR.REQUIRED.USER_ID(),
]

import { USER_MESSAGE } from "@errorHandler/configs.errorHandler.ts"
import { CONFIG_FIELD, FIELD } from "@configs/fields.configs.ts"
import { body } from "express-validator"
// Regular expression for validating password (at least one uppercase, one lowercase, one number, one special character, 8-50 characters)

const passwordRegex = new RegExp(
	`^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{${CONFIG_FIELD.LENGTH.PASSWORD.MIN},${CONFIG_FIELD.LENGTH.PASSWORD.MAX}}$`
)

/**
 * Validation utilities for common validation patterns
 */
export const VALIDATOR = {
	/**
	 * Required field validations
	 */
	REQUIRED: {
		/**
		 * Validates the email field
		 * @returns Array of express-validator chain methods for email validation
		 */
		EMAIL: () => [
			body(FIELD.EMAIL)
				.exists()
				.withMessage(USER_MESSAGE.cannotBeEmpty(FIELD.EMAIL))
				.isEmail()
				.withMessage(USER_MESSAGE.emailInvalid)
				.normalizeEmail()
				.escape()
				.trim(),
		],

		/**
		 * Validates the password field
		 * @returns Array of express-validator chain methods for password validation
		 */
		PASSWORD: () => [
			body(FIELD.PASSWORD)
				.exists()
				.withMessage(USER_MESSAGE.cannotBeEmpty(FIELD.PASSWORD))
				.isString()
				.withMessage(USER_MESSAGE.mustBeString(FIELD.PASSWORD))
				.isLength({
					min: CONFIG_FIELD.LENGTH.PASSWORD.MIN,
					max: CONFIG_FIELD.LENGTH.PASSWORD.MAX,
				})
				.withMessage(
					USER_MESSAGE.length(
						FIELD.PASSWORD,
						CONFIG_FIELD.LENGTH.PASSWORD.MIN,
						CONFIG_FIELD.LENGTH.PASSWORD.MAX
					)
				)
				.matches(passwordRegex)
				.withMessage(USER_MESSAGE.passwordRequirements)
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
				.withMessage(USER_MESSAGE.cannotBeEmpty(FIELD.NAME))
				.isString()
				.withMessage(USER_MESSAGE.mustBeString(FIELD.NAME))
				.isLength({ min: CONFIG_FIELD.LENGTH.NAME.MIN, max: CONFIG_FIELD.LENGTH.NAME.MAX })
				.withMessage(
					USER_MESSAGE.length(
						FIELD.NAME,
						CONFIG_FIELD.LENGTH.NAME.MIN,
						CONFIG_FIELD.LENGTH.NAME.MAX
					)
				)
				.escape()
				.trim(),
		],

		/**
		 * Validates the first name field
		 * @returns Array of express-validator chain methods for first name validation
		 */
		FIRST_NAME: () => [
			body(FIELD.FIRST_NAME)
				.exists()
				.withMessage(USER_MESSAGE.cannotBeEmpty(FIELD.FIRST_NAME))
				.isString()
				.withMessage(USER_MESSAGE.mustBeString(FIELD.FIRST_NAME))
				.isLength({ min: CONFIG_FIELD.LENGTH.NAME.MIN, max: CONFIG_FIELD.LENGTH.NAME.MAX })
				.withMessage(
					USER_MESSAGE.length(
						FIELD.FIRST_NAME,
						CONFIG_FIELD.LENGTH.NAME.MIN,
						CONFIG_FIELD.LENGTH.NAME.MAX
					)
				)
				.escape()
				.trim(),
		],

		/**
		 * Validates the role field
		 * @param roles Array of allowed roles to check against
		 * @returns Array of express-validator chain methods for role validation
		 */
		ROLE: (roles: string[]) => [
			body(FIELD.ROLE)
				.exists()
				.withMessage(USER_MESSAGE.cannotBeEmpty(FIELD.ROLE))
				.isString()
				.withMessage(USER_MESSAGE.mustBeString(FIELD.ROLE))
				.custom((value) => {
					if (!roles.includes(value)) {
						throw new Error(USER_MESSAGE.roleInvalid(roles))
					}
					return true
				})
				.escape()
				.trim(),
		],

		/**
		 * Validates the birth date field
		 * @returns Array of express-validator chain methods for birth date validation
		 */
		BIRTH_DATE: () => [
			body(FIELD.BIRTH_DATE)
				.exists()
				.withMessage(USER_MESSAGE.cannotBeEmpty(FIELD.BIRTH_DATE))
				.isISO8601()
				.withMessage(`The ${FIELD.BIRTH_DATE} must be a valid date in ISO8601 format`)
				.custom((value) => {
					const birthDate = new Date(value)
					const today = new Date()
					// Check if birth date is in the past
					if (birthDate > today) {
						throw new Error(`The ${FIELD.BIRTH_DATE} cannot be in the future`)
					}
					// Check if person is at least MIN_AGE years old
					const minAgeDate = new Date()
					minAgeDate.setFullYear(today.getFullYear() - CONFIG_FIELD.MIN_AGE)

					if (birthDate > minAgeDate) {
						throw new Error(
							`You must be at least ${CONFIG_FIELD.MIN_AGE} years old`
						)
					}

					return true
				})
				.toDate(),
		],
	},

	/**
	 * Optional field validations
	 */
	OPTIONAL: {
		/**
		 * Validates the password field (optional)
		 * @returns Array of express-validator chain methods for optional password validation
		 */
		PASSWORD: () => [
			body(FIELD.PASSWORD)
				.optional()
				.isString()
				.withMessage(USER_MESSAGE.mustBeString(FIELD.PASSWORD))
				.isLength({
					min: CONFIG_FIELD.LENGTH.PASSWORD.MIN,
					max: CONFIG_FIELD.LENGTH.PASSWORD.MAX,
				})
				.withMessage(
					USER_MESSAGE.length(
						FIELD.PASSWORD,
						CONFIG_FIELD.LENGTH.PASSWORD.MIN,
						CONFIG_FIELD.LENGTH.PASSWORD.MAX
					)
				)
				.matches(passwordRegex)
				.withMessage(USER_MESSAGE.passwordRequirements)
				.escape()
				.trim(),
		],

		/**
		 * Validates the new password field (optional)
		 * @returns Array of express-validator chain methods for optional new password validation
		 */
		NEW_PASSWORD: () => VALIDATOR.OPTIONAL.PASSWORD(),

		/**
		 * Validates the name field (optional)
		 * @returns Array of express-validator chain methods for optional name validation
		 */
		NAME: () => [
			body(FIELD.NAME)
				.optional()
				.isString()
				.withMessage(USER_MESSAGE.mustBeString(FIELD.NAME))
				.isLength({ min: CONFIG_FIELD.LENGTH.NAME.MIN, max: CONFIG_FIELD.LENGTH.NAME.MAX })
				.withMessage(
					USER_MESSAGE.length(
						FIELD.NAME,
						CONFIG_FIELD.LENGTH.NAME.MIN,
						CONFIG_FIELD.LENGTH.NAME.MAX
					)
				)
				.escape()
				.trim(),
		],

		/**
		 * Validates the role field (optional)
		 * @param roles Array of allowed roles to check against
		 * @returns Array of express-validator chain methods for optional role validation
		 */
		ROLE: (roles: string[]) => [
			body(FIELD.ROLE)
				.optional()
				.isString()
				.withMessage(USER_MESSAGE.mustBeString(FIELD.ROLE))
				.custom((value) => {
					if (!roles.includes(value)) {
						throw new Error(USER_MESSAGE.roleInvalid(roles))
					}
					return true
				})
				.escape()
				.trim(),
		],

		/**
		 * Validates the email field (optional)
		 * @returns Array of express-validator chain methods for optional email validation
		 */
		EMAIL: () => [
			body(FIELD.EMAIL)
				.optional()
				.isEmail()
				.withMessage(USER_MESSAGE.emailInvalid)
				.normalizeEmail()
				.escape()
				.trim(),
		],

		/**
		 * Validates the birth date field (optional)
		 * @returns Array of express-validator chain methods for optional birth date validation
		 */
		BIRTH_DATE: () => [
			body(FIELD.BIRTH_DATE)
				.optional()
				.isISO8601()
				.withMessage(`The ${FIELD.BIRTH_DATE} must be a valid date in ISO8601 format`)
				.custom((value) => {
					const birthDate = new Date(value)
					const today = new Date()

					// Check if birth date is in the past
					if (birthDate > today) {
						throw new Error(`The ${FIELD.BIRTH_DATE} cannot be in the future`)
					}

					// Check if person is at least MIN_AGE years old
					const minAgeDate = new Date()
					minAgeDate.setFullYear(today.getFullYear() - CONFIG_FIELD.MIN_AGE)

					if (birthDate > minAgeDate) {
						throw new Error(
							`You must be at least ${CONFIG_FIELD.MIN_AGE} years old`
						)
					}

					return true
				})
				.toDate(),
		],
	},
}

// Backward compatibility exports
export const commonEmailValidation = VALIDATOR.REQUIRED.EMAIL
export const commonPasswordValidation = VALIDATOR.REQUIRED.PASSWORD
export const commonName = VALIDATOR.REQUIRED.NAME
export const commonFirstName = VALIDATOR.REQUIRED.FIRST_NAME
export const commonRoleValidation = VALIDATOR.REQUIRED.ROLE
export const commonBirthDateValidation = VALIDATOR.REQUIRED.BIRTH_DATE

export const commonOptionalPasswordValidation = VALIDATOR.OPTIONAL.PASSWORD
export const commonOptionalNewPasswordValidation = VALIDATOR.OPTIONAL.NEW_PASSWORD
export const commonOptionalNameValidation = VALIDATOR.OPTIONAL.NAME
export const commonOptionalRoleValidation = VALIDATOR.OPTIONAL.ROLE
export const commonOptionalEmailValidation = VALIDATOR.OPTIONAL.EMAIL
export const commonOptionalBirthDateValidation = VALIDATOR.OPTIONAL.BIRTH_DATE

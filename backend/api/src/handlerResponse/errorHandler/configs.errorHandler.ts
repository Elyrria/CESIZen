import type { IErrorInfo } from "@api/types/handlerResponse.d.ts"
// Namespace for field-related constants
import { FIELD, SPECIAL_CHARS_DISPLAY } from "@configs/fields.configs.ts"

// Namespace for error codes
export const ERROR_CODE = {
	// General errors
	UNEXPECTED: "unexpectedError",
	SERVER: "serverError",
	MISSING_INFO: "missingInfo",
	NO_CONDITIONS: "noConditions",
	NO_FIELDS: "noFields",
	MALFORMED: "malformed",
	VALIDATION_FAILED: "validationFailed",

	// Authentication errors
	UNAUTHORIZED: "unauthorized",
	INSUFFICIENT_ACCESS: "insufficientAccess",
	SECURITY_VALIDATION: "securityValidation",

	// Token-related errors
	INVALID_TOKEN: "invalidToken",
	EXPIRED_TOKEN: "expiredToken",
	REVOKED_TOKEN: "revokedToken",
	SIGN_TOKEN: "signatureInvalid",
	REFRESH_TOKEN_REQUIRED: "refreshTokenRequired",
	ALREADY_LOGOUT: "alreadyLoggedOut",

	// User-related errors
	USER_NOT_FOUND: "userNotFound",
	UNABLE_CREATE_USER: "unableToCreateUser",
	UNABLE_MODIFY_USER: "unableToCreateUser",
	MIS_MATCH: "userMisMatch",

	// Role-related errors
	ROLE_UNAVAILABLE: "roleUnavailable",

	// Password-related errors
	NO_PASSWORD_SET: "noPasswordSet",
	NEW_PASSWORD_REQUIRED: "newPasswordRequired",
	PASSWORD_REQUIRED: "passwordRequired",
	INCORRECT_PASSWORD: "incorrectPassword",
	INVALID_CREDENTIALS: "invalidCredentials",
}

// Predefined error messages
export const ERROR_MESSAGE = {
	INVALID_CREDENTIALS: "Incorrect username/password!",
	SERVER_ERROR: "Server error",
	EXPIRED_TOKEN: "Token expired",
	REVOKED_TOKEN: "Token has been revoked",
	UNABLE_TO_CREATE: "Unable to create an account with the provided information",
	UNABLE_MODIFY_USER: "Unable to modify an account with the provided information",
	VALIDATION_FAILED: "Validation failed",
	UNAUTHORIZED: "Unauthorized access",
	ROLE_UNAVAILABLE: `Invalid ${FIELD.ROLE}`,
	MISSING_INFO: "Missing information",
}

// Message generator functions for users
export const USER_MESSAGE = {
	emailInvalid: `The ${FIELD.EMAIL} must be a valid email address`,

	required: (type: string): string => `The ${type} is required`,

	passwordRequirements: `The ${FIELD.PASSWORD} must contain at least one uppercase letter, one lowercase letter, one number, and one special character in ${SPECIAL_CHARS_DISPLAY}`,

	length: (type: string, min: number, max: number): string =>
		`The ${type} must contain between ${min} and ${max} characters`,

	minLength: (type: string, min: number): string => `The ${type} must contain at least ${min} characters`,

	maxLength: (type: string, max: number): string => `The ${type} must not contain more than ${max} characters`,

	cannotBeEmpty: (type: string): string => `The ${type} cannot be empty`,

	mustBeString: (type: string): string => `The ${type} must be a string`,

	roleInvalid: (roles: string[]): string => `The role must be one of the following: ${roles.join(", ")}`,
}

// Message generator functions for tokens
export const TOKEN_MESSAGE = {
	mustBeString: (type: string): string => `The ${type} must be a string`,
	invalidFormat: (type: string): string => `The ${type} must be a valid format: MongoDB ObjectID`,
	refreshTokenRequired: "The refresh token is required",
	cannotBeEmpty: USER_MESSAGE.cannotBeEmpty
}

/**
 * Complete mapping of errors with their associated information
 */
export const ERROR_MAPPING: Record<string, IErrorInfo> = {
	[ERROR_CODE.MISSING_INFO]: {
		code: ERROR_CODE.MISSING_INFO,
		message: ERROR_MESSAGE.MISSING_INFO,
		statusCode: 400,
		location: "body",
	},
	[ERROR_CODE.MISSING_INFO]: {
		code: ERROR_CODE.VALIDATION_FAILED,
		message: ERROR_MESSAGE.VALIDATION_FAILED,
		statusCode: 400,
		location: "body",
	},
	[ERROR_CODE.NO_CONDITIONS]: {
		code: ERROR_CODE.NO_CONDITIONS,
		message: "No conditions met",
		statusCode: 400,
	},
	[ERROR_CODE.ROLE_UNAVAILABLE]: {
		code: ERROR_CODE.ROLE_UNAVAILABLE,
		message: ERROR_MESSAGE.ROLE_UNAVAILABLE,
		statusCode: 400,
	},
	[ERROR_CODE.NO_FIELDS]: {
		code: ERROR_CODE.NO_FIELDS,
		message: "No fields provided for update",
		statusCode: 400,
	},
	[ERROR_CODE.REFRESH_TOKEN_REQUIRED]: {
		code: ERROR_CODE.REFRESH_TOKEN_REQUIRED,
		message: "Refresh token is required",
		statusCode: 400,
	},
	[ERROR_CODE.ALREADY_LOGOUT]: {
		code: ERROR_CODE.ALREADY_LOGOUT,
		message: "Refresh token already removed",
		statusCode: 400,
	},
	[ERROR_CODE.NO_PASSWORD_SET]: {
		code: ERROR_CODE.NO_PASSWORD_SET,
		message: `No ${FIELD.PASSWORD} set for this account. ${FIELD.PASSWORD} update is not possible`,
		statusCode: 400,
	},
	[ERROR_CODE.NEW_PASSWORD_REQUIRED]: {
		code: ERROR_CODE.NEW_PASSWORD_REQUIRED,
		message: `'newPassword' is required to update the ${FIELD.PASSWORD}`,
		statusCode: 400,
	},
	[ERROR_CODE.PASSWORD_REQUIRED]: {
		code: ERROR_CODE.PASSWORD_REQUIRED,
		message: `'${FIELD.PASSWORD}' is required to confirm your identity before modification`,
		statusCode: 400,
	},
	[ERROR_CODE.UNAUTHORIZED]: {
		code: ERROR_CODE.UNAUTHORIZED,
		message: ERROR_MESSAGE.UNAUTHORIZED,
		statusCode: 401,
	},
	[ERROR_CODE.INVALID_TOKEN]: {
		code: ERROR_CODE.INVALID_TOKEN,
		message: "Invalid token",
		statusCode: 401,
	},
	[ERROR_CODE.SECURITY_VALIDATION]: {
		code: ERROR_CODE.SECURITY_VALIDATION,
		message: "Security validation failed",
		statusCode: 401,
	},
	[ERROR_CODE.MALFORMED]: {
		code: ERROR_CODE.MALFORMED,
		message: "Invalid token format",
		statusCode: 403,
	},
	[ERROR_CODE.SIGN_TOKEN]: {
		code: ERROR_CODE.SIGN_TOKEN,
		message: "Invalid token signature",
		statusCode: 403,
	},
	[ERROR_CODE.EXPIRED_TOKEN]: {
		code: ERROR_CODE.EXPIRED_TOKEN,
		message: ERROR_MESSAGE.EXPIRED_TOKEN,
		statusCode: 403,
	},
	[ERROR_CODE.REVOKED_TOKEN]: {
		code: ERROR_CODE.REVOKED_TOKEN,
		message: ERROR_MESSAGE.REVOKED_TOKEN,
		statusCode: 403,
	},
	[ERROR_CODE.INCORRECT_PASSWORD]: {
		code: ERROR_CODE.INCORRECT_PASSWORD,
		message: `Incorrect ${FIELD.PASSWORD}. Please try again`,
		statusCode: 401,
	},
	[ERROR_CODE.INVALID_CREDENTIALS]: {
		code: ERROR_CODE.INVALID_CREDENTIALS,
		message: ERROR_MESSAGE.INVALID_CREDENTIALS,
		statusCode: 401,
		location: "body",
	},
	[ERROR_CODE.INSUFFICIENT_ACCESS]: {
		code: ERROR_CODE.INSUFFICIENT_ACCESS,
		message: "Insufficient access",
		statusCode: 403,
	},
	[ERROR_CODE.USER_NOT_FOUND]: {
		code: ERROR_CODE.USER_NOT_FOUND,
		message: `User not found. Please check the provided ${FIELD.EMAIL}`,
		statusCode: 404,
	},
	[ERROR_CODE.UNABLE_CREATE_USER]: {
		code: ERROR_CODE.UNABLE_CREATE_USER,
		message: ERROR_MESSAGE.UNABLE_TO_CREATE,
		statusCode: 409,
	},
	[ERROR_CODE.UNABLE_MODIFY_USER]: {
		code: ERROR_CODE.UNABLE_MODIFY_USER,
		message: ERROR_MESSAGE.UNABLE_MODIFY_USER,
		statusCode: 409,
	},
	[ERROR_CODE.MIS_MATCH]: {
		code: ERROR_CODE.MIS_MATCH,
		message: "User identity mismatch",
		statusCode: 409,
	},
	[ERROR_CODE.SERVER]: {
		code: ERROR_CODE.SERVER,
		message: ERROR_MESSAGE.SERVER_ERROR,
		statusCode: 500,
	},
	[ERROR_CODE.UNEXPECTED]: {
		code: ERROR_CODE.UNEXPECTED,
		message: "An unexpected error occurred",
		statusCode: 500,
	},
}

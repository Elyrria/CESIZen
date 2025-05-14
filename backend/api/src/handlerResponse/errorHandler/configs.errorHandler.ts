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
	UNABLE_MODIFY_USER: "unableToModifyUser",
	MIS_MATCH: "userMisMatch",

	// Role-related errors
	ROLE_UNAVAILABLE: "roleUnavailable",

	// Password-related errors
	NO_PASSWORD_SET: "noPasswordSet",
	NEW_PASSWORD_REQUIRED: "newPasswordRequired",
	PASSWORD_REQUIRED: "passwordRequired",
	INCORRECT_PASSWORD: "incorrectPassword",
	INVALID_CREDENTIALS: "invalidCredentials",

	// Information-related errors
	INFORMATION_NOT_FOUND: "informationNotFound",
	UNABLE_CREATE_INFORMATION: "unableToCreateInformation",
	UNABLE_MODIFY_INFORMATION: "unableToModifyInformation",
	INACTIVE_USER: "inactiveUser",
	CONTENT_REQUIRED: "contentRequired",
	FILE_REQUIRED: "fileRequired",
	FILE_UPLOAD_FAILED: "fileUploadFailed",
	INVALID_INFORMATION_TYPE: "invalidInformationType",
	MISSING_FIELDS: "missingFields",
	INVALID_FILE_TYPE: "invalidFileType",
	FILE_NOT_FOUND: "fileNotFound",
	FILE_STREAMING_ERROR: "fileStreamingError",
	FILE_ACCESS_ERROR: "fileAccessError",

	// Category-related errors
	CATEGORY_NOT_FOUND: "categoryNotFound",
	UNABLE_CREATE_CATEGORY: "unableToCreateCategory",
	UNABLE_MODIFY_CATEGORY: "unableToModifyCategory",
	DUPLICATE_CATEGORY: "duplicateCategory",
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
	// Information-related messages
	INACTIVE_USER: "User account is inactive",
	NOT_FOUND: (type: string): string => `${type} not found`,
	CONTENT_REQUIRED: "Content is required for text-based information",
	FILE_REQUIRED: "File is required for media-based information",
	FILE_UPLOAD_FAILED: "Failed to upload file to storage",
	INVALID_INFORMATION_TYPE: "Invalid information type provided",
	MISSING_FIELDS: "Required fields are missing",
	INVALID_FILE_TYPE: "The uploaded file type is not allowed",
	FILE_NOT_FOUND: "The requested file could not be found in the storage",
	FILE_STREAMING_ERROR: "An error occurred while streaming the file",
	FILE_ACCESS_ERROR: "Unable to access the requested file",
	// Category-related messages
	CATEGORY_NOT_FOUND: "Category not found",
	UNABLE_CREATE_CATEGORY: "Unable to create category with provided data",
	UNABLE_MODIFY_CATEGORY: "Unable to modify category with provided data",
	DUPLICATE_CATEGORY: "A category with this name already exists",
}
// Shared message generators
export const SHARED_MESSAGES = {
	required: (type: string): string => `The ${type} is required`,
	mustBeString: (type: string): string => `The ${type} must be a string`,
	length: (type: string, min: number, max: number): string =>
		`The ${type} must contain between ${min} and ${max} characters`,
	cannotBeEmpty: (type: string): string => `The ${type} cannot be empty`,
	statusInvalid: (roles: string[]): string => `The status must be one of the following: ${roles.join(", ")}`,
	minLength: (type: string, min: number): string => `The ${type} must contain at least ${min} characters`,
	maxLength: (type: string, max: number): string => `The ${type} must not contain more than ${max} characters`,
}
// Message generator functions for users
export const USER_MESSAGE = {
	...SHARED_MESSAGES,
	emailInvalid: `The ${FIELD.EMAIL} must be a valid email address`,
	passwordRequirements: `The ${FIELD.PASSWORD} must contain at least one uppercase letter, one lowercase letter, one number, and one special character in ${SPECIAL_CHARS_DISPLAY}`,
	roleInvalid: (roles: string[]): string => `The role must be one of the following: ${roles.join(", ")}`,
}

export const INFORMATION_MESSAGE = {
	...SHARED_MESSAGES,
	CONTENT_REQUIRED: "Content is required for text information",
	FILE_REQUIRED: "File is required for media information",
	INVALID_TYPE: (validTypes: string[]): string =>
		`The information type must be one of the following: ${validTypes.join(", ")}`,
	typeInvalid: (type: string[]): string => `The type must be one of the following: ${type.join(", ")}`,
	fileRequired: (type: string): string => `File is required for ${type} information type`,
}
export const CATEGORY_MESSAGE = {
	...SHARED_MESSAGES,
	duplicateName: "A category with this name already exists",
}

// Message generator functions for tokens
export const TOKEN_MESSAGE = {
	cannotBeEmpty: SHARED_MESSAGES.cannotBeEmpty,
	mustBeString: SHARED_MESSAGES.mustBeString,
	invalidFormat: (type: string): string => `The ${type} must be a valid format: MongoDB ObjectID`,
	refreshTokenRequired: "The refresh token is required",
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
	[ERROR_CODE.INVALID_FILE_TYPE]: {
		code: ERROR_CODE.INVALID_FILE_TYPE,
		message: ERROR_MESSAGE.INVALID_FILE_TYPE,
		statusCode: 400,
		location: "file",
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
	[ERROR_CODE.INFORMATION_NOT_FOUND]: {
		code: ERROR_CODE.INFORMATION_NOT_FOUND,
		message: ERROR_MESSAGE.NOT_FOUND("Information"),
		statusCode: 404,
	},
	[ERROR_CODE.UNABLE_CREATE_INFORMATION]: {
		code: ERROR_CODE.UNABLE_CREATE_INFORMATION,
		message: "Unable to create information with provided data",
		statusCode: 409,
	},
	[ERROR_CODE.UNABLE_MODIFY_INFORMATION]: {
		code: ERROR_CODE.UNABLE_MODIFY_INFORMATION,
		message: "Unable to modify information with provided data",
		statusCode: 409,
	},
	[ERROR_CODE.INACTIVE_USER]: {
		code: ERROR_CODE.INACTIVE_USER,
		message: ERROR_MESSAGE.INACTIVE_USER,
		statusCode: 403,
	},
	[ERROR_CODE.CONTENT_REQUIRED]: {
		code: ERROR_CODE.CONTENT_REQUIRED,
		message: ERROR_MESSAGE.CONTENT_REQUIRED,
		statusCode: 400,
	},
	[ERROR_CODE.FILE_REQUIRED]: {
		code: ERROR_CODE.FILE_REQUIRED,
		message: ERROR_MESSAGE.FILE_REQUIRED,
		statusCode: 400,
	},
	[ERROR_CODE.FILE_UPLOAD_FAILED]: {
		code: ERROR_CODE.FILE_UPLOAD_FAILED,
		message: ERROR_MESSAGE.FILE_UPLOAD_FAILED,
		statusCode: 500,
	},
	[ERROR_CODE.INVALID_INFORMATION_TYPE]: {
		code: ERROR_CODE.INVALID_INFORMATION_TYPE,
		message: ERROR_MESSAGE.INVALID_INFORMATION_TYPE,
		statusCode: 400,
	},
	[ERROR_CODE.MISSING_FIELDS]: {
		code: ERROR_CODE.MISSING_FIELDS,
		message: ERROR_MESSAGE.MISSING_FIELDS,
		statusCode: 400,
	},
	[ERROR_CODE.FILE_NOT_FOUND]: {
		code: ERROR_CODE.FILE_NOT_FOUND,
		message: ERROR_MESSAGE.FILE_NOT_FOUND,
		statusCode: 404,
	},
	[ERROR_CODE.FILE_STREAMING_ERROR]: {
		code: ERROR_CODE.FILE_STREAMING_ERROR,
		message: ERROR_MESSAGE.FILE_STREAMING_ERROR,
		statusCode: 500,
	},
	[ERROR_CODE.FILE_ACCESS_ERROR]: {
		code: ERROR_CODE.FILE_ACCESS_ERROR,
		message: ERROR_MESSAGE.FILE_ACCESS_ERROR,
		statusCode: 403,
	},
	[ERROR_CODE.CATEGORY_NOT_FOUND]: {
		code: ERROR_CODE.CATEGORY_NOT_FOUND,
		message: ERROR_MESSAGE.CATEGORY_NOT_FOUND,
		statusCode: 404,
	},
	[ERROR_CODE.UNABLE_CREATE_CATEGORY]: {
		code: ERROR_CODE.UNABLE_CREATE_CATEGORY,
		message: ERROR_MESSAGE.UNABLE_CREATE_CATEGORY,
		statusCode: 409,
	},
	[ERROR_CODE.UNABLE_MODIFY_CATEGORY]: {
		code: ERROR_CODE.UNABLE_MODIFY_CATEGORY,
		message: ERROR_MESSAGE.UNABLE_MODIFY_CATEGORY,
		statusCode: 409,
	},
	[ERROR_CODE.DUPLICATE_CATEGORY]: {
		code: ERROR_CODE.DUPLICATE_CATEGORY,
		message: ERROR_MESSAGE.DUPLICATE_CATEGORY,
		statusCode: 409,
	},
}

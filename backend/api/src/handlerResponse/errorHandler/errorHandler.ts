import { ERROR_MAPPING, ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import type { ErrorData, IErrorInfo } from "@api/types/handlerResponse.js"
import type { Response } from "express"

export function getErrorInfo(errorCode: string): IErrorInfo {
	return ERROR_MAPPING[errorCode] || ERROR_MAPPING[ERROR_CODE.UNEXPECTED]
}
/**
 * Function to format an error response
 *
 * @param {ErrorData} error - The error data to include in the response
 * @returns {Object} - The formatted error response object
 */
export const errorResponse = (error: ErrorData) => {
	return {
		success: false,
		error: error,
	}
}

/**
 * Error handler function to map errors to appropriate HTTP status codes.
 *
 * This function uses the error mapping from the configuration to determine
 * the appropriate status code and error message for the provided error code.
 *
 * @param {Response} res - The Express response object.
 * @param {string} errorCode - The error code to handle.
 * @param {string} [customMessage] - Optional custom error message.
 * @param {any[]} [errors] - Optional array of validation errors.
 * @returns {Response} - The Express response with appropriate status code and error message.
 */
export const errorHandler = (res: Response, errorCode: string, customMessage?: string, errors?: unknown[]): Response => {
	// Get error information from the mapping
	const errorInfo = getErrorInfo(errorCode)

	// Create the error response data
	const errorData: ErrorData = {
		code: errorInfo.code,
		msg: customMessage || errorInfo.message,
	}

	// Add location if it exists
	if (errorInfo.location) {
		errorData.location = errorInfo.location
	}

	// Add detailed errors if provided
	if (errors && errors.length > 0) {
		errorData.errors = errors
	}

	// Return the response with the appropriate status code
	return res.status(errorInfo.statusCode).json(errorResponse(errorData))
}

/**
 * Helper function to handle unexpected errors
 *
 * @param {Response} res - The Express response object
 * @param {Error} error - The error object
 * @returns {Response} - The Express response with a server error
 */
export const handleUnexpectedError = (res: Response, error: Error): Response => {
	console.error("Unexpected error:", error)

	return errorHandler(
		res,
		ERROR_CODE.UNEXPECTED,
		process.env.NODE_ENV === "development" ? error.message : undefined
	)
}

/**
 * Helper function to handle validation errors
 *
 * @param {Response} res - The Express response object
 * @param {any[]} validationErrors - Array of validation errors
 * @returns {Response} - The Express response with validation errors
 */
export const handleValidationErrors = (res: Response, validationErrors: any[]): Response => {
	// Format validation errors
	const formattedErrors = validationErrors.map((error) => ({
		field: error.path || error.param,
		message: error.msg,
		location: error.location,
	}))

	return errorHandler(res, ERROR_CODE.MISSING_INFO, "Validation failed", formattedErrors)
}

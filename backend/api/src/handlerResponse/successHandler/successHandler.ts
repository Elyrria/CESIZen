import { SUCCESS_MAPPING } from "@api/src/handlerResponse/successHandler/configs.successHandler.ts"
import type { ISuccessInfo, ISuccessResponseData } from "@api/types/handlerResponse.d.ts"
import type { IUser } from "@api/types/user.d.ts"
import type { Response } from "express"

/**
 * Utility function to get success information
 *
 * @param successCode - The success code to get information for
 * @returns The success information for the provided code
 */
export function getSuccessInfo(successCode: string): ISuccessInfo {
	return (
		SUCCESS_MAPPING[successCode] || {
			code: "genericSuccess",
			message: "Operation completed successfully",
			statusCode: 200,
		}
	)
}

/**
 * Utility function to create a success info object with custom message
 *
 * @param successCode - The success code to base on
 * @param customMessage - Custom success message
 * @returns A success info object with the custom message
 */
export function createSuccessInfo(successCode: string, customMessage?: string): ISuccessInfo {
	const successInfo = getSuccessInfo(successCode)

	if (customMessage) {
		return {
			...successInfo,
			message: customMessage,
		}
	}

	return successInfo
}

/**
 * Function to format a success response
 *
 * @param {SuccessResponseData} successData - The success data to include in the response
 * @returns {Object} - The formatted success response object
 */
export const successResponse = (successData: ISuccessResponseData) => {
	return {
		success: true,
		...successData,
	}
}

/**
 * Success handler function to map success codes to appropriate HTTP status codes.
 *
 * This function uses the success mapping from the configuration to determine
 * the appropriate status code and success message for the provided success code.
 *
 * @param {Response} res - The Express response object.
 * @param {string} successCode - The success code to handle.
 * @param {any} [data] - Optional data to include in the response.
 * @param {string} [customMessage] - Optional custom success message.
 * @returns {Response} - The Express response with appropriate status code and success message.
 */
export const successHandler = (res: Response, successCode: string, data?: any, customMessage?: string): Response => {
	// Get success information from the mapping
	const successInfo = customMessage ? createSuccessInfo(successCode, customMessage) : getSuccessInfo(successCode)

	// Create the success response data
	const responseData: ISuccessResponseData = {
		code: successInfo.code,
		message: successInfo.message,
	}

	// Add data if provided
	if (data !== undefined) {
		responseData.data = data
	}

	// Return the response with the appropriate status code
	return res.status(Number(successInfo.statusCode)).json(successResponse(responseData))
}

/**
 * Helper for creating a new resource (HTTP 201 Created)
 *
 * @param {Response} res - The Express response object
 * @param {string} successCode - The success code for creation events
 * @param {IUser} data - The created resource data
 * @param {string} [customMessage] - Optional custom success message
 * @returns {Response} - The Express response
 */
export const createdHandler = (res: Response, successCode: string, data: IUser, customMessage?: string): Response => {
	return successHandler(res, successCode, data, customMessage)
}

/**
 * Helper for successful retrieval of resources (HTTP 200 OK)
 *
 * @param {Response} res - The Express response object
 * @param {string} successCode - The success code for retrieval events
 * @param {any} data - The retrieved resource data
 * @param {string} [customMessage] - Optional custom success message
 * @returns {Response} - The Express response
 */
export const okHandler = (res: Response, successCode: string, data: any, customMessage?: string): Response => {
	return successHandler(res, successCode, data, customMessage)
}

/**
 * Helper for successful updates (HTTP 200 OK)
 *
 * @param {Response} res - The Express response object
 * @param {string} successCode - The success code for update events
 * @param {any} data - The updated resource data
 * @param {string} [customMessage] - Optional custom success message
 * @returns {Response} - The Express response
 */
export const updatedHandler = (res: Response, successCode: string, data: any, customMessage?: string): Response => {
	return successHandler(res, successCode, data, customMessage)
}

/**
 * Helper for successful deletions (HTTP 200 OK)
 *
 * @param {Response} res - The Express response object
 * @param {string} successCode - The success code for deletion events
 * @param {any} [data] - Optional data to return
 * @param {string} [customMessage] - Optional custom success message
 * @returns {Response} - The Express response
 */
export const deletedHandler = (res: Response, successCode: string, data?: any, customMessage?: string): Response => {
	return successHandler(res, successCode, data, customMessage)
}

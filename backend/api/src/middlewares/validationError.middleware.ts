import { handleValidationErrors } from "@errorHandler/errorHandler.ts"
import type { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"

/**
 * Middleware to handle validation errors in Express.
 *
 * This middleware is used to check if there are any validation errors in the request.
 * If validation errors are present, it returns a response with the error details.
 * If there are no validation errors, it passes the request to the next middleware or route handler.
 *
 * @param req - The Express request object containing the data to be validated.
 * @param res - The Express response object used to send the response back to the client.
 * @param next - The Express next function used to pass control to the next middleware if no validation errors are found.
 *
 * @returns If validation errors exist, an appropriate HTTP status with the errors in the response body.
 *          If no errors are found, it calls the next middleware or route handler.
 */
export const validationErrorHandler = (req: Request, res: Response, next: NextFunction): void => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		handleValidationErrors(res, errors.array())
		return
	}

	next()
}

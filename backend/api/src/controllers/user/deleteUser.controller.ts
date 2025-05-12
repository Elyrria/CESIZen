import { checkAuthentification, checkUserRole, checkUserParams } from "@controllers/user/utils/checkAuth.ts"
import { errorHandler, handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { deletedHandler } from "@successHandler/successHandler.ts"
import type { IUser } from "@api/types/user.d.ts"
import type { Request, Response } from "express"
import { User } from "@models/index.ts" /**
 * Controller for deleting a user by ID with authentication.
 *
 * This controller handles the process of deleting a user by their ID, performed by an authenticated user.
 * It checks the authenticated user's role and ensures they have the necessary permissions to delete the specified user.
 *
 * @param {AuthRequest} req - The authenticated request object containing the user ID in the parameters.
 * @param {Response} res - The response object to send a success message or an error message.
 * @returns {Promise<Response>} - A promise that resolves to the response object with a success message or an error message.
 */
export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
	try {
		// Check authentication and retrieve the authenticated user
		const user: IUser | null = await checkAuthentification(req)

		if (!user || !user._id) {
			errorHandler(res, ERROR_CODE.NO_CONDITIONS)
            return
		}

		let userRoleIndex: number = -1

		try {
			// Determine the role index for the authenticated user
			userRoleIndex = user?.role ? checkUserRole(user.role) : userRoleIndex
		} catch (error: unknown) {
			const errorType = error instanceof Error ? error.message : ERROR_CODE.SERVER
			errorHandler(res, errorType)
			return
		}

		// Ensure the authenticated user has sufficient permissions to delete a user
		if (userRoleIndex > 1) {
			errorHandler(res, ERROR_CODE.INSUFFICIENT_ACCESS)
			return
		}
		// Check if user with role index 1 is trying to delete another user's account
		if (userRoleIndex === 1 && user?._id.toString() !== req.params.id) {
			errorHandler(res, ERROR_CODE.INSUFFICIENT_ACCESS)
			return
		}

		// Check the role of the user to be deleted
		const userRoleIndexToDelete: number = await checkUserParams(req.params.id)

		// Ensure the authenticated user has the authority to delete the specified user
		if (userRoleIndex > userRoleIndexToDelete) {
			errorHandler(res, ERROR_CODE.INSUFFICIENT_ACCESS)
			return
		}

		// Delete the user by ID
		await User.findByIdAndDelete(req.params.id)

		// Return a success message
		deletedHandler(res, SUCCESS_CODE.USER_DELETED)
		return
	} catch (error: unknown) {
		handleUnexpectedError(res, error as Error)
		return
	}
}

import { checkAuthentification, checkUserRole, checkUserParams } from "@controllers/user/utils/checkAuth.ts"
import { errorHandler, handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { prepareUserAuthResponse } from "@controllers/user/utils/userAuthUtils.ts"
import { processPasswordUpdate } from "@controllers/user/utils/passwordUtils.ts"
import { SUCCESS_CODE } from "@successHandler/configs.successHandler.ts"
import type { IUser } from "@api/types/user.d.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { updatedHandler } from "@successHandler/successHandler.ts"
import type { IAuthRequest } from "@api/types/request.d.ts"
import { processUserUpdateData } from "@utils/crypto.ts"
import type { Response } from "express"
import { User } from "@models/index.ts"
import {
	validateAndCleanUserData,
	checkModificationPermission,
	canAssignRole,
} from "@controllers/user/utils/userUpdateUtils.ts"

/**
 * Controller for modifying a user by ID with authentication.
 *
 * This controller handles the process of updating a user's information by their ID,
 * performed by an authenticated user.
 * It checks the authenticated user's role and ensures they have the necessary permissions.
 *
 * @param {IAuthRequest} req - The authenticated request object containing the user ID and updated details
 * @param {Response} res - The response object to send a success or error message
 * @returns {Promise<void>} - A promise that resolves to the response object
 */
export const updateUser = async (req: IAuthRequest, res: Response): Promise<void> => {
	try {
		// Authentication and retrieval of user information
		const authenticatedUser: IUser | null = await checkAuthentification(req)
		if (!authenticatedUser || !authenticatedUser._id) {
			errorHandler(res, ERROR_CODE.UNAUTHORIZED)
			return
		}
		// Determine the role index for the authenticated user
		let authenticatedUserRoleIndex: number = -1
		try {
			authenticatedUserRoleIndex = authenticatedUser.role
			? checkUserRole(authenticatedUser.role)
			: authenticatedUserRoleIndex
		} catch (error: unknown) {
			const errorType = error instanceof Error ? error.message : ERROR_CODE.SERVER
			errorHandler(res, errorType)
			return
		}

		// Determine if it's a self-modification or modification of another user
		const targetUserId = req.params.id
		const isModifyingSelf = authenticatedUser._id.toString() === targetUserId
		const isAdmin = authenticatedUserRoleIndex === 0

		// Check permissions for the target user
		if (!isModifyingSelf) {
			const targetUserRoleIndex: number = await checkUserParams(targetUserId)

			if (
				!checkModificationPermission(
					authenticatedUserRoleIndex,
					targetUserRoleIndex,
					isModifyingSelf,
					res
				)
			) {
				return
			}
		}

		// Validate and clean user data
		const cleanUserObject = validateAndCleanUserData(req.body, isAdmin, isModifyingSelf, res)
		if (!cleanUserObject) return
		
		if (cleanUserObject.email) {
			const existingUser = await User.findOne({
				email: cleanUserObject.email,
				_id: { $ne: targetUserId },
			})

			if (existingUser) {
				errorHandler(res, ERROR_CODE.UNABLE_MODIFY_USER)
				return
			}
		}
		// Check and process password update if necessary
		const finalUserObject = await processPasswordUpdate(cleanUserObject, targetUserId, res)
		if (!finalUserObject) return

		// Check the role if a role update is requested
		if (finalUserObject.role && !isModifyingSelf) {
			if (!canAssignRole(authenticatedUserRoleIndex, finalUserObject.role, res)) {
				return
			}
		}

		const processedData = await processUserUpdateData(finalUserObject)

		// Si processedData est vide, ne pas continuer
		if (Object.keys(processedData).length === 0) {
			errorHandler(res, ERROR_CODE.NO_FIELDS)
			return
		}

		// Perform the update
		const updatedUser = await User.findByIdAndUpdate(
			targetUserId,
			{ $set: { ...processedData } },
			{ new: true }
		)

		if (!updatedUser) {
			errorHandler(res, ERROR_CODE.USER_NOT_FOUND)
			return
		}

		// Prepare the response
		const { password, _id, ...userWithoutPassword } = updatedUser.toObject()
			? updatedUser.toObject()
			: updatedUser

		// Generate tokens only if the user is modifying their own information
		const authResponse = await prepareUserAuthResponse(
			{ ...userWithoutPassword, id: _id },
			req,
			res,
			!isModifyingSelf // Don't generate tokens if admin is modifying another user
		)

		if (!authResponse) return

		// Send success response
		updatedHandler(res, SUCCESS_CODE.USER_UPDATED, authResponse)
	} catch (error: unknown) {
		handleUnexpectedError(res, error as Error)
	}
}

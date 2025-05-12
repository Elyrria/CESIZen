import type { Response } from "express"
import type { IUserReqBodyRequest } from "@api/types/user.d.ts"
import { errorHandler } from "@errorHandler/errorHandler.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { ROLES, ROLE_HIERARCHY } from "@configs/role.configs.ts"
import { deleteObjectIds } from "@utils/idCleaner.ts"

/**
 * Validates and cleans input data for user update
 * @param userObject - Raw request data
 * @param isAdmin - Whether the authenticated user is an admin
 * @param isModifyingSelf - Whether the user is modifying their own information
 * @param res - Express Response object
 * @returns Cleaned user object or null in case of error
 */
export const validateAndCleanUserData = (
	userObject: IUserReqBodyRequest,
	isAdmin: boolean,
	isModifyingSelf: boolean,
	res: Response
): IUserReqBodyRequest | null => {
	// Clean IDs for security reasons
	const cleanUserObject = deleteObjectIds(userObject)

	// If no fields to update
	if (Object.keys(cleanUserObject).length === 0) {
		errorHandler(res, ERROR_CODE.NO_FIELDS)
		return null
	}

	// Validate role if present
	if (cleanUserObject.role) {
		// Check if the role is valid
		if (!Object.values(ROLES).includes(cleanUserObject.role)) {
			errorHandler(res, ERROR_CODE.ROLE_UNAVAILABLE)
			return null
		}

		// A non-admin user cannot change their own role
		if (isModifyingSelf && !isAdmin) {
			delete cleanUserObject.role
		}
	}

	return cleanUserObject
}

/**
 * Checks if the user has permission to perform the modification
 * @param authenticatedUserRoleIndex - Role index of the authenticated user
 * @param targetUserRoleIndex - Role index of the user to modify
 * @param isModifyingSelf - Whether the user is modifying their own information
 * @param res - Express Response object
 * @returns Boolean indicating whether access is allowed
 */
export const checkModificationPermission = (
	authenticatedUserRoleIndex: number,
	targetUserRoleIndex: number,
	isModifyingSelf: boolean,
	res: Response
): boolean => {
	// A normal user can only modify their own information
	if (!isModifyingSelf && authenticatedUserRoleIndex > 0) {
		errorHandler(res, ERROR_CODE.INSUFFICIENT_ACCESS)
		return false
	}

	// A user cannot modify a user with a higher role level
	if (!isModifyingSelf && authenticatedUserRoleIndex > targetUserRoleIndex) {
		errorHandler(res, ERROR_CODE.INSUFFICIENT_ACCESS)
		return false
	}

	return true
}

/**
 * Checks if the requested role can be assigned by the authenticated user
 * @param authenticatedUserRoleIndex - Role index of the authenticated user
 * @param requestedRole - Requested role for the target user
 * @param res - Express Response object
 * @returns Boolean indicating whether role assignment is allowed
 */
export const canAssignRole = (authenticatedUserRoleIndex: number, requestedRole: string, res: Response): boolean => {
	const requestedRoleIndex = ROLE_HIERARCHY.indexOf(requestedRole)

	// A user cannot assign a role higher than their own role
	if (authenticatedUserRoleIndex > requestedRoleIndex) {
		errorHandler(res, ERROR_CODE.INSUFFICIENT_ACCESS)
		return false
	}

	return true
}

import { ERROR_MESSAGE } from "@errorHandler/configs.errorHandler.ts"
import type { IAuthRequest } from "@api/types/request.d.ts"
import { ROLE_HIERARCHY } from "@configs/role.configs.ts"
import type { IUser } from "@api/types/user.d.ts"
import type {Role} from "@api/types/roles.d.ts"
import { User } from "@models/index.ts"
/**
 * Function to check the authentication of a request.
 *
 * This function verifies if the request is authenticated by checking the presence of a user ID in the request's auth object.
 * It retrieves the user from the database using the user ID and returns the user object if found.
 *
 */

export const checkAuthentification = async (req: IAuthRequest) => {
	if (!req.auth || !req.auth.userId) throw new Error(ERROR_MESSAGE.UNAUTHORIZED)

	const user: IUser | null = await User.findById(req.auth.userId)
	return user
}

/**
 * Function to check the role of a user.
 *
 * This function takes a user role and returns its index in the role hierarchy.
 * If the role is not found in the hierarchy, it throws an error.
 *
 */

export const checkUserRole = (userRole: Role) => {
    const userRoleIndex: number = ROLE_HIERARCHY.indexOf(userRole)

    if (userRoleIndex === -1) throw new Error(ERROR_MESSAGE.ROLE_UNAVAILABLE)

    return userRoleIndex
}
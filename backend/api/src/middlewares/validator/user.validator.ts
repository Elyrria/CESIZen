import { ROLES } from "@configs/role.configs.ts"
import { VALIDATOR } from "@api/src/middlewares/validator/schemas/user.validator.schema.ts"

/**
 * Validation rules for user registration (sign up).
 * These rules validate the required fields for creating a new user.
 *
 * @returns An array of validation rules for the 'email', 'password', 'name', and 'role' fields.
 */
export const createUserValidationRules = [
	...VALIDATOR.REQUIRED.EMAIL(),
	...VALIDATOR.REQUIRED.PASSWORD(),
	...VALIDATOR.REQUIRED.NAME(),
	...VALIDATOR.REQUIRED.BIRTH_DATE(),
	...VALIDATOR.REQUIRED.ROLE([ROLES.REGISTERED_USER]), // User role only
]

/**
 * Validation rules for creating a new user by an admin.
 * These rules validate the required fields when an admin creates a new user.
 *
 * @returns An array of validation rules for the 'email', 'password', 'name', and 'role' fields.
 */
export const adminCreateUserValidationRules = [
	...VALIDATOR.REQUIRED.EMAIL(),
	...VALIDATOR.REQUIRED.PASSWORD(),
	...VALIDATOR.REQUIRED.NAME(),
	...VALIDATOR.REQUIRED.BIRTH_DATE(),
	...VALIDATOR.REQUIRED.ROLE(Object.values(ROLES)), // All roles are valid
]

/**
 * Validation rules for user login.
 * These rules validate the 'email' and 'password' fields required for logging in.
 *
 * @returns An array of validation rules for the 'email' and 'password' fields.
 */
export const loginUserValidationRules = [...VALIDATOR.REQUIRED.EMAIL(), ...VALIDATOR.REQUIRED.PASSWORD()]

/**
 * Validation rules for updating user information.
 * These rules allow optional updates to the 'email', 'password', 'name', and 'role' fields.
 *
 * @returns An array of validation rules for the 'email', 'password', 'name', and 'role' fields.
 */
export const updateUserValidationRules = [
	...VALIDATOR.OPTIONAL.EMAIL(),
	...VALIDATOR.OPTIONAL.NEW_PASSWORD(),
	...VALIDATOR.OPTIONAL.PASSWORD(),
	...VALIDATOR.OPTIONAL.NAME(),
	...VALIDATOR.OPTIONAL.BIRTH_DATE(),
	...VALIDATOR.OPTIONAL.ROLE(Object.values(ROLES)), // All roles are valid
]

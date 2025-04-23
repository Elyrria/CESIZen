import type {ISuccessInfo } from "@api/types/handlerResponse.d.ts"

/**
 * Namespace for success event codes
 */
export const SUCCESS_CODE = {
	// User related success codes
	USER_CREATED: "userCreated",
	USER_DELETED: "userDeleted",
	USER_UPDATED: "userUpdated",
	USER_FOUND: "userFound",
	USERS_FOUND: "usersFound",
	NO_USER: "noUser",

	// Authentication related success codes
	LOGIN_SUCCESS: "loginSuccess",
	LOGOUT_SUCCESS: "logoutSuccess",
	TOKEN_RENEWED: "tokenRenewed",

	// Content related success codes
	COMMENT_CREATED: "commentCreated",
}

/**
 * Predefined success messages
 */
export const SUCCESS_MESSAGE = {
	USER_CREATED: "User created successfully",
	USER_DELETED: "User deleted successfully",
	USER_UPDATED: "User updated successfully",
	USER_FOUND: "User found",
	USERS_FOUND: "Users found",
	NO_USER: "No user found",
	LOGIN_SUCCESS: "Login successful",
	LOGOUT_SUCCESS: "User logged out successfully",
	TOKEN_RENEWED: "New token generated",
	COMMENT_CREATED: "Comment created successfully",
}

/**
 * Complete mapping of success codes with their associated information
 */
export const SUCCESS_MAPPING: Record<string, ISuccessInfo> = {
	[SUCCESS_CODE.USER_CREATED]: {
		code: SUCCESS_CODE.USER_CREATED,
		message: SUCCESS_MESSAGE.USER_CREATED,
		statusCode: 201,
	},
	[SUCCESS_CODE.USER_DELETED]: {
		code: SUCCESS_CODE.USER_DELETED,
		message: SUCCESS_MESSAGE.USER_DELETED,
		statusCode: 200,
	},
	[SUCCESS_CODE.USER_UPDATED]: {
		code: SUCCESS_CODE.USER_UPDATED,
		message: SUCCESS_MESSAGE.USER_UPDATED,
		statusCode: 200,
	},
	[SUCCESS_CODE.USER_FOUND]: {
		code: SUCCESS_CODE.USER_FOUND,
		message: SUCCESS_MESSAGE.USER_FOUND,
		statusCode: 200,
	},
	[SUCCESS_CODE.USERS_FOUND]: {
		code: SUCCESS_CODE.USERS_FOUND,
		message: SUCCESS_MESSAGE.USERS_FOUND,
		statusCode: 200,
	},
	[SUCCESS_CODE.NO_USER]: {
		code: SUCCESS_CODE.NO_USER,
		message: SUCCESS_MESSAGE.NO_USER,
		statusCode: 200,
	},
	[SUCCESS_CODE.LOGIN_SUCCESS]: {
		code: SUCCESS_CODE.LOGIN_SUCCESS,
		message: SUCCESS_MESSAGE.LOGIN_SUCCESS,
		statusCode: 200,
	},
	[SUCCESS_CODE.LOGOUT_SUCCESS]: {
		code: SUCCESS_CODE.LOGOUT_SUCCESS,
		message: SUCCESS_MESSAGE.LOGOUT_SUCCESS,
		statusCode: 200,
	},
	[SUCCESS_CODE.TOKEN_RENEWED]: {
		code: SUCCESS_CODE.TOKEN_RENEWED,
		message: SUCCESS_MESSAGE.TOKEN_RENEWED,
		statusCode: 201,
	},
	[SUCCESS_CODE.COMMENT_CREATED]: {
		code: SUCCESS_CODE.COMMENT_CREATED,
		message: SUCCESS_MESSAGE.COMMENT_CREATED,
		statusCode: 201,
	},
}

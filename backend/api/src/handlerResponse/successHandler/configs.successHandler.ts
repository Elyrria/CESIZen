import type { ISuccessInfo } from "@api/types/handlerResponse.d.ts"

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
	// Information-related success codes
	INFORMATION_CREATED: "informationCreated",
	INFORMATION_UPDATED: "informationUpdated",
	INFORMATION_DELETED: "informationDeleted",
	INFORMATION_FOUND: "informationFound",
	INFORMATION_LIST: "informationList",
	NO_INFORMATION: "noInformation",
	// Category-related success codes
	CATEGORY_CREATED: "categoryCreated",
	CATEGORY_UPDATED: "categoryUpdated",
	CATEGORY_DELETED: "categoryDeleted",
	CATEGORY_FOUND: "categoryFound",
	CATEGORY_LIST: "categoryList",
	NO_CATEGORY: "noCategory",
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
	// Information-related success messages
	INFORMATION_CREATED: "Information created successfully",
	INFORMATION_UPDATED: "Information updated successfully",
	INFORMATION_DELETED: "Information deleted successfully",
	INFORMATION_FOUND: "Information retrieved successfully",
	INFORMATION_LIST: "Information list retrieved successfully",
	NO_INFORMATION: "No information found",
	// Category-related success messages
	CATEGORY_CREATED: "Category created successfully",
	CATEGORY_UPDATED: "Category updated successfully",
	CATEGORY_DELETED: "Category deleted successfully",
	CATEGORY_FOUND: "Category retrieved successfully",
	CATEGORY_LIST: "Categories list retrieved successfully",
	NO_CATEGORY: "No category found",
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
	// Information related success mappings
	[SUCCESS_CODE.INFORMATION_CREATED]: {
		code: SUCCESS_CODE.INFORMATION_CREATED,
		message: SUCCESS_MESSAGE.INFORMATION_CREATED,
		statusCode: 201,
	},
	[SUCCESS_CODE.INFORMATION_UPDATED]: {
		code: SUCCESS_CODE.INFORMATION_UPDATED,
		message: SUCCESS_MESSAGE.INFORMATION_UPDATED,
		statusCode: 200,
	},
	[SUCCESS_CODE.INFORMATION_DELETED]: {
		code: SUCCESS_CODE.INFORMATION_DELETED,
		message: SUCCESS_MESSAGE.INFORMATION_DELETED,
		statusCode: 200,
	},
	[SUCCESS_CODE.INFORMATION_FOUND]: {
		code: SUCCESS_CODE.INFORMATION_FOUND,
		message: SUCCESS_MESSAGE.INFORMATION_FOUND,
		statusCode: 200,
	},
	[SUCCESS_CODE.INFORMATION_LIST]: {
		code: SUCCESS_CODE.INFORMATION_LIST,
		message: SUCCESS_MESSAGE.INFORMATION_LIST,
		statusCode: 200,
	},
	[SUCCESS_CODE.NO_INFORMATION]: {
		code: SUCCESS_CODE.NO_INFORMATION,
		message: SUCCESS_MESSAGE.NO_INFORMATION,
		statusCode: 200,
	},
	[SUCCESS_CODE.CATEGORY_CREATED]: {
		code: SUCCESS_CODE.CATEGORY_CREATED,
		message: SUCCESS_MESSAGE.CATEGORY_CREATED,
		statusCode: 201,
	},
	[SUCCESS_CODE.CATEGORY_UPDATED]: {
		code: SUCCESS_CODE.CATEGORY_UPDATED,
		message: SUCCESS_MESSAGE.CATEGORY_UPDATED,
		statusCode: 200,
	},
	[SUCCESS_CODE.CATEGORY_DELETED]: {
		code: SUCCESS_CODE.CATEGORY_DELETED,
		message: SUCCESS_MESSAGE.CATEGORY_DELETED,
		statusCode: 200,
	},
	[SUCCESS_CODE.CATEGORY_FOUND]: {
		code: SUCCESS_CODE.CATEGORY_FOUND,
		message: SUCCESS_MESSAGE.CATEGORY_FOUND,
		statusCode: 200,
	},
	[SUCCESS_CODE.CATEGORY_LIST]: {
		code: SUCCESS_CODE.CATEGORY_LIST,
		message: SUCCESS_MESSAGE.CATEGORY_LIST,
		statusCode: 200,
	},
	[SUCCESS_CODE.NO_CATEGORY]: {
		code: SUCCESS_CODE.NO_CATEGORY,
		message: SUCCESS_MESSAGE.NO_CATEGORY,
		statusCode: 200,
	},
}

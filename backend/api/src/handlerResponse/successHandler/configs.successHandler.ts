import type { ISuccessInfo } from "@api/types/handlerResponse.d.ts"

/**
 * Namespace for success event codes
 */
export const SUCCESS_CODE = {
	// User related success codes
	USER_CREATED: "userCreated",
	USER_DELETED: "userDeleted",
	USER_UPDATED: "userUpdated",
	USERS_FOUND: "usersFound",
	USER_FOUND: "userFound",
	NO_USER: "noUser",

	// Authentication related success codes
	LOGOUT_SUCCESS: "logoutSuccess",
	LOGIN_SUCCESS: "loginSuccess",
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
	// Activity-related success codes
	PUBLIC_ACTIVITIES: "publicActivities",
	ACTIVITY_CREATED: "activityCreated",
	ACTIVITY_UPDATED: "activityUpdated",
	ACTIVITY_DELETED: "activityDeleted",
	ACTIVITY_FOUND: "activityFound",
	ACTIVITY_LIST: "activityList",
	NO_ACTIVITY: "noActivity",
}

/**
 * Predefined success messages
 */
export const SUCCESS_MESSAGE = {
	INFORMATION_LIST: "Liste d'informations récupérée avec succès",
	INFORMATION_CREATED: "Information créée avec succès",
	INFORMATION_UPDATED: "Information mise à jour avec succès",
	INFORMATION_DELETED: "Information supprimée avec succès",
	INFORMATION_FOUND: "Information récupérée avec succès",
	PUBLIC_ACTIVITIES: "Activités publiques récupérées avec succès",
	ACTIVITY_LIST: "Liste d'activités récupérée avec succès",
	ACTIVITY_CREATED: "Activité créée avec succès",
	ACTIVITY_UPDATED: "Activité mise à jour avec succès",
	ACTIVITY_DELETED: "Activité supprimée avec succès",
	ACTIVITY_FOUND: "Activité récupérée avec succès",
	CATEGORY_LIST: "Liste de catégories récupérée avec succès",
	CATEGORY_CREATED: "Catégorie créée avec succès",
	CATEGORY_UPDATED: "Catégorie mise à jour avec succès",
	CATEGORY_DELETED: "Catégorie supprimée avec succès",
	CATEGORY_FOUND: "Catégorie récupérée avec succès",
	LOGOUT_SUCCESS: "Utilisateur déconnecté avec succès",
	COMMENT_CREATED: "Commentaire créé avec succès",
	USER_CREATED: "Utilisateur créé avec succès",
	USER_DELETED: "Utilisateur supprimé avec succès",
	USER_UPDATED: "Utilisateur mis à jour avec succès",
	LOGIN_SUCCESS: "Connexion réussie",
	TOKEN_RENEWED: "Nouveau jeton généré",
	USERS_FOUND: "Utilisateurs trouvés",
	USER_FOUND: "Utilisateur trouvé",
	NO_INFORMATION: "Aucune information trouvée",
	NO_CATEGORY: "Aucune catégorie trouvée",
	NO_ACTIVITY: "Aucune activité trouvée",
	NO_USER: "Aucun utilisateur trouvé",
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
	[SUCCESS_CODE.ACTIVITY_CREATED]: {
		code: SUCCESS_CODE.ACTIVITY_CREATED,
		message: SUCCESS_MESSAGE.ACTIVITY_CREATED,
		statusCode: 201,
	},
	[SUCCESS_CODE.ACTIVITY_UPDATED]: {
		code: SUCCESS_CODE.ACTIVITY_UPDATED,
		message: SUCCESS_MESSAGE.ACTIVITY_UPDATED,
		statusCode: 200,
	},
	[SUCCESS_CODE.ACTIVITY_DELETED]: {
		code: SUCCESS_CODE.ACTIVITY_DELETED,
		message: SUCCESS_MESSAGE.ACTIVITY_DELETED,
		statusCode: 200,
	},
	[SUCCESS_CODE.ACTIVITY_FOUND]: {
		code: SUCCESS_CODE.ACTIVITY_FOUND,
		message: SUCCESS_MESSAGE.ACTIVITY_FOUND,
		statusCode: 200,
	},
	[SUCCESS_CODE.ACTIVITY_LIST]: {
		code: SUCCESS_CODE.ACTIVITY_LIST,
		message: SUCCESS_MESSAGE.ACTIVITY_LIST,
		statusCode: 200,
	},
	[SUCCESS_CODE.NO_ACTIVITY]: {
		code: SUCCESS_CODE.NO_ACTIVITY,
		message: SUCCESS_MESSAGE.NO_ACTIVITY,
		statusCode: 200,
	},
	[SUCCESS_CODE.PUBLIC_ACTIVITIES]: {
		code: SUCCESS_CODE.PUBLIC_ACTIVITIES,
		message: SUCCESS_MESSAGE.PUBLIC_ACTIVITIES,
		statusCode: 200,
	},
}

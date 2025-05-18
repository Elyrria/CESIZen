import type { IErrorInfo } from "@api/types/handlerResponse.d.ts"
// Namespace for field-related constants
import { FIELD, SPECIAL_CHARS_DISPLAY } from "@configs/fields.configs.ts"

// Namespace for error codes
export const ERROR_CODE = {
	// General errors
	VALIDATION_FAILED: "validationFailed",
	UNEXPECTED: "unexpectedError",
	NO_CONDITIONS: "noConditions",
	MISSING_INFO: "missingInfo",
	MALFORMED: "malformed",
	NO_FIELDS: "noFields",
	SERVER: "serverError",

	// Authentication errors
	SECURITY_VALIDATION: "securityValidation",
	INSUFFICIENT_ACCESS: "insufficientAccess",
	UNAUTHORIZED: "unauthorized",

	// Token-related errors
	REFRESH_TOKEN_REQUIRED: "refreshTokenRequired",
	ALREADY_LOGOUT: "alreadyLoggedOut",
	INVALID_TOKEN: "invalidToken",
	EXPIRED_TOKEN: "expiredToken",
	REVOKED_TOKEN: "revokedToken",
	SIGN_TOKEN: "signatureInvalid",

	// User-related errors
	UNABLE_CREATE_USER: "unableToCreateUser",
	UNABLE_MODIFY_USER: "unableToModifyUser",
	USER_NOT_FOUND: "userNotFound",
	MIS_MATCH: "userMisMatch",

	// Role-related errors
	ROLE_UNAVAILABLE: "roleUnavailable",

	// Password-related errors
	NEW_PASSWORD_REQUIRED: "newPasswordRequired",
	INVALID_CREDENTIALS: "invalidCredentials",
	INCORRECT_PASSWORD: "incorrectPassword",
	PASSWORD_REQUIRED: "passwordRequired",
	NO_PASSWORD_SET: "noPasswordSet",

	// Information-related errors
	UNABLE_CREATE_INFORMATION: "unableToCreateInformation",
	UNABLE_MODIFY_INFORMATION: "unableToModifyInformation",
	INVALID_INFORMATION_TYPE: "invalidInformationType",
	INFORMATION_NOT_FOUND: "informationNotFound",
	FILE_STREAMING_ERROR: "fileStreamingError",
	FILE_UPLOAD_FAILED: "fileUploadFailed",
	CONTENT_REQUIRED: "contentRequired",
	INVALID_FILE_TYPE: "invalidFileType",
	FILE_ACCESS_ERROR: "fileAccessError",
	MISSING_FIELDS: "missingFields",
	INACTIVE_USER: "inactiveUser",
	FILE_REQUIRED: "fileRequired",
	FILE_NOT_FOUND: "fileNotFound",

	// Category-related errors
	UNABLE_MODIFY_CATEGORY: "unableToModifyCategory",
	UNABLE_CREATE_CATEGORY: "unableToCreateCategory",
	CATEGORY_NOT_FOUND: "categoryNotFound",
	DUPLICATE_CATEGORY: "duplicateCategory",
	INVALID_CATEGORY: "invalidCategory",
	// Activity-related errors
	UNABLE_CREATE_ACTIVITY: "unableToCreateActivity",
	UNABLE_MODIFY_ACTIVITY: "unableToModifyActivity",
	ACTIVITY_ACCESS_DENIED: "activityAccessDenied",
	INVALID_ACTIVITY_TYPE: "invalidActivityType",
	ACTIVITY_NOT_FOUND: "activityNotFound",
}

// Predefined error messages
export const ERROR_MESSAGE = {
	UNABLE_MODIFY_USER: "Impossible de modifier un compte avec les informations fournies",
	UNABLE_TO_CREATE: "Impossible de créer un compte avec les informations fournies",
	INVALID_CREDENTIALS: "Nom d'utilisateur/mot de passe incorrect !",
	ROLE_UNAVAILABLE: `${FIELD.ROLE} invalide`,
	REVOKED_TOKEN: "Le jeton a été révoqué",
	VALIDATION_FAILED: "La validation a échoué",
	UNAUTHORIZED: "Accès non autorisé",
	MISSING_INFO: "Informations manquantes",
	EXPIRED_TOKEN: "Jeton expiré",
	SERVER_ERROR: "Erreur serveur",
	// Information-related messages
	INACTIVE_USER: "Le compte utilisateur est inactif",
	NOT_FOUND: (type: string): string => `${type} non trouvé`,
	CONTENT_REQUIRED: "Le contenu est requis pour les informations textuelles",
	FILE_REQUIRED: "Un fichier est requis pour les informations multimédias",
	FILE_UPLOAD_FAILED: "Échec du téléchargement du fichier vers le stockage",
	INVALID_INFORMATION_TYPE: "Type d'information fourni invalide",
	MISSING_FIELDS: "Des champs obligatoires sont manquants",
	INVALID_FILE_TYPE: "Le type de fichier téléchargé n'est pas autorisé",
	FILE_NOT_FOUND: "Le fichier demandé n'a pas pu être trouvé dans le stockage",
	FILE_STREAMING_ERROR: "Une erreur s'est produite lors de la diffusion du fichier",
	FILE_ACCESS_ERROR: "Impossible d'accéder au fichier demandé",
	// Category-related messages
	CATEGORY_NOT_FOUND: "Catégorie non trouvée",
	UNABLE_CREATE_CATEGORY: "Impossible de créer une catégorie avec les données fournies",
	UNABLE_MODIFY_CATEGORY: "Impossible de modifier la catégorie avec les données fournies",
	DUPLICATE_CATEGORY: "Une catégorie avec ce nom existe déjà",
	INVALID_CATEGORY: "Catégorie invalide",
	// Activity-related messages
	ACTIVITY_NOT_FOUND: "Activité non trouvée",
	UNABLE_CREATE_ACTIVITY: "Impossible de créer une activité avec les données fournies",
	UNABLE_MODIFY_ACTIVITY: "Impossible de modifier l'activité avec les données fournies",
	INVALID_ACTIVITY_TYPE: "Type d'activité fourni invalide",
	ACTIVITY_ACCESS_DENIED: "Vous n'avez pas la permission d'accéder à cette activité",
}
// Shared message generators
export const SHARED_MESSAGES = {
	required: (type: string): string => `Le ${type} est requis`,
	mustBeString: (type: string): string => `Le ${type} doit être une chaîne de caractères`,
	length: (type: string, min: number, max: number): string =>
		`Le ${type} doit contenir entre ${min} et ${max} caractères`,
	cannotBeEmpty: (type: string): string => `Le ${type} ne peut pas être vide`,
	statusInvalid: (roles: string[]): string => `Le statut doit être l'un des suivants : ${roles.join(", ")}`,
	minLength: (type: string, min: number): string => `Le ${type} doit contenir au moins ${min} caractères`,
	maxLength: (type: string, max: number): string => `Le ${type} ne doit pas contenir plus de ${max} caractères`,
}
export const ACTIVITY_MESSAGE = {
	...SHARED_MESSAGES,
	CONTENT_REQUIRED: "Le contenu est requis pour l'activité textuelle",
	FILE_REQUIRED: "Un fichier est requis pour l'activité vidéo",
	INVALID_TYPE: (validTypes: string[]): string =>
		`Le type d'activité doit être l'un des suivants : ${validTypes.join(", ")}`,
	typeInvalid: (type: string[]): string => `Le type doit être l'un des suivants : ${type.join(", ")}`,
	fileRequired: (type: string): string => `Un fichier est requis pour le type d'activité ${type}`,
}
// Message generator functions for users
export const USER_MESSAGE = {
	...SHARED_MESSAGES,
	emailInvalid: `Le ${FIELD.EMAIL} doit être une adresse email valide`,
	passwordRequirements: `Le ${FIELD.PASSWORD} doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial parmi ${SPECIAL_CHARS_DISPLAY}`,
	roleInvalid: (roles: string[]): string => `Le rôle doit être l'un des suivants : ${roles.join(", ")}`,
}

export const INFORMATION_MESSAGE = {
	...SHARED_MESSAGES,
	CONTENT_REQUIRED: "Le contenu est requis pour les informations textuelles",
	FILE_REQUIRED: "Un fichier est requis pour les informations multimédias",
	INVALID_TYPE: (validTypes: string[]): string =>
		`Le type d'information doit être l'un des suivants : ${validTypes.join(", ")}`,
	typeInvalid: (type: string[]): string => `Le type doit être l'un des suivants : ${type.join(", ")}`,
	fileRequired: (type: string): string => `Un fichier est requis pour le type d'information ${type}`,
}
export const CATEGORY_MESSAGE = {
	...SHARED_MESSAGES,
	duplicateName: "Une catégorie avec ce nom existe déjà",
}

// Message generator functions for tokens
export const TOKEN_MESSAGE = {
	cannotBeEmpty: SHARED_MESSAGES.cannotBeEmpty,
	mustBeString: SHARED_MESSAGES.mustBeString,
	invalidFormat: (type: string): string => `Le ${type} doit avoir un format valide : MongoDB ObjectID`,
	refreshTokenRequired: "Le jeton d'actualisation est requis",
}

/**
 * Complete mapping of errors with their associated information
 */
export const ERROR_MAPPING: Record<string, IErrorInfo> = {
	[ERROR_CODE.MISSING_INFO]: {
		code: ERROR_CODE.MISSING_INFO,
		message: ERROR_MESSAGE.MISSING_INFO,
		statusCode: 400,
		location: "body",
	},
	[ERROR_CODE.VALIDATION_FAILED]: {
		code: ERROR_CODE.VALIDATION_FAILED,
		message: ERROR_MESSAGE.VALIDATION_FAILED,
		statusCode: 400,
		location: "body",
	},
	[ERROR_CODE.NO_CONDITIONS]: {
		code: ERROR_CODE.NO_CONDITIONS,
		message: "Aucune condition remplie",
		statusCode: 400,
	},
	[ERROR_CODE.ROLE_UNAVAILABLE]: {
		code: ERROR_CODE.ROLE_UNAVAILABLE,
		message: ERROR_MESSAGE.ROLE_UNAVAILABLE,
		statusCode: 400,
	},
	[ERROR_CODE.NO_FIELDS]: {
		code: ERROR_CODE.NO_FIELDS,
		message: "Aucun champ fourni pour la mise à jour",
		statusCode: 400,
	},
	[ERROR_CODE.REFRESH_TOKEN_REQUIRED]: {
		code: ERROR_CODE.REFRESH_TOKEN_REQUIRED,
		message: "Le jeton d'actualisation est requis",
		statusCode: 400,
	},
	[ERROR_CODE.ALREADY_LOGOUT]: {
		code: ERROR_CODE.ALREADY_LOGOUT,
		message: "Le jeton d'actualisation a déjà été supprimé",
		statusCode: 400,
	},
	[ERROR_CODE.NO_PASSWORD_SET]: {
		code: ERROR_CODE.NO_PASSWORD_SET,
		message: `Aucun ${FIELD.PASSWORD} défini pour ce compte. La mise à jour du ${FIELD.PASSWORD} n'est pas possible`,
		statusCode: 400,
	},
	[ERROR_CODE.NEW_PASSWORD_REQUIRED]: {
		code: ERROR_CODE.NEW_PASSWORD_REQUIRED,
		message: `'newPassword' est requis pour mettre à jour le ${FIELD.PASSWORD}`,
		statusCode: 400,
	},
	[ERROR_CODE.PASSWORD_REQUIRED]: {
		code: ERROR_CODE.PASSWORD_REQUIRED,
		message: `'${FIELD.PASSWORD}' est requis pour confirmer votre identité avant modification`,
		statusCode: 400,
	},
	[ERROR_CODE.INVALID_FILE_TYPE]: {
		code: ERROR_CODE.INVALID_FILE_TYPE,
		message: ERROR_MESSAGE.INVALID_FILE_TYPE,
		statusCode: 400,
		location: "file",
	},

	[ERROR_CODE.UNAUTHORIZED]: {
		code: ERROR_CODE.UNAUTHORIZED,
		message: ERROR_MESSAGE.UNAUTHORIZED,
		statusCode: 401,
	},
	[ERROR_CODE.INVALID_TOKEN]: {
		code: ERROR_CODE.INVALID_TOKEN,
		message: "Jeton invalide",
		statusCode: 401,
	},
	[ERROR_CODE.SECURITY_VALIDATION]: {
		code: ERROR_CODE.SECURITY_VALIDATION,
		message: "La validation de sécurité a échoué",
		statusCode: 401,
	},
	[ERROR_CODE.MALFORMED]: {
		code: ERROR_CODE.MALFORMED,
		message: "Format de jeton invalide",
		statusCode: 403,
	},
	[ERROR_CODE.SIGN_TOKEN]: {
		code: ERROR_CODE.SIGN_TOKEN,
		message: "Signature de jeton invalide",
		statusCode: 403,
	},
	[ERROR_CODE.EXPIRED_TOKEN]: {
		code: ERROR_CODE.EXPIRED_TOKEN,
		message: ERROR_MESSAGE.EXPIRED_TOKEN,
		statusCode: 403,
	},
	[ERROR_CODE.REVOKED_TOKEN]: {
		code: ERROR_CODE.REVOKED_TOKEN,
		message: ERROR_MESSAGE.REVOKED_TOKEN,
		statusCode: 403,
	},
	[ERROR_CODE.INCORRECT_PASSWORD]: {
		code: ERROR_CODE.INCORRECT_PASSWORD,
		message: `${FIELD.PASSWORD} incorrect. Veuillez réessayer`,
		statusCode: 401,
	},
	[ERROR_CODE.INVALID_CREDENTIALS]: {
		code: ERROR_CODE.INVALID_CREDENTIALS,
		message: ERROR_MESSAGE.INVALID_CREDENTIALS,
		statusCode: 401,
		location: "body",
	},
	[ERROR_CODE.INSUFFICIENT_ACCESS]: {
		code: ERROR_CODE.INSUFFICIENT_ACCESS,
		message: "Accès insuffisant",
		statusCode: 403,
	},
	[ERROR_CODE.USER_NOT_FOUND]: {
		code: ERROR_CODE.USER_NOT_FOUND,
		message: `Utilisateur non trouvé. Veuillez vérifier le ${FIELD.EMAIL} fourni`,
		statusCode: 404,
	},
	[ERROR_CODE.UNABLE_CREATE_USER]: {
		code: ERROR_CODE.UNABLE_CREATE_USER,
		message: ERROR_MESSAGE.UNABLE_TO_CREATE,
		statusCode: 409,
	},
	[ERROR_CODE.UNABLE_MODIFY_USER]: {
		code: ERROR_CODE.UNABLE_MODIFY_USER,
		message: ERROR_MESSAGE.UNABLE_MODIFY_USER,
		statusCode: 409,
	},
	[ERROR_CODE.MIS_MATCH]: {
		code: ERROR_CODE.MIS_MATCH,
		message: "Non-correspondance d'identité utilisateur",
		statusCode: 409,
	},
	[ERROR_CODE.SERVER]: {
		code: ERROR_CODE.SERVER,
		message: ERROR_MESSAGE.SERVER_ERROR,
		statusCode: 500,
	},
	[ERROR_CODE.UNEXPECTED]: {
		code: ERROR_CODE.UNEXPECTED,
		message: "Une erreur inattendue s'est produite",
		statusCode: 500,
	},
	[ERROR_CODE.INFORMATION_NOT_FOUND]: {
		code: ERROR_CODE.INFORMATION_NOT_FOUND,
		message: ERROR_MESSAGE.NOT_FOUND("Information"),
		statusCode: 404,
	},
	[ERROR_CODE.UNABLE_CREATE_INFORMATION]: {
		code: ERROR_CODE.UNABLE_CREATE_INFORMATION,
		message: "Impossible de créer l'information avec les données fournies",
		statusCode: 409,
	},
	[ERROR_CODE.UNABLE_MODIFY_INFORMATION]: {
		code: ERROR_CODE.UNABLE_MODIFY_INFORMATION,
		message: "Impossible de modifier l'information avec les données fournies",
		statusCode: 409,
	},
	[ERROR_CODE.INACTIVE_USER]: {
		code: ERROR_CODE.INACTIVE_USER,
		message: ERROR_MESSAGE.INACTIVE_USER,
		statusCode: 403,
	},
	[ERROR_CODE.CONTENT_REQUIRED]: {
		code: ERROR_CODE.CONTENT_REQUIRED,
		message: ERROR_MESSAGE.CONTENT_REQUIRED,
		statusCode: 400,
	},
	[ERROR_CODE.FILE_REQUIRED]: {
		code: ERROR_CODE.FILE_REQUIRED,
		message: ERROR_MESSAGE.FILE_REQUIRED,
		statusCode: 400,
	},
	[ERROR_CODE.FILE_UPLOAD_FAILED]: {
		code: ERROR_CODE.FILE_UPLOAD_FAILED,
		message: ERROR_MESSAGE.FILE_UPLOAD_FAILED,
		statusCode: 500,
	},
	[ERROR_CODE.INVALID_INFORMATION_TYPE]: {
		code: ERROR_CODE.INVALID_INFORMATION_TYPE,
		message: ERROR_MESSAGE.INVALID_INFORMATION_TYPE,
		statusCode: 400,
	},
	[ERROR_CODE.MISSING_FIELDS]: {
		code: ERROR_CODE.MISSING_FIELDS,
		message: ERROR_MESSAGE.MISSING_FIELDS,
		statusCode: 400,
	},
	[ERROR_CODE.FILE_NOT_FOUND]: {
		code: ERROR_CODE.FILE_NOT_FOUND,
		message: ERROR_MESSAGE.FILE_NOT_FOUND,
		statusCode: 404,
	},
	[ERROR_CODE.FILE_STREAMING_ERROR]: {
		code: ERROR_CODE.FILE_STREAMING_ERROR,
		message: ERROR_MESSAGE.FILE_STREAMING_ERROR,
		statusCode: 500,
	},
	[ERROR_CODE.FILE_ACCESS_ERROR]: {
		code: ERROR_CODE.FILE_ACCESS_ERROR,
		message: ERROR_MESSAGE.FILE_ACCESS_ERROR,
		statusCode: 403,
	},
	[ERROR_CODE.CATEGORY_NOT_FOUND]: {
		code: ERROR_CODE.CATEGORY_NOT_FOUND,
		message: ERROR_MESSAGE.CATEGORY_NOT_FOUND,
		statusCode: 404,
	},
	[ERROR_CODE.UNABLE_CREATE_CATEGORY]: {
		code: ERROR_CODE.UNABLE_CREATE_CATEGORY,
		message: ERROR_MESSAGE.UNABLE_CREATE_CATEGORY,
		statusCode: 409,
	},
	[ERROR_CODE.UNABLE_MODIFY_CATEGORY]: {
		code: ERROR_CODE.UNABLE_MODIFY_CATEGORY,
		message: ERROR_MESSAGE.UNABLE_MODIFY_CATEGORY,
		statusCode: 409,
	},
	[ERROR_CODE.DUPLICATE_CATEGORY]: {
		code: ERROR_CODE.DUPLICATE_CATEGORY,
		message: ERROR_MESSAGE.DUPLICATE_CATEGORY,
		statusCode: 409,
	},
	[ERROR_CODE.INVALID_CATEGORY]: {
		code: ERROR_CODE.INVALID_CATEGORY,
		message: ERROR_MESSAGE.INVALID_CATEGORY,
		statusCode: 400,
	},
	[ERROR_CODE.ACTIVITY_NOT_FOUND]: {
		code: ERROR_CODE.ACTIVITY_NOT_FOUND,
		message: ERROR_MESSAGE.ACTIVITY_NOT_FOUND,
		statusCode: 404,
	},
	[ERROR_CODE.UNABLE_CREATE_ACTIVITY]: {
		code: ERROR_CODE.UNABLE_CREATE_ACTIVITY,
		message: ERROR_MESSAGE.UNABLE_CREATE_ACTIVITY,
		statusCode: 409,
	},
	[ERROR_CODE.UNABLE_MODIFY_ACTIVITY]: {
		code: ERROR_CODE.UNABLE_MODIFY_ACTIVITY,
		message: ERROR_MESSAGE.UNABLE_MODIFY_ACTIVITY,
		statusCode: 409,
	},
	[ERROR_CODE.INVALID_ACTIVITY_TYPE]: {
		code: ERROR_CODE.INVALID_ACTIVITY_TYPE,
		message: ERROR_MESSAGE.INVALID_ACTIVITY_TYPE,
		statusCode: 400,
	},
	[ERROR_CODE.ACTIVITY_ACCESS_DENIED]: {
		code: ERROR_CODE.ACTIVITY_ACCESS_DENIED,
		message: ERROR_MESSAGE.ACTIVITY_ACCESS_DENIED,
		statusCode: 403,
	},
}

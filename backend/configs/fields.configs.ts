// Namespace for field-related constants
export const FIELD = {
	PASSWORD: "password",
	NAME: "name",
	FIRST_NAME: "firstName",
	BIRTH_DATE: "birthDate",
	EMAIL: "email",
	ROLE: "role",
	DESCRIPTION_INFORMATION: "descriptionInformation",
	DESCRIPTION_ACTIVITY: "descriptionActivity",
	TITLE: "title",
	AUTHOR: "authorId",
	CONTENT: "content",
	CATEGORY_NAME: "categoryName",
	ACTIVITY_NAME: "activityName",
	INFORMATION: "information",
	REFRESH_TOKEN: "refreshToken",
	ACCESS_TOKEN: "accessToken",
	USER_ID: "userId",
	TYPE: "type",
	STATUS: "status"
}

export const SPECIAL_CHARS = "@!%*?&"

export const SPECIAL_CHARS_DISPLAY = SPECIAL_CHARS.split("").join(" ")

/**
 * Configuration constants for validations and settings
 */
export const CONFIG_FIELD = {
	// Length constraints for different fields
	LENGTH: {
		UUID_MAX: 35,
		PASSWORD: {
			MIN: 8,
			MAX: 90,
		},
		NAME: {
			MIN: 2,
			MAX: 65,
		},
		FIRST_NAME: {
			MIN: 2,
			MAX: 65,
		},
		TITLE: {
			MIN: 5,
			MAX: 65,
		},
		ACTIVITY_NAME: {
			MIN: 5,
			MAX: 65,
		},
		DESCRIPTION_ACTIVITY: {
			MIN: 25,
			MAX: 600,
		},
		DESCRIPTION_INFORMATION: {
			MIN: 25,
			MAX: 600,
		},
		CATEGORY_NAME: {
			MIN: 4,
			MAX: 70,
		},
	},
	MIN_AGE: 13, // Minimum required age to use the application
	TIME: {
		REFRESH_TOKEN_EXPIRATION: "7d",
	},
}

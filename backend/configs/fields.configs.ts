// Namespace for field-related constants
export const FIELD = {
	PASSWORD: "password",
	NAME: "name",
	FIRST_NAME: "firstName",
	BIRTH_DATE: "birthDate",
	EMAIL: "email",
	ROLE: "role",
	CONTENT: "content",
	TITLE: "title",
	AUTHOR: "author",
	INFORMATION: "information",
}

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
	},
	MIN_AGE: 13, // Minimum required age to use the application
	TIME: {
		REFRESH_TOKEN_EXPIRATION: "7d",
	},
}

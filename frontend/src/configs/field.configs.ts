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
			MIN: 5,
			MAX: 70,
		},
	},
	MIN_AGE: 13, // Minimum required age to use the application
	TIME: {
		REFRESH_TOKEN_EXPIRATION: "7d",
	},
}

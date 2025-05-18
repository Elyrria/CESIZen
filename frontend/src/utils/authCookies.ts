/**
 * Utility functions for managing authentication cookies
 *
 * These functions handle:
 * - Setting auth tokens with user ID tracking
 * - Removing previous tokens for the same user
 * - Retrieving token information
 * - Clearing auth cookies
 */

// Cookie durations
const TOKEN_DURATION = {
	STANDARD: 900, // 15 minutes in seconds
	EXTENDED: 7 * 24 * 60 * 60, // 7 days in seconds
	DEFAULT_REFRESH: 24 * 60 * 60, // 1 day in seconds
}

// Cookie name constants
const COOKIE_NAMES = {
	TOKEN: "token",
	REFRESH_TOKEN: "refreshToken",
	USER_ID: "userId",
}

/**
 * Get a cookie by name
 */
export const getCookie = (name: string): string | undefined => {
	const cookieValue = document.cookie
		.split("; ")
		.find((row) => row.startsWith(`${name}=`))
		?.split("=")[1]

	return cookieValue ? decodeURIComponent(cookieValue) : undefined
}

/**
 * Set a cookie with specified expiration
 */
export const setCookie = (name: string, value: string, maxAgeInSeconds: number): void => {
	document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeInSeconds}; SameSite=Strict`
}

/**
 * Remove a cookie by name
 */
export const removeCookie = (name: string): void => {
	document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`
}

/**
 * Get the current user ID from cookie
 */
export const getUserIdFromCookie = (): string | undefined => {
	return getCookie(COOKIE_NAMES.USER_ID)
}

/**
 * Get the authentication token from cookie
 */
export const getTokenFromCookie = (): string | undefined => {
	return getCookie(COOKIE_NAMES.TOKEN)
}

/**
 * Get the refresh token from cookie
 */
export const getRefreshTokenFromCookie = (): string | undefined => {
	return getCookie(COOKIE_NAMES.REFRESH_TOKEN)
}

/**
 * Clear all authentication cookies
 */
export const clearAuthCookies = (): void => {
	removeCookie(COOKIE_NAMES.TOKEN)
	removeCookie(COOKIE_NAMES.REFRESH_TOKEN)
	removeCookie(COOKIE_NAMES.USER_ID)
}
/**
 * Set authentication cookies, managing previous sessions for the same user
 */
export const setAuthCookies = (
	userId: string,
	accessToken: string,
	refreshToken: string,
	rememberMe: boolean = false
): void => {
	// Check if there's an existing session for this user
	const currentUserId = getUserIdFromCookie()

	// If this user already had a session, clear old cookies first
	if (currentUserId === userId) {
		clearAuthCookies()
	}

	// Set new cookies with appropriate durations
	const accessTokenMaxAge = TOKEN_DURATION.STANDARD // Always 15 minutes for security
	const refreshTokenMaxAge = rememberMe ? TOKEN_DURATION.EXTENDED : TOKEN_DURATION.DEFAULT_REFRESH

	setCookie(COOKIE_NAMES.USER_ID, userId, refreshTokenMaxAge) // User ID expires with refresh token
	setCookie(COOKIE_NAMES.TOKEN, accessToken, accessTokenMaxAge)
	setCookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, refreshTokenMaxAge)
}

/**
 * Checks if the user is authenticated
 * @returns boolean indicating if user has valid authentication tokens
 */
export const isAuthenticated = (): boolean => {
	const token = getTokenFromCookie()
	const userId = getUserIdFromCookie()
	return !!token && !!userId
}

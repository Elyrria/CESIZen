/**
 * Converts a date to a string for encryption
 * @param dateValue - The date value to convert (can be Date, string, number, etc.)
 * @returns A string representing the date
 */
export function dateToString(dateValue: Date | string | number | undefined): string {
	if (dateValue === undefined || dateValue === null) {
		return ""
	}

	// If it's already a string, return it
	if (typeof dateValue === "string") {
		// Check if it's a valid date
		const timestamp = Date.parse(dateValue)
		if (isNaN(timestamp)) {
			return dateValue // Return the string as is if it's not a valid date
		}
		return dateValue // Return the date string
	}

	// If it's a number (timestamp), convert it to a date then to a string
	if (typeof dateValue === "number") {
		return new Date(dateValue).toISOString()
	}

	// If it's a Date object, convert it to a string
	if (dateValue instanceof Date) {
		return dateValue.toISOString()
	}

	// By default, convert to string
	return String(dateValue)
}

/**
 * Converts a decrypted string to a Date object if possible
 * @param dateString - The string representing a date
 * @returns A Date object or the original string if conversion fails
 */
export function stringToDate(dateString: string): Date | string {
	if (!dateString) {
		return dateString
	}

	try {
		const date = new Date(dateString)
		// Check if the date is valid
		if (!isNaN(date.getTime())) {
			return date
		}
	} catch (error) {
		console.warn("Failed to convert string to Date:", error)
	}

	// Return the original string if conversion fails
	return dateString
}

/**
 * Parses an ISO date with timezone to the French format DD/MM/YYYY
 * Example: "1994-06-14T00:00:00.000Z" -> "14/06/1994"
 *
 * @param isoDateString - Date in ISO 8601 format with timezone
 * @returns Date in DD/MM/YYYY format or empty string if invalid
 */
export const parseToFrenchDate = (isoDateString: string | null | undefined): string => {
	if (!isoDateString) return ''

	try {
		const dateMatch = isoDateString.match(/^(\d{4})-(\d{2})-(\d{2})/)

		if (dateMatch) {
			const [, year, month, day] = dateMatch
			return `${day}/${month}/${year}`
		}

		return ''
	} catch (error) {
		console.warn(`Error while parsing the date: ${isoDateString}`, error)
		return ''
	}
}

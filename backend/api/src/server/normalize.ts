/**
 * Normalizes the port value.
 * Converts a string to an integer if possible.
 *
 * @param {string} portBackend - The port value as a string.
 * @returns {string | number | false} - The normalized port.
 * @throws {Error} - If the port value is less than or equal to 0.
 */
export const normalize = (portBackend: string): string | number | false => {
	const port = parseInt(portBackend, 10) // Convert port in integer
	switch (true) {
		case isNaN(port):
			return portBackend // Return the original string if not a number
		case port <= 0:
			throw new Error(`Value cannot be ≤ to 0: ${port}`)
		case port > 0:
			return port // Return the parsed integer if valid
		default:
			return false // Fallback, though this should never happen with the above conditions
	}
}

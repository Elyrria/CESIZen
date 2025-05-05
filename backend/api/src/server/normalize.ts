/**
 * Normalizes the port value.
 * Converts a string to an integer if possible.
 *
 * @param {string} portBackend - The port value as a string.
 * @returns {string | number | false} - The normalized port.
 * @throws {Error} - If the port value is less than or equal to 0.
 */
export const normalize = (portBackend: string): string | number => {
	const port = parseInt(portBackend, 10) // Convert port in integer
	if (isNaN(port)) {
		return portBackend
	}

	if (port <= 0) {
		throw new Error(`Value cannot be ≤ to 0: ${port}`)
	}

	return port
}

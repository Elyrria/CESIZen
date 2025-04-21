import http from "http"
/**
 * Handles HTTP server errors
 */
export function errorServerHandler(error: NodeJS.ErrnoException, server: http.Server, port: string | number): void {
	if (error.syscall !== "listen") {
		throw error
	}

	const address = server.address()
	const bind = typeof address === "string" ? `pipe ${address}` : `port ${port}`

	switch (error.code) {
		case "EACCES":
			console.error(`${bind} requires elevated privileges`)
			process.exit(1)
		case "EADDRINUSE":
			console.error(`${bind} is already in use`)
			process.exit(1)
		default:
			throw error
	}
}

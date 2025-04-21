import { displayServerStartMessage } from "@server/displayServerStart.ts"
import { errorServerHandler} from "@server/errorServerHandler.ts"
import { normalize } from "@server/normalize.ts"
import express from "express"
import http from "http"

/**
 * Creates and configures the HTTP server for the Express application
 * @param {express.Application} app - The Express application
 * @var {string} port - The port to start the server on
 * @returns {http.Server} - The HTTP server instance
 */
export function createServer(app: express.Application, portValue: string): http.Server {
	// Normalize the port
	const port = normalize(String(portValue))
	if (port === false) {
		throw new Error(`Invalid port value provided : ${port}`)
	}
	// Configure the port in the application
	app.set("port", port)
	// Create the server
	const server = http.createServer(app)
	// Configure error handling
	server.on("error", (error: NodeJS.ErrnoException) => errorServerHandler(error, server, port))

	server.on("listening", () => {
		displayServerStartMessage(server, port)
	})
	return server
}



import { logger } from "@logs/logger.ts"
import mongoose from "mongoose"
import chalk from "chalk"
import http from "http"

/**
 * Sets up graceful shutdown handlers for the server
 * Ensures all connections are properly closed before the process exits
 *
 * @param {http.Server} server - The HTTP server instance
 */
export const setupGracefulShutdown = (server: http.Server): void => {
	// Handle SIGTERM (sent by systems like Kubernetes, Heroku, etc)
	process.on("SIGTERM", () => {
		logger.warn(chalk.yellow("SIGTERM signal received: closing HTTP server"))
		gracefullyShutdown(server)
	})

	// Handle SIGINT (Ctrl+C)
	process.on("SIGINT", () => {
		logger.warn(chalk.yellow("SIGINT signal received: closing HTTP server"))
		gracefullyShutdown(server)
	})

	// Handle uncaught exceptions
	process.on("uncaughtException", (error) => {
		logger.error(chalk.red("Uncaught Exception:"), error)
		gracefullyShutdown(server)
	})

	// Handle unhandled promise rejections
	process.on("unhandledRejection", (reason) => {
		logger.error(chalk.red("Unhandled Rejection:"), reason)
		gracefullyShutdown(server)
	})
}

/**
 * Performs the actual graceful shutdown sequence
 *
 * @param {http.Server} server - The HTTP server instance
 */
const gracefullyShutdown = (server: http.Server): void => {
	server.close(() => {
		logger.warn(chalk.yellow("HTTP server closed"))

		// Close MongoDB connection
		if (mongoose.connection.readyState === 1) {
			mongoose.connection
				.close(false)
				.then(() => {
					logger.warn(chalk.green("MongoDB") + " connection closed 🤐")
					process.exit(0)
				})
				.catch((err) => {
					logger.error(chalk.red("Error during MongoDB disconnection:"), err)
					process.exit(1)
				})
		} else {
			process.exit(0)
		}
	})

	// If server doesn't close in 10 seconds, force shutdown
	setTimeout(() => {
		logger.error(chalk.red("Forcing server shutdown after timeout"))
		process.exit(1)
	}, 10000)
}

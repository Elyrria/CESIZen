import type { Request, Response, NextFunction } from "express"
import morgan, { type StreamOptions } from "morgan"
import winston, { Logger } from "winston"
import moment from "moment"
import chalk from "chalk"
import path from "path"
import fs from "fs"
/**
 * Logging configuration and middleware for handling HTTP requests, responses, and errors.
 *
 * This module utilizes the `winston` logging library to log events to both the console and files
 * with different levels of logging. It also uses the `morgan` middleware to log HTTP requests,
 * including the response time, HTTP status, method, and other relevant details.
 *
 * The module includes the following components:
 * - `logger`: A `winston` logger instance for logging messages.
 * - `morganMiddleware`: A `morgan` middleware for logging HTTP requests.
 * - `errorLogger`: A middleware for logging errors.
 */

// Directory for saving log files
const logDirectory = path.join(process.cwd(), "api", "src", "logs", "filesLogs")
// Ensure the log directory exists
if (!fs.existsSync(logDirectory)) {
	fs.mkdirSync(logDirectory, { recursive: true })
}

// Define custom log levels with 'security' added
const customLevels = {
	levels: {
		error: 0,
		security: 1, // Nouveau niveau pour les événements de sécurité
		warn: 2,
		info: 3,
		debug: 4,
	},
	colors: {
		error: "red",
		security: "magenta", // Couleur pour les logs de sécurité
		warn: "yellow",
		info: "green",
		debug: "blue",
	},
}

// Add colors to Winston
winston.addColors(customLevels.colors)

// Create a custom format for the standard logger
const customFormat = winston.format.printf(({ level, message }) => {
	const timestamp = moment().format("DD/MM/YYYY:HH:mm:ss Z")
	let levelOutput

	switch (level) {
		case "error":
			levelOutput = chalk.red("[ERROR]")
			break
		case "security":
			levelOutput = chalk.magenta("[SECURITY]")
			break
		case "warn":
			levelOutput = chalk.yellow("[WARN]")
			break
		case "debug":
			levelOutput = chalk.blue("[DEBUG]")
			break
		default:
			levelOutput = chalk.green("[INFO]")
	}

	return `${chalk.bgBlue(" " + timestamp + " ")} | ${levelOutput} | ${message}`
})

// Create file transports
const consoleTransport = new winston.transports.Console()
const appFileTransport = new winston.transports.File({
	filename: path.join(logDirectory, "app.log"),
})
const errorFileTransport = new winston.transports.File({
	filename: path.join(logDirectory, "error.log"),
	level: "error",
})
const securityFileTransport = new winston.transports.File({
	filename: path.join(logDirectory, "security.log"),
	level: "security",
})

// Create the standard logger
const standardLogger: Logger = winston.createLogger({
	levels: customLevels.levels,
	level: "debug", // Définir le niveau le plus bas pour capturer tous les messages
	format: customFormat,
	transports: [consoleTransport, appFileTransport, errorFileTransport, securityFileTransport],
})

// Create a specific logger for HTTP requests (morgan)
const httpLogger: Logger = winston.createLogger({
	levels: customLevels.levels,
	level: "info",
	format: winston.format.printf(({ message }) => message as string),
	transports: [consoleTransport, appFileTransport, errorFileTransport],
})

/**
 * `morgan.token`: Custom tokens for logging HTTP request and response details with `morgan`.
 */
morgan.token("ip", (req: Request) => chalk.cyan(req.headers["x-forwarded-for"] || req.ip))
morgan.token("timestamp", () => moment().format("DD/MM/YYYY:HH:mm:ss Z"))
morgan.token("level", (req: Request, res: Response): string => {
	const status: number = res.statusCode
	if (status >= 500) return chalk.red("[ERROR]")
	if (status >= 400) return chalk.yellow("[WARN]")
	return chalk.green("[INFO]")
})
morgan.token("statusColor", (_req: Request, res: Response): string => {
	const status = res.statusCode
	if (status >= 500) return chalk.red(status.toString())
	if (status >= 400) return chalk.yellow(status.toString())
	if (status >= 300) return chalk.cyan(status.toString())
	return chalk.green(status.toString())
})
morgan.token("methodColor", (req: Request) => chalk.blue(req.method))
morgan.token("route", (req: Request) => chalk.magenta(req.originalUrl || "/"))
morgan.token("user-agent", (req: Request) => chalk.gray(req.headers["user-agent"] || "Unknown"))

/**
 * `morganFormat`: The format for logging HTTP request details using `morgan`.
 * The log includes:
 * - Timestamp
 * - Log level (INFO, WARN, ERROR)
 * - IP address
 * - HTTP method and route
 * - Status code with color coding
 * - Response time (in ms)
 * - User-Agent information
 */
const morganFormat: string =
	chalk.bgBlue(" :timestamp ") +
	" | :level | :ip | :methodColor | route : :route | status : :statusColor | execute : :response-time ms | :user-agent"

/**
 * `morganMiddleware`: A middleware function that uses `morgan` for logging HTTP requests.
 * This middleware logs requests with the defined `morganFormat` and outputs them to `winston`.
 */
export const morganMiddleware = morgan(morganFormat, {
	stream: {
		write: (message: string): void => {
			httpLogger.info(message.trim())
		},
	} as StreamOptions,
})

/**
 * `errorLogger`: Middleware to log errors.
 * Logs errors that occur during the request handling with the HTTP method and URL.
 */
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction): void => {
	standardLogger.error(`${req.method} ${req.originalUrl} - ${err.message}`)
	return next(err)
}

/**
 * Helper function to log security-related events with consistent formatting
 *
 * @param {string} message - The main security message
 * @param {Request} req - Express request object for context information
 * @param {string[]} details - Optional array of detail messages
 */
export const logSecurityEvent = (message: string, req: Request, details: string[] = []): void => {
	const ip = req.headers["x-forwarded-for"] || req.ip

	standardLogger.log("security", `${message} from ${chalk.red(ip)}`)

	details.forEach((detail) => {
		standardLogger.log("security", `  - ${detail}`)
	})

	standardLogger.log("security", `Route: ${req.method} ${req.originalUrl}`)
}

// Export the standard logger as the default logger
export const logger = standardLogger

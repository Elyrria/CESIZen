import type { Request, Response, NextFunction } from "express"
import mongoSanitize from "express-mongo-sanitize"
import rateLimit from "express-rate-limit"
import express from "express"
import helmet from "helmet"
import xss from "xss-clean"
import hpp from "hpp"

/**
 * Configures security middleware for the Express application
 *
 * @param {express.Application} app - The Express application
 */
export const setupSecurityMiddleware = (app: express.Application): void => {
	// Initialisation de base d'Express
	app.set("trust proxy", true)
	app.use(express.json({ limit: "10kb" }))
	app.use(express.urlencoded({ extended: true, limit: "10kb" }))

	// CORS middleware to allow cross-origin requests
	app.use((req: Request, res: Response, next: NextFunction) => {
		res.setHeader("Access-Control-Allow-Origin", "*") // Allows access to the API from any origin
		res.setHeader(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, userid"
		) // Allows the specified headers in requests to the API
		res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS") // Allows the specified HTTP methods in requests to the API
		next()
	})

	// Set security HTTP headers
	app.use(helmet())

	// Additional security headers
	app.use(
		helmet.contentSecurityPolicy({
			directives: {
				defaultSrc: ["'self'"],
				scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
				styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
				fontSrc: ["'self'", "fonts.gstatic.com"],
				imgSrc: ["'self'", "data:"],
				connectSrc: ["'self'"],
			},
		})
	)

	// Rate limiting to prevent brute force attacks
	const apiLimiter = rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // limit each IP to 100 requests per windowMs
		standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
		legacyHeaders: false, // Disable the `X-RateLimit-*` headers
		message: "Too many requests from this IP, please try again after 15 minutes",
	})

	// Apply rate limiting to all API routes
	app.use("/api/", apiLimiter)

	// // Data sanitization against NoSQL query injection
	// app.use(
	// 	mongoSanitize({
	// 		onSanitize: ({ req, key }) => {
	// 			console.warn(
	// 				`Cette requête contient une valeur MongoDB dangereuse pour la clé '${key}'.`
	// 			)
	// 		},
	// 		dryRun: false, // Mettez true pour tester sans bloquer
	// 	})
	// )

	// Data sanitization against XSS
	app.use(xss())

	// Prevent parameter pollution
	app.use(hpp())
}

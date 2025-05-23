import { useSanitizedData } from "@middlewares/security/useSanitizedData.middleware.ts"
import { mongoSanitizerMiddleware } from "@sanitizers/mongo.sanitizer.ts"
import { xssSanitizerMiddleware } from "@sanitizers/xss.sanitizer.ts"
import type { Request, Response, NextFunction } from "express"
import rateLimit from "express-rate-limit"
import express from "express"
import helmet from "helmet"
import hpp from "hpp"
import path from "path"

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
	app.use((_req: Request, res: Response, next: NextFunction) => {
		res.setHeader("Access-Control-Allow-Origin", "*") // Allows access to the API from any origin
		res.setHeader(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, userid, Cache-Control, If-None-Match"
		)
		res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD")
		res.setHeader("Access-Control-Expose-Headers", "Content-Length, Content-Type, ETag")
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
				imgSrc: ["'self'", "data:", "blob:", "http://localhost:*"],
				connectSrc: ["'self'"],
			},
		})
	)

	// Rate limiting to prevent brute force attacks
	const apiLimiter = rateLimit({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // limit each IP to 100 requests per windowMs
		standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
		legacyHeaders: false,
		message: "Too many requests from this IP, please try again after 15 minutes",
		keyGenerator: (req) => {
			// Version plus sûre qui gère tous les cas
			const ip =
				req.ip ||
				(req.headers["x-forwarded-for"] as string) ||
				req.socket.remoteAddress ||
				"127.0.0.1"

			// Si l'IP est une liste (comme dans x-forwarded-for), prenez la première
			return (Array.isArray(ip) ? ip[0] : ip).split(",")[0].trim()
		},
	})

	// Apply rate limiting to all API routes
	app.use("/api/", apiLimiter)

	app.use((req: Request, _res: Response, next: NextFunction) => {
		// Si c'est une route de média, on skip certains sanitizers
		if (req.path.includes('/media/')) {
			return next()
		}
		mongoSanitizerMiddleware(req, _res, next)
	})

	// Data sanitization against XSS (avec exemption pour les médias)
	app.use((req: Request, res: Response, next: NextFunction) => {
		if (req.path.includes('/media/')) {
			return next()
		}
		xssSanitizerMiddleware(req, res, next)
	})
	// Prevent parameter pollution
	app.use(hpp({
		whitelist: ['download']
	}))

	app.use((req: Request, res: Response, next: NextFunction) => {
		if (req.path.includes('/media/')) {
			return next()
		}
		useSanitizedData(req, res, next)
	})


	if (process.env.NODE_ENV !== "test") {
		let __dirname
		try {
			const mainFilePath = require.main?.filename || ""
			__dirname = path.dirname(mainFilePath)
		} catch (error) {
			__dirname = process.cwd()
		}

		app.use('/assets', (req: Request, res: Response, next: NextFunction) => {

			res.setHeader('Access-Control-Allow-Origin', '*')
			res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
			res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
			
			res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
			res.setHeader('X-Content-Type-Options', 'nosniff')
			res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
		
			res.setHeader('Cache-Control', 'public, max-age=86400')
			
			next()
		})
		app.use(express.static(path.join(__dirname, 'public')))
	}
}

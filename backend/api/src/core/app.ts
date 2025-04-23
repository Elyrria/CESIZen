// src/core/app.ts
import { setupSecurityMiddleware } from "@middlewares/security.middleware.ts"
import { swaggerOptions, swaggerUiOptions } from "@doc/swagger.configs.ts"
import { morganMiddleware, errorLogger } from "@logs/logger.ts"
import userRouter from "@routes/user/user.routes.ts"
import { setupMongoConnection } from "@configs/db.ts"
import type { Request, Response } from "express"
import swaggerUi from "swagger-ui-express"
import swaggerJsdoc from "swagger-jsdoc"
import express from "express"

const app = express()

// Security configutration
setupSecurityMiddleware(app)

if (process.env.NODE_ENV !== "test") {
	app.use(morganMiddleware) // For request logging
}

// Connection to MongoDB
if (process.env.NODE_ENV !== "test") {
	setupMongoConnection()
}

// Generate Swagger specification
const swaggerSpec = swaggerJsdoc(swaggerOptions)
// Setup Swagger UI
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))
// Global error handler middleware
app.use(errorLogger)
// Register API routes
app.use("/api", userRouter)

// /**
//  * Endpoint pour tester le middleware de sanitisation MongoDB
//  */
// app.get("/api/test-sanitize", (req: Request, res: Response) => {
// 	// Exemple d'URL malveillante:
// 	// GET http://localhost:3000/api/test-sanitize?username[$ne]=admin&active[$exists]=true&role[$in][]=admin&role[$in][]=moderator

// 	// Comparer les requêtes originales et sanitizées
// 	const originalQuery = { ...req.query }
// 	const sanitizedQuery = req.getSanitizedQuery()

// 	// // Log pour déboguer
// 	// console.log("Query originale:", originalQuery)
// 	// console.log("Query sanitizée:", sanitizedQuery)

// 	// Retourner les deux pour comparaison
// 	res.status(200).json({
// 		success: true,
// 		message: "Comparaison des requêtes",
// 		original: originalQuery,
// 		sanitized: sanitizedQuery,
// 		attackDetected: JSON.stringify(originalQuery) !== JSON.stringify(sanitizedQuery),
// 	})
// })

// /**
//  * Endpoint pour tester la sanitisation du corps de requête
//  */
// app.post("/api/test-sanitize-body", (req: Request, res: Response) => {
// 	// Exemple de corps malveillant:
// 	/*
//   {
//     "username": "validuser",
//     "password": {
//       "$ne": null
//     },
//     "filter": {
//       "lastLogin": {
//         "$gt": {
//           "$date": "2023-01-01T00:00:00Z"
//         }
//       }
//     }
//   }
//   */

// 	// Comparer les corps originaux et sanitizés
// 	const originalBody = { ...req.body }
// 	const sanitizedBody = req.getSanitizedBody()

// 	// // Log pour déboguer
// 	// console.log("Body original:", originalBody)
// 	// console.log("Body sanitizé:", sanitizedBody)

// 	// Retourner les deux pour comparaison
// 	res.status(200).json({
// 		success: true,
// 		message: "Comparaison des corps de requête",
// 		original: originalBody,
// 		sanitized: sanitizedBody,
// 		attackDetected: JSON.stringify(originalBody) !== JSON.stringify(sanitizedBody),
// 	})
// })

// /**
//  * Endpoint pour tester la sanitisation des paramètres de route
//  */
// app.get("/api/test-sanitize-params/:userId/:action", (req: Request, res: Response) => {
// 	// Exemple: /api/test-sanitize-params/admin$ne/delete$exists

// 	// Comparer les paramètres originaux et sanitizés
// 	const originalParams = { ...req.params }
// 	const sanitizedParams = req.getSanitizedParams()

// 	// // Log pour déboguer
// 	console.log("Params originaux:", originalParams)
// 	console.log("Params sanitizés:", sanitizedParams)

// 	// Retourner les deux pour comparaison
// 	res.status(200).json({
// 		success: true,
// 		message: "Comparaison des paramètres de route",
// 		original: originalParams,
// 		sanitized: sanitizedParams,
// 		attackDetected: JSON.stringify(originalParams) !== JSON.stringify(sanitizedParams),
// 	})
// })

// app.all("/api/test-xss", (req: Request, res: Response) => {
// 	// http://localhost:3000/api/test-xss?input=%3Cscript%3Ealert(%27XSS%27)%3C/script%3E&name=test
// 	res.set("Cache-Control", "no-store")
// 	res.status(200).json({
// 		message: "Résultats du test XSS",
// 		method: req.method,
// 		// Pour une requête GET
// 		originalQuery: { ...req.query },
// 		sanitizedQuery: req,
// 		// Pour une requête POST/PUT
// 		originalBody: req.method !== "GET" ? req.body : undefined,
// 		// Vérifier si des scripts ont été détectés
// 		scriptsDetected: JSON.stringify(req || req).includes("<script>")
// 			? "Scripts non sanitisés!"
// 			: "Sanitization réussie",
// 	})
// })

export default app

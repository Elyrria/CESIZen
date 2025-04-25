import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "API Documentation",
			version: "1.0.0",
			description: "Complete documentation for the REST API",
			contact: {
				name: "API Support",
				email: "support@cesizen.com",
			},
			license: {
				name: "MIT",
				url: "https://opensource.org/licenses/MIT",
			},
		},
		servers: [
			{
				url: process.env.API_URL || "http://localhost:3000",
				description: "Development Server",
			},
			{
				url: "https://api.CESIZen.production.com",
				description: "Production Server",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	// Path to files containing Swagger annotations
	apis: [
		path.join(__dirname, "./**/*.ts"), // Schema definitions in docs folder
		path.join(__dirname, "../src/routes/**/*.ts"), // Route definitions
	],
	defaultModelsExpandDepth: 4,
	defaultModelExpandDepth: 4,
	displayRequestDuration: true,
}

// UI configuration
const swaggerUiOptions = {
	explorer: true,
	customCss: ".swagger-ui .topbar { display: none }",
	customSiteTitle: "Your API Documentation",
	docExpansion: "list",
	deepLinking: true,
}

export { swaggerOptions, swaggerUiOptions }

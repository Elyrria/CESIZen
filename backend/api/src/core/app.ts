// src/core/app.ts
import { setupSecurityMiddleware } from "@api/src/middlewares/security/security.middleware.ts"
import refreshTokenRouter from "@routes/refreshToken/refreshToken.route.ts"
import { swaggerOptions, swaggerUiOptions } from "@doc/swagger.configs.ts"
import informationRouter from "@routes/information/information.route.ts"
import { morganMiddleware, errorLogger } from "@logs/logger.ts"
import { setupMongoConnection } from "@configs/db.configs.ts"
import userRouter from "@routes/user/user.routes.ts"
import swaggerUi from "swagger-ui-express"
import swaggerJsdoc from "swagger-jsdoc"
import { fileURLToPath } from "url"
import express from "express"
import path from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Security configutration
setupSecurityMiddleware(app)

if (process.env.NODE_ENV !== "test") {
	app.use(morganMiddleware) // For request logging
	setupMongoConnection()
	// Generate Swagger specification
	const swaggerSpec = swaggerJsdoc(swaggerOptions)
	// Setup Swagger UI
	app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))
	// Global error handler middleware
}

app.use(errorLogger)
// Register API routes
app.use("/api", userRouter)
app.use("/api", informationRouter)
app.use("/api", refreshTokenRouter)

app.use(express.static(path.join(__dirname, "public")))

export default app

// src/core/app.ts
import { setupSecurityMiddleware } from "@api/src/middlewares/security/security.middleware.ts"
import refreshTokenRouter from "@routes/refreshToken/refreshToken.route.ts"
import { swaggerOptions, swaggerUiOptions } from "@doc/swagger.configs.ts"
import informationRouter from "@routes/information/information.route.ts"
import activityRouter from "@routes/activity/activity.routes.ts"
import categoryRouter from "@routes/category/category.route.ts"
import { morganMiddleware, errorLogger } from "@logs/logger.ts"
import { setupMongoConnection } from "@configs/db.configs.ts"
import userRouter from "@routes/user/user.routes.ts"
import swaggerUi from "swagger-ui-express"
import swaggerJsdoc from "swagger-jsdoc"
import express from "express"
import path from "path"


const app = express()

// Security configutration
setupSecurityMiddleware(app)

if (process.env.NODE_ENV !== "test") {
	let __dirname
	try {
		const mainFilePath = require.main?.filename || ""
		__dirname = path.dirname(mainFilePath)
	} catch (error) {
		__dirname = process.cwd()
	}

	app.use(morganMiddleware) // For request logging
	setupMongoConnection()
	// Generate Swagger specification
	const swaggerSpec = swaggerJsdoc(swaggerOptions)
	// Setup Swagger UI
	app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))
	// Global error handler middleware
	app.use(express.static(path.join(__dirname, "public")))
}

app.use(errorLogger)
// Register API routes
app.use("/api", userRouter)
app.use("/api", informationRouter)
app.use("/api", refreshTokenRouter)
app.use("/api", categoryRouter)
app.use("/api", activityRouter)


export default app

// src/configs/db.ts
import { CONFIGS } from "@configs/global.configs.ts"
import { logger } from "@logs/logger.ts"
import mongoose from "mongoose"
import chalk from "chalk"

export const setupMongoConnection = async (): Promise<void> => {
	try {
		await mongoose.connect(CONFIGS.URI.KEY)
		logger.info(`Connexion à ${chalk.green("MongoDB")} réussie ✅`)

		mongoose.connection.on("error", (err) => {
			logger.error("MongoDB connection error:", err)
		})

		mongoose.connection.on("disconnected", () => {
			logger.warn(chalk.green("MongoDB") + " disconnected ‼️")
		})
	} catch (error) {
		logger.error(`Connexion à ${chalk.green("MongoDB")} échouée ❌`, error)
		process.exit(1)
	}
}

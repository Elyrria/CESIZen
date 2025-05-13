import { initGridFS, deleteFile, uploadToGridFS } from "@services/gridfs.services.ts"
import { CONFIGS } from "@configs/global.configs.ts"
import { logger } from "@logs/logger.ts"
import mongoose from "mongoose"
import chalk from "chalk"

export const setupMongoConnection = async (): Promise<void> => {
	try {
		await mongoose.connect(CONFIGS.URI.KEY)
		logger.info(`Connection to ${chalk.green("MongoDB")} successful ✅`)

		// Initialize GridFS after successful connection
		initGridFS()
		logger.info(`Initialization of ${chalk.green("GridFS")} successful ✅`)

		// Optional test - Create a small test file to verify GridFS is working
		if (process.env.NODE_ENV === "development") {
			try {
				const testBuffer = Buffer.from("GridFS test file")
				const testFileId = await uploadToGridFS(testBuffer, "test-file.txt", "text/plain", {
					test: true,
				})
				logger.info(
					`GridFS test successful, test file created with ID: ${chalk.green(testFileId.toString())}`
				)

				// Optional: Delete the test file immediately
				await deleteFile(testFileId)
				logger.info(`Test file deleted`)
			} catch (testError: any) {
				logger.warn(`GridFS test failed: ${chalk.yellow(testError.message)}`)
				// Do not fail the entire connection due to a test failure
			}
		}

		mongoose.connection.on("error", (err) => {
			logger.error("MongoDB connection error:", err)
		})

		mongoose.connection.on("disconnected", () => {
			logger.warn(chalk.green("MongoDB") + " disconnected !!️")
		})
	} catch (error) {
		logger.error(`Connection to ${chalk.green("MongoDB")} failed ❌`, error)
		process.exit(1)
	}
}

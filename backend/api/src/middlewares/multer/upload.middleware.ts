// src/middlewares/upload.middleware.ts
import type { Request } from "express"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { logger } from "@logs/logger.ts"
import multer from "multer"
import chalk from "chalk"

// Configure memory storage for multer
const storage = multer.memoryStorage()

// Create file filter for allowed types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
	const allowedMimeTypes = [
		// Images
		"image/jpeg",
		"image/png",
		"image/gif",
		"image/webp",
		// Videos
		"video/mp4",
		"video/webm",
		"video/ogg",
	]

	if (allowedMimeTypes.includes(file.mimetype)) {
		logger.info(`Type de fichier accepté: ${chalk.green(file.mimetype)}`)
		cb(null, true)
	} else {
		logger.warn(`Type de fichier refusé: ${chalk.red(file.mimetype)}`)
		cb(new Error(ERROR_CODE.INVALID_FILE_TYPE))
	}
}

// Export multer middleware
export const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 50 * 1024 * 1024, // 50MB limit
	},
})

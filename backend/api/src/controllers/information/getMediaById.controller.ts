import { errorHandler, handleUnexpectedError } from "@errorHandler/errorHandler.ts"
import { ERROR_CODE } from "@errorHandler/configs.errorHandler.ts"
import { streamFile } from "@services/gridfs.services.ts"
import type { Request, Response } from "express"
import { Information } from "@models/index.ts"
import { logger } from "@logs/logger.ts"
import mongoose from "mongoose"
import chalk from "chalk"

/**
 * Controller for retrieving and streaming media files associated with information entries.
 *
 * This controller handles streaming of media files (images, videos, etc.) stored in GridFS
 * to the client. It retrieves the necessary file information from the Information model,
 * then streams the associated file with appropriate content headers.
 *
 * @param {Request} req - The request object containing the information ID as parameter.
 * @param {Response} res - The response object to stream the media file.
 * @returns {Promise<void>} - A promise that resolves when the file is streamed or an error response is sent.
 */
export const getMediaById = async (req: Request, res: Response): Promise<void> => {
	try {
		const informationId = req.params.id
		logger.info(`Retrieving media for information: ${chalk.blue(informationId)}`)

		// Find the information document to get the fileId
		const information = await Information.findById(informationId)

		if (!information) {
			logger.warn(`Information with ID ${chalk.yellow(informationId)} not found`)
			errorHandler(res, ERROR_CODE.INFORMATION_NOT_FOUND)
			return
		}

		if (!information.fileId) {
			logger.warn(`Information ${chalk.yellow(informationId)} has no associated file`)
			errorHandler(res, ERROR_CODE.FILE_REQUIRED)
			return
		}

		// Convert string ID to ObjectId
		const fileIdString: string = information.fileId.toString()
		const fileId = new mongoose.Types.ObjectId(fileIdString)

		try {
			// Use the streamFile function from gridFSService to get file stream and metadata
			const { stream, metadata } = await streamFile(fileId)
			res.setHeader('Access-Control-Allow-Origin', '*')
			res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
			res.set("Content-Type", metadata.contentType || "application/octet-stream")

			// Set cache control headers for better performance
			if (
				[
					"image/jpeg",
					"image/png",
					"image/gif",
					"image/webp",
					"video/mp4",
					"video/webm",
				].includes(metadata.contentType)
			) {
				res.set("Cache-Control", "public, max-age=86400") // Cache for 1 day
				res.set("ETag", fileId.toString())
			} else {
				res.set("Cache-Control", "no-cache") // Don't cache other file types
			}

			// Set content disposition header for download if requested
			if (req.query.download === "true") {
				res.set("Content-Disposition", `attachment; filename="${metadata.filename}"`)
			} else {
				res.set("Content-Disposition", `inline; filename="${metadata.filename}"`)
			}
			if (metadata.length) {
				res.set("Content-Length", metadata.length.toString())
			}

			const clientETag = req.headers['if-none-match']
			if (clientETag === fileId.toString()) {
				res.status(304).end()
				return
			}
			// Log successful streaming start
			logger.info(`Streaming ${chalk.green(metadata.filename)} (${metadata.contentType}) to client`)

			// Stream the file to the response
			stream.pipe(res)

			// Handle streaming errors
			stream.on("error", (error) => {
				logger.error(`Error streaming file ${chalk.red(fileId.toString())}: ${error.message}`)

				// Only send error response if headers haven't been sent yet
				if (!res.headersSent) {
					errorHandler(res, ERROR_CODE.FILE_UPLOAD_FAILED)
				} else {
					res.end() // End the response if headers were already sent
				}
			})
			stream.on("end", () => {
				logger.info(`Successfully streamed ${chalk.green(metadata.filename)} to client`)
			})
		} catch (streamError) {
			logger.error(
				`Failed to retrieve file ${chalk.red(fileId.toString())}: ${(streamError as Error).message}`
			)
			errorHandler(res, ERROR_CODE.INFORMATION_NOT_FOUND)
		}
	} catch (error: unknown) {
		logger.error(`Error retrieving media: ${(error as Error).message}`)
		handleUnexpectedError(res, error as Error)
	}
}

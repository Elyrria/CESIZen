import { logger } from "@logs/logger.ts"
import { GridFSBucket } from "mongodb"
import { Readable } from "stream"
import mongoose from "mongoose"
import chalk from "chalk"

let gridFSBucket: GridFSBucket

/**
 * Initialize GridFS bucket
 */
export const initGridFS = (): void => {
	try {
		if (!mongoose.connection || !mongoose.connection.db) {
			throw new Error("MongoDB connection is not established")
		}
		const db = mongoose.connection.db
		gridFSBucket = new GridFSBucket(db, {
			bucketName: "media",
		})

		// Optionally, create indexes to optimize performance
		db.collection("media.files").createIndex({ filename: 1 })
		db.collection("media.files").createIndex({ uploadDate: 1 })
	} catch (error) {
		logger.error(`Initialization of ${chalk.red("GridFS")} failed ❌`, error)
		throw error
	}
}

/**
 * Get the GridFS bucket instance
 * @returns GridFSBucket instance
 */
export const getGridFSBucket = (): GridFSBucket => {
	if (!gridFSBucket) {
		logger.warn(`${chalk.yellow("GridFS")} is not initialized, attempting initialization...`)
		initGridFS()
	}
	return gridFSBucket
}

/**
 * Upload a file to GridFS
 * @param buffer - File buffer
 * @param filename - Original filename
 * @param contentType - MIME type of the file
 * @param metadata - Additional metadata for the file
 * @returns Promise with file ID
 */
export const uploadToGridFS = async (
	buffer: Buffer,
	filename: string,
	contentType: string,
	metadata: Record<string, any> = {}
): Promise<mongoose.Types.ObjectId> => {
	// Log file upload attempt
	logger.info(`Starting upload to GridFS: ${chalk.blue(filename)} (${buffer.length} bytes)`)
	const startTime = Date.now()

	// Create a readable stream from buffer
	const readableStream = new Readable()
	readableStream.push(buffer)
	readableStream.push(null) // Signal the end of the stream

	// Define upload stream
	const uploadStream = getGridFSBucket().openUploadStream(filename, {
		contentType,
		metadata,
	})

	return new Promise((resolve, reject) => {
		// Pipe the readable stream to the upload stream
		readableStream
			.pipe(uploadStream)
			.on("error", (error) => {
				logger.error(`Error during upload to GridFS: ${chalk.red(filename)}`, error)
				reject(error)
			})
			.on("finish", () => {
				const duration = Date.now() - startTime
				logger.info(`Upload to GridFS completed: ${chalk.green(filename)} in ${duration}ms`)
				resolve(uploadStream.id)
			})
	})
}

/**
 * Stream a file from GridFS
 * @param fileId - ID of the file to read
 * @returns Promise with readable stream and metadata
 */
export const streamFile = async (
	fileId: mongoose.Types.ObjectId
): Promise<{
	stream: NodeJS.ReadableStream
	metadata: any
}> => {
	logger.info(`Retrieving GridFS file with ID: ${chalk.blue(fileId.toString())}`)

	try {
		const files = await getGridFSBucket().find({ _id: fileId }).toArray()

		if (files.length === 0) {
			const errorMsg = `File not found in GridFS: ${chalk.red(fileId.toString())}`
			logger.error(errorMsg)
			throw new Error(errorMsg)
		}

		const fileInfo = files[0]
		const downloadStream = getGridFSBucket().openDownloadStream(fileId)

		logger.info(`Streaming GridFS file: ${chalk.green(fileInfo.filename)}`)

		return {
			stream: downloadStream,
			metadata: fileInfo,
		}
	} catch (error) {
		logger.error(`Error retrieving GridFS file: ${chalk.red(fileId.toString())}`, error)
		throw error
	}
}

/**
 * Delete a file from GridFS
 * @param fileId - ID of the file to delete
 */
export const deleteFile = async (fileId: mongoose.Types.ObjectId): Promise<void> => {
	logger.info(`Deleting GridFS file with ID: ${chalk.red(fileId.toString())}`)

	try {
		await getGridFSBucket().delete(fileId)
		logger.info(`GridFS file successfully deleted: ${chalk.green(fileId.toString())}`)
	} catch (error) {
		logger.error(`Error deleting GridFS file: ${chalk.red(fileId.toString())}`, error)
		throw error
	}
}
